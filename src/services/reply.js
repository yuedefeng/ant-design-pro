import request from '../utils/request';

export async function getForm() {
  return request('/api/wx-auto-replies/form', {
    method: 'GET',
    body: {
      method: 'GET',
    },
  });
}

export async function createForm(params) {
  return request('/api/wx-auto-replies/replycreate', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

