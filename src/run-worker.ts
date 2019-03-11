import { Worker } from 'worker_threads';

type WorkerCallback = (err: any, result?: any) => any;

export function runWorker(path: string, cb: WorkerCallback, workerData: object | null = null) {
  const worker = new Worker(path, { workerData });

  worker.on('message', cb.bind(null, null));
  worker.on('error', cb);

  worker.on('exit', (exitCode) => {
    if (exitCode === 0) {
      return null;
    }

    return cb(new Error(`Worker has stopped with code ${exitCode}`));
  });

  return worker;
}
