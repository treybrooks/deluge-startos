import { sdk } from './sdk'
// import { manifest as delugeManifest } from 'deluge-startos/startos/manifest'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting Deluge!')

  const depResult = await sdk.checkDependencies(effects)
  depResult.throwIfNotSatisfied()

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects, started).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'deluge' },
      sdk.Mounts.of()
        .mountVolume({
          volumeId: 'config',
          subpath: null,
          mountpoint: '/config', 
          readonly: false,
        }).mountVolume({
          volumeId: 'downloads',
          subpath: null,
          mountpoint: '/downloads', 
          readonly: false,
        }),
      // .mountDependency<typeof delugeManifest>({
      //   dependencyId: 'hello-world',
      //   volumeId: 'main',
      //   subpath: null,
      //   mountpoint: '/hello-world',
      //   readonly: true,
      // }),
      'hello-moon-sub',
    ),
    exec: {
      command: ['/init'], runAsInit: true, env: {
        DELUGE_LOGLEVEL: 'info',
        PUID: '1000',
        PGID: '1000'
      }
    },
    ready: {
      display: 'Web Interface',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: 'The web interface is ready',
          errorMessage: 'The web interface is unreachable',
        }),
    },
    requires: [], 
  })
})
