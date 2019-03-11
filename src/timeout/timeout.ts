import { Worker } from 'worker_threads';
import path from 'path';
import uuidv4 from 'uuid/v4';

import { runWorker } from '../run-worker';

const timeoutState: { [key: string]: Worker } = {};

export function cancelTimeout(id: string) {
  if (timeoutState[id]) {
    timeoutState[id].terminate();

    timeoutState[id] = undefined;

    return true;
  }

  return false;
}

export function setTimeout(callback: (err: any) => any, time: number) {
  const id = uuidv4();

  const worker = runWorker(
    path.join(__dirname, './worker.js'),
    (err) => {
      if (!timeoutState[id]) {
        return null;
      }

      timeoutState[id] = null;

      if (err) {
        return callback(err);
      }

      callback(null);
    },
    {
      time,
    },
  );

  timeoutState[id] = worker;

  return id;
}

const intervalState: { [key: string]: string } = {};

export function cancelInterval(id: string) {
  const timeoutId = intervalState[id];

  if (timeoutId) {
    intervalState[id] = undefined;
    cancelTimeout(timeoutId);

    return true;
  }

  return false;
}

export function setInterval(callback: () => any, time: number) {
  const id = uuidv4();

  function execute() {
    const timeoutId = setTimeout(() => {
      callback();

      execute();
    }, time);

    intervalState[id] = timeoutId;
  }

  execute();

  return id;
}
