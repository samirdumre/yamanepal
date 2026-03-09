import * as migration_20260228_092125 from './20260228_092125';
import * as migration_20260306_055845 from './20260306_055845';
import * as migration_20260307_043652 from './20260307_043652';
import * as migration_20260307_104130 from './20260307_104130';
import * as migration_20260308_234442 from './20260308_234442';
import * as migration_20260309_025458 from './20260309_025458';
import * as migration_20260309_062713 from './20260309_062713';
import * as migration_20260309_090043 from './20260309_090043';

export const migrations = [
  {
    up: migration_20260228_092125.up,
    down: migration_20260228_092125.down,
    name: '20260228_092125',
  },
  {
    up: migration_20260306_055845.up,
    down: migration_20260306_055845.down,
    name: '20260306_055845',
  },
  {
    up: migration_20260307_043652.up,
    down: migration_20260307_043652.down,
    name: '20260307_043652',
  },
  {
    up: migration_20260307_104130.up,
    down: migration_20260307_104130.down,
    name: '20260307_104130',
  },
  {
    up: migration_20260308_234442.up,
    down: migration_20260308_234442.down,
    name: '20260308_234442',
  },
  {
    up: migration_20260309_025458.up,
    down: migration_20260309_025458.down,
    name: '20260309_025458',
  },
  {
    up: migration_20260309_062713.up,
    down: migration_20260309_062713.down,
    name: '20260309_062713',
  },
  {
    up: migration_20260309_090043.up,
    down: migration_20260309_090043.down,
    name: '20260309_090043'
  },
];
