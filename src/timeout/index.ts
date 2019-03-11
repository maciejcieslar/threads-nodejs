import os from 'os-utils';

import * as timeout from './timeout';

const average = (collection: number[]) => {
  return (
    collection.reduce((sum, number) => {
      return sum + number;
    }, 0) / collection.length
  );
};

const test = (timeoutFn: any) => {
  return new Promise<{ ms: number; averageCPUCost: number }>((resolve) => {
    const time = Date.now();
    const usages: number[] = [];

    const id = setInterval(() => {
      os.cpuUsage((v: number) => usages.push(v));
    }, 1000);

    timeoutFn(() => {
      clearInterval(id);

      const endTime = Date.now();

      resolve({
        ms: endTime - time,
        averageCPUCost: Number(average(usages).toFixed(4)),
      });
    }, 7000);
  });
};

const nativeTest = () => {
  return test(setTimeout);
};

const ownTest = () => {
  return test(timeout.setTimeout);
};

(async function() {
  console.log('native test');
  const nativeResult = await nativeTest();
  console.log('end of native test', nativeResult);

  console.log('own test');
  const ownResult = await ownTest();
  console.log('end of own test', ownResult);
})();
