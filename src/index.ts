import { createWorker } from './worker';

export { IntegrationDurableObject } from './dos/integration';
export { PingDurableObject } from './dos/ping';

export default createWorker();
