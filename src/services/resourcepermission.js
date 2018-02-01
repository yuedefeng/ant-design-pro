import request from '../utils/request';

export async function searchBaseResourcePermissions(params) {
  return request('/api/_search/base-resource-permissions', {
    method: 'Get',
    body: {
      ...params,
      method: 'Get',
    },
  });
}
export async function deleteBaseResourcePermission(params) {
  return request(`/api/base-resource-permissions/${params.id}`, {
    method: 'DELETE',
  });
}
export async function getRolePermission(params) {
  return request(`/api/role-permissions/${params.id}`, {
    method: 'GET',
    body: {
      method: 'GET',
    },
  });
}
export async function saveRolePermission(params) {
  return request('/api/role-permissions/save', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function updateBaseResourcePermission(params) {
  return request('/api/base-resource/permissions', {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}
export async function getAllBaseResourcePermissions() {
  return request('/api/base-permissions/tree', {
    method: 'Get',
    body: {
      method: 'Get',
    },
  });
}
