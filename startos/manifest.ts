import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const architectures =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'deluge',
  title: 'Deluge',
  license: 'GPL-3',
  wrapperRepo: 'https://github.com/Start9Labs/deluge-startos',
  upstreamRepo: 'https://github.com/linuxserver/docker-deluge',
  supportSite: 'https://docs.start9.com/',
  marketingSite: 'https://start9.com/',
  docsUrl:
    'https://github.com/Start9Labs/deluge-startos/blob/master/instructions.md',
  donationUrl: 'https://donate.start9.com/',
  description: {
    short: 'Simple implementation of Deluge for StartOS',
    long: 'Simple implementation of Deluge for StartOS',
  },
  volumes: ['config', 'downloads'],
  images: {
    'deluge': {
      source: {
        dockerTag: 'lscr.io/linuxserver/deluge:2.2.0',
      },
      arch: architectures,
    } as SDKImageInputSpec,
  },
  hardwareRequirements: {
    arch: architectures,
  },
  alerts: {
    install: 'Default webUI password: deluge',
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    // 'hello-world': {
    //   description: 'A moon needs a world',
    //   optional: true,
    //   s9pk: 'https://github.com/Start9Labs/hello-world-startos/releases/download/v0.4.0.0/hello-world.s9pk',
    // },
  },
})
