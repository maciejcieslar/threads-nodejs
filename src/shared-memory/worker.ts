import { parentPort } from 'worker_threads';

parentPort.on('message', () => {
  const numberOfElements = 100;
  const sharedBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * numberOfElements);
  const arr = new Int32Array(sharedBuffer);

  for (let i = 0; i < numberOfElements; i += 1) {
    arr[i] = Math.round(Math.random() * 30);
  }

  console.log(arr[0]);

  parentPort.postMessage({ arr });

  setTimeout(() => {
    console.log(arr[0]);
  }, 10000);
});
