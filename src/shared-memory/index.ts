import path from 'path';

import { runWorker } from '../run-worker';

const worker = runWorker(path.join(__dirname, 'worker.js'), (err, { arr }) => {
  if (err) {
    return null;
  }

  console.log(arr[0]);

  arr[0] = 5;

  console.log(arr[0]);
});

worker.postMessage({});
