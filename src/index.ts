import moduleAlias from 'module-alias';

moduleAlias.addAliases({
  src: __dirname,
});

import './message-port';
import './shared-memory';
import './timeout';
import './worker-pool';
