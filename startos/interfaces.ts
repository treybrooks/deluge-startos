import { sdk } from './sdk'
import { uiPort, inboundTorrentTraffic } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // Web UI
  const uiMulti = sdk.MultiHost.of(effects, 'ui')
  const uiMultiOrigin = await uiMulti.bindPort(uiPort, { protocol: 'http' })

  const ui = sdk.createInterface(effects, {
    name: 'Web UI',
    id: 'webui',
    description: 'The web interface of Deluge',
    type: 'ui',
    schemeOverride: null,
    masked: false,
    username: null,
    path: '',
    query: {},
  })

  const uiReceipt = await uiMultiOrigin.export([ui])

  // Inbound Traffic
  const inboundMulti = sdk.MultiHost.of(effects, 'inbound')
  const inboundMultiOrigin = await inboundMulti.bindPort(inboundTorrentTraffic, {
    protocol: null,
    preferredExternalPort: inboundTorrentTraffic,
    addSsl: null,
    secure: { ssl: false },
  })

  const inbound = sdk.createInterface(effects, {
    name: 'inbound traffic',
    id: 'inbound',
    description: 'The inbound traffic port for Deluge',
    type: 'p2p',
    schemeOverride: null,
    masked: false,
    username: null,
    path: '',
    query: {},
  })

  const inboundReceipt = await inboundMultiOrigin.export([inbound])

  return [uiReceipt, inboundReceipt]
})
