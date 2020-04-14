import request from '../utils/request';

export async function login(data) {
  return request('/gateway/ui/au/authenticate', {
    method: 'POST',
    body: data,
  });
}
