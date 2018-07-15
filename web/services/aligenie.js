import { httpGet, httpPost } from '../utils/request';

const prefix = '/api/aligenie';

export function fetch() {
  return httpGet(`${prefix}/fetch`);
}

export function setConfig(id, config) {
  return httpPost(`${prefix}/setconfig`, { id, config });
}