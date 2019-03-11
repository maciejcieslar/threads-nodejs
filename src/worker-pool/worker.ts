import { isMainThread, parentPort } from 'worker_threads';

if (isMainThread) {
  throw new Error('Its not a worker');
}

const doCalcs = (data: any) => {
  const collection = [];

  for (let i = 0; i < 1000000; i += 1) {
    collection[i] = Math.round(Math.random() * 100000);
  }

  return collection.sort((a, b) => {
    if (a > b) {
      return 1;
    }

    return -1;
  });
};

let index = 0;

parentPort.on('message', (data) => {
  console.log('starting job');
  index += 1;
  const result = doCalcs(data);

  parentPort.postMessage(result);
  console.log('end of job', index);
});
