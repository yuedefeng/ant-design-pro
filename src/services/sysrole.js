import request from '../utils/request';

export async function queryRole(params) {
  return request('/api/base-roles/page', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function removeRole(params) {
  return request(`/api/base-roles/${params.id}`, {
    method: 'DELETE',
  });
}

export async function createRole(params) {
  return request('/api/base-roles/create', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRole(params) {
  return request('/api/base-roles/update', {
    method: 'PUT',
    body: {
      ...params,
      method: 'PUT',
    },
  });
}


export async function getRole(params) {
  return request(`/api/base-roles/${params.id}`, {
    method: 'GET',
    body: {
      method: 'GET',
    },
  });
}

export async function getAllRole() {
  return request('/api/base-role/list', {
    method: 'POST',
    body: {
      method: 'POST',
    },
  });
}

export async function checkRepeat(login) {
  return request('/api/base-roles/checkrepeat', {
    method: 'POST',
    body: {
      login,
      method: 'POST',
    },
  });
}
