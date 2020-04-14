import config from '../config';

export const INTEGRATE = config.get('/app/integrate');
export const CONTEXT = config.get('/app/context');
export const PORTAL = config.get('/app/portal');
export const GATEWAY = config.get('/gateway/domain');
export const APP_NAME = config.get('/app/config/appName');
//APP_CODE use for resource module
export const APP_CODE = config.get('/app/config/appCode');
export const COPYRIGHT = config.get('/app/config/copyright');
export const BACKEND = config.get('/backend/url');
export const PROVENCE_NAME = config.get("/app/provence/name");
export const PROVENCE_CODE = config.get("/app/provence/code");
export const PROVENCE_SHORT_CODE = config.get("/app/provence/shortCode");
export const TASK_CONDITION = config.get("/app/task/condition");
export const PROCESS_SIMPLE = config.get("/app/process/simple");
