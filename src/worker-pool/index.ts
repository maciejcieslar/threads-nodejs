import path from 'path';

import { WorkerPool } from './worker-pool';

const pool = new WorkerPool<{ i: number }, number>(path.join(__dirname, './worker.js'), 8);

const items = [...new Array(100)].fill(null);

Promise.all(
  items.map(async (_, i) => {
    await pool.run(() => ({ i }));

    console.log('finished', i);
  }),
).then(() => {
  console.log('finished all');
});
