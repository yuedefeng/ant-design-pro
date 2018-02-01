import request from '../utils/request';

export async function queryOrganize(params) {
  return request('/api/base-organizes/page', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}
export async function removeOrganize(params) {
  return request(`/api/base-organizes/${params.id}`, {
    method: 'DELETE',
  });
}
export async function removeOrganizeTree(params) {
  return request(`/api/base-organizesByParentID/${params.id}`, {
    method: 'DELETE',
  });
}
export async function createOrganize(params) {
  return request('/api/base-organizes/my', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}
export async function getOrganize(params) {
  return request(`/api/base-organizes/${params.id}`, {
    method: 'GET',
    body: {
      method: 'GET',
    },
  });
}
export async function getTree() {
  return request('/api/base-organizes/tree', {
    method: 'GET',
    body: {
      method: 'GET',
    },
  });
}
export async function checkRepeat(login) {
  return request('/api/base-organizes/checkrepeat', {
    method: 'POST',
    body: {
      login,
      method: 'POST',
    },
  });
}
export async function updateOrganize(params) {
  return request('/api/base-organizes/update', {
    method: 'PUT',
    body: {
      ...params,
      method: 'PUT',
    },
  });
}
