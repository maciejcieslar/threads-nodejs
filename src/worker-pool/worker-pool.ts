import { Worker } from 'worker_threads';

type QueueCallback<N> = (err: any, result?: N) => void;

interface QueueItem<T, N> {
  callback: QueueCallback<N>;
  getData: () => T;
}

export class WorkerPool<T, N> {
  private queue: QueueItem<T, N>[] = [];
  private workersById: { [key: number]: Worker } = {};
  private activeWorkersById: { [key: number]: boolean } = {};

  public constructor(public workerPath: string, public numberOfThreads: number) {
    this.init();
  }

  private init() {
    if (this.numberOfThreads < 1) {
      return null;
    }

    for (let i = 0; i < this.numberOfThreads; i += 1) {
      const worker = new Worker(this.workerPath);

      this.workersById[i] = worker;
      this.activeWorkersById[i] = false;
    }
  }

  private getInactiveWorkerId(): number {
    for (let i = 0; i < this.numberOfThreads; i += 1) {
      if (!this.activeWorkersById[i]) {
        return i;
      }
    }

    return -1;
  }

  private async runWorker(workerId: number, queueItem: QueueItem<T, N>) {
    const worker = this.workersById[workerId];

    this.activeWorkersById[workerId] = true;

    const messageCallback = (result: N) => {
      queueItem.callback(null, result);

      cleanUp();
    };

    const errorCallback = (error: any) => {
      queueItem.callback(error);

      cleanUp();
    };

    const cleanUp = () => {
      worker.removeAllListeners('message');
      worker.removeAllListeners('error');

      this.activeWorkersById[workerId] = false;

      if (!this.queue.length) {
        return null;
      }

      this.runWorker(workerId, this.queue.shift());
    };

    worker.once('message', messageCallback);
    worker.once('error', errorCallback);

    worker.postMessage(await queueItem.getData());
  }

  public run(getData: () => T) {
    return new Promise<N>((resolve, reject) => {
      const availableWorkerId = this.getInactiveWorkerId();

      const queueItem: QueueItem<T, N> = {
        getData,
        callback: (error, result) => {
          if (error) {
            return reject(error);
          }

          return resolve(result);
        },
      };

      if (availableWorkerId === -1) {
        this.queue.push(queueItem);

        return null;
      }

      this.runWorker(availableWorkerId, queueItem);
    });
  }
}
