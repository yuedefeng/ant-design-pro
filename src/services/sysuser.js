import request from '../utils/request';

export async function queryUser(params) {
  return request('/api/base-users/page', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function removeUser(params) {
  return request(`/api/base-users/${params.id}`, {
    method: 'DELETE',
  });
}

export async function createUser(params) {
  return request('/api/base-users/create', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateUser(params) {
  return request('/api/base-users/create', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function getUser(params) {
  return request(`/api/base-users/${params.id}`, {
    method: 'GET',
    body: {
      method: 'GET',
    },
  });
}

export async function getAllUser() {
  return request('/api/base-users/list', {
    method: 'POST',
    body: {
      method: 'POST',
    },
  });
}

export async function checkRepeat(login) {
  return request('/api/base-users/checkrepeat', {
    method: 'POST',
    body: {
      login,
      method: 'POST',
    },
  });
}
