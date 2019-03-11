import { parentPort, workerData } from 'worker_threads';

const time = Date.now();

while (true) {
  if (time + workerData.time <= Date.now()) {
    parentPort.postMessage({});
    break;
  }
}
