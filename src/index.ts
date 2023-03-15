// Imports
import RLN from './rln'
import Registry from './registry'
import Cache from './cache'

if (typeof process === 'undefined') {
  global.process = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // @ts-expect-error: in browser process is not defined and thus the typing is incorrect
    browser: true,
    env: {
      ENVIRONMENT: 'BROWSER',
    },
  }
}

// Exports for RLN
export {
  RLN,
  Registry,
  Cache,
}

// Export RLN types
export {
  StrBigInt,
  RLNFullProof,
  Proof,
  RLNPublicSignals,
} from './types'