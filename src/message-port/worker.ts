import { parentPort, MessagePort } from 'worker_threads';

parentPort.on('message', (data) => {
  const { port }: { port: MessagePort } = data;

  port.postMessage('heres your message!');
});
