import { useStore } from 'vuex'
import { syncStoreValue } from '@/client/store/plugins/syncStore'
import useSubscription from '@/client/hooks/useSubscription'

export default function useConnect () {
  const store = useStore()
  const { checkSubscriptionActivity, promptSubscription } = useSubscription()

  const clearPreviousNodeState = async () => {
    await store.dispatch('clearSelectedNode')
    await store.dispatch('clearSubscriptionForNode')
    await store.dispatch('clearQuota')
  }

  const connect = async (node) => {
    if (node.address === store.getters.connectedNode?.address) return
    if (store.getters.isConnectionLoading) return

    try {
      await store.dispatch('setConnectionLoadingState', true)
      const isNextSubscriptionActive = await checkSubscriptionActivity(node)

      if (!isNextSubscriptionActive) {
        promptSubscription(node)
        await store.dispatch('setConnectionLoadingState', false)
        return
      }

      await clearPreviousNodeState()
      await store.dispatch('selectNode', node)
      await syncStoreValue('selectedNode', node)
      await store.dispatch('connectToNode')
    } catch (e) {
      await store.dispatch('setConnectionLoadingState', false)
    }
  }

  return { connect }
}
