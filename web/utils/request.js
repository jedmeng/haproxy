import fetch from 'dva/fetch';
import Cookie from 'js-cookie';
import extend from 'extend2';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.error);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
  options = Object.assign({
    credentials: 'same-origin'
  }, options);

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }));
}

export function httpGet(url, options) {
  return request(url, options);
}

export function httpPost(url, data, options) {
  return request(url, extend(true, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'x-csrf-token': Cookie.get('csrfToken')
    }
  }, options))
}