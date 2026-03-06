import * as migration_20260228_092125 from './20260228_092125'

export const migrations = [
  {
    up: migration_20260228_092125.up,
    down: migration_20260228_092125.down,
    name: '20260228_092125',
  },
]
