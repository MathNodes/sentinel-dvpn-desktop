import { Notification } from 'electron'

class Notifications {
  static create (options) {
    return new Notification({
      title: 'Sentinel DVPN',
      silent: false,
      timeoutType: 'default',
      ...options
    })
  }

  static createCritical (text = 'Unexpected error') {
    return Notifications.create({ body: text, urgency: 'critical', timeoutType: 'never', subtitle: 'Error' })
  }
}

export default Notifications
