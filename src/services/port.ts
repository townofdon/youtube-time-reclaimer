import { PORT_NAME } from '../constants';

export const port = chrome.runtime.connect({ name: PORT_NAME });
