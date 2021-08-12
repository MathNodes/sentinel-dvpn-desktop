const { contextBridge, ipcRenderer } = require('electron')

const validChannels = ['NODE_LIST', 'SUBSCRIPTION_LIST', 'CONNECT_TO_NODE', 'CLI_INPUT', 'DISCONNECT', 'SUBSCRIBE_TO_NODE', 'QUOTA']

contextBridge.exposeInMainWorld(
  'ipc', {
    send: (channel, data) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    },
    on: (channel, func) => {
      if (validChannels.includes(channel)) {
        // Strip event as it includes `sender` and is a security risk
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    },
    once: (channel, func) => {
      if (validChannels.includes(channel)) {
        // Strip event as it includes `sender` and is a security risk
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    }
  }
)
