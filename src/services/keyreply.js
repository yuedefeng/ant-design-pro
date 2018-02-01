import request from '../utils/request';

export async function queryKeyreply(params) {
  return request('/api/wx-auto-keys/page', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function removeKeyreply(params) {
  return request(`/api/wx-auto-keys/${params.id}`, {
    method: 'DELETE',
  });
}


export async function createKeyreply(params) {
  return request('/api/wx-auto-keys/create', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function updateKeyreply(params) {
  return request('/api/wx-auto-keys/update', {
    method: 'PUT',
    body: {
      ...params,
      method: 'PUT',
    },
  });
}

export async function getKeyreply(params) {
  return request(`/api/wx-auto-keys/${params.id}`, {
    method: 'GET',
    body: {
      ...params,
      method: 'GET',
    },
  });
}

