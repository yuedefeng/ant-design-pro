import request from '../utils/request';

export async function queryPermission(params) {
  return request('/api/base-permissions/page', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}
export async function removePermission(params) {
  return request(`/api/base-permissions/${params.id}`, {
    method: 'DELETE',
    body: {
      method: 'DELETE',
    },
  });
}

export async function removePermissionTree(params) {
  return request(`/api/base-permissions/deleteParent/${params.id}`, {
    method: 'DELETE',
    body: {
      method: 'DELETE',
    },
  });
}

export async function getPermissionTree() {
  return request('/api/base-permissions/tree', {
    method: 'GET',
    body: {
      method: 'GET',
    },
  });
}

export async function createPermission(params) {
  return request('/api/base-permissions/create', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updatePermission(params) {
  return request('/api/base-permissions/update', {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}

export async function getPermission(params) {
  return request(`/api/base-permissions/${params.id}`, {
    method: 'GET',
    body: {
      method: 'GET',
    },
  });
}

export async function getAllPermission() {
  return request('/api/base-permissions/list', {
    method: 'POST',
    body: {
      method: 'POST',
    },
  });
}

export async function checkRepeat(login) {
  return request('/api/base-permissions/checkrepeat', {
    method: 'POST',
    body: {
      login,
      method: 'POST',
    },
  });
}

