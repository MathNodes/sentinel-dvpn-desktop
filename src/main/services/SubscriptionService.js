import { QueryQuotaRequest, QuerySubscriptionRequest, QuerySubscriptionsForNodeRequest, QuerySubscriptionsForAddressRequest } from '@/main/proto/sentinel/subscription/v1/querier_pb'
import { QueryServiceClient as SubscriptionQueryServiceClient } from '@/main/proto/sentinel/subscription/v1/querier_grpc_pb'
import Client from '@/main/services/CustomClient'
import { Status } from '@/main/proto/sentinel/types/v1/status_pb'
import { DVPN_KEY_NAME } from '@/shared/constants'
import { MsgSubscribeToNodeRequest, MsgCancelRequest } from '@/main/proto/sentinel/subscription/v1/msg_pb.js'
import AccountService from '@/main/services/AccountService'
import { Coin } from '@/main/proto/cosmos/base/v1beta1/coin_pb.js'
import { Any } from '@/main/proto/google/protobuf/any_pb'
import { BroadcastMode } from '@/main/proto/cosmos/tx/v1beta1/service_pb'
import TransactionService from '@/main/services/TransactionService'
import SessionService from '@/main/services/SessionService'

class SubscriptionService {
  constructor () {
    this.client = new Client(SubscriptionQueryServiceClient)
    this.accountService = new AccountService()
    this.transactionService = new TransactionService()
    this.sessionService = new SessionService()
  }

  async queryQuota (id, address) {
    const request = new QueryQuotaRequest([id, address])
    const response = await this.client.call('queryQuota', request)
    const { quota } = response.toObject()
    const bytesPerGb = Math.pow(1000, 3)
    const allocatedGb = (Number(quota.allocated) / bytesPerGb)
    const consumedGb = (Number(quota.consumed) / bytesPerGb)
    const balanceGb = allocatedGb - consumedGb

    quota.allocatedGb = allocatedGb.toFixed(2)
    quota.consumedGb = consumedGb.toFixed(2)
    quota.balanceGb = balanceGb.toFixed(2)

    return quota
  }

  async querySubscription (id) {
    const request = new QuerySubscriptionRequest([id])
    const response = await this.client.call('querySubscription', request)

    const { subscription } = response.toObject()
    return subscription
  }

  async querySubscriptionsForNode (address, account) {
    const request = new QuerySubscriptionsForNodeRequest([address])
    const response = await this.client.call('querySubscriptionsForNode', request)

    return response.getSubscriptionsList().map(s => s.toObject()).filter(s => s.owner === account)
  }

  async querySubscriptionsForAddress (address) {
    const request = new QuerySubscriptionsForAddressRequest([address, Status.STATUS_ACTIVE])
    const response = await this.client.call('querySubscriptionsForAddress', request)

    return response.getSubscriptionsList().map(s => s.toObject())
  }

  async querySubscriptionForAddressAndNode (address, node) {
    const subs = await this.querySubscriptionsForAddress(address)
    return subs.filter(s => s.node === node)
  }

  async querySubscriptionForAddress (address, node) {
    const subscriptions = await this.querySubscriptionsForAddress(address)
    return subscriptions
      .filter(s => s.node === node)
      .pop()
  }

  async subscribeToNode (to, deposit) {
    const key = await this.accountService.queryKeyByName(DVPN_KEY_NAME)
    const coin = new Coin([deposit.denom, deposit.amount])
    const msg = new MsgSubscribeToNodeRequest([key.addressBech32, to])
    msg.setDeposit(coin)
    const msgAny = new Any(['/sentinel.subscription.v1.MsgService/MsgSubscribeToNode', msg.serializeBinary()])

    return await this.transactionService.broadcastMessages([msgAny], BroadcastMode.BROADCAST_MODE_BLOCK)
  }

  async cancelSubscriptionsForNode (address, node) {
    const subscriptions = await this.querySubscriptionForAddressAndNode(address, node)
    const msgCancels = subscriptions.map(({ id }) => new MsgCancelRequest([address, id]))
    const anyMsgCancels = msgCancels.map(msg => new Any(['/sentinel.subscription.v1.MsgService/MsgCancel', msg.serializeBinary()]))
    const anyMsgStops = await this.sessionService.getSessionMsgEndAny(address)

    return await this.transactionService.broadcastMessages([...anyMsgStops, ...anyMsgCancels], BroadcastMode.BROADCAST_MODE_BLOCK, subscriptions.length)
  }
}

export default SubscriptionService
