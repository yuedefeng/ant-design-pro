import request from '../utils/request';

export async function queryModule(params) {
  return request('/api/base-modules/page', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function removeModule(params) {
  return request(`/api/base-modules/deleteParent/${params.id}`, {
    method: 'DELETE',
  });
}


export async function createModule(params) {
  return request('/api/base-modules/create', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateModule(params) {
  return request('/api/base-modules/update', {
    method: 'PUT',
    body: {
      ...params,
      method: 'PUT',
    },
  });
}

export async function getModule(params) {
  return request(`/api/base-modules/${params.id}`, {
    method: 'GET',
    body: {
      method: 'GET',
    },
  });
}

export async function getModuleTree() {
  return request('/api/base-modules/tree', {
    method: 'GET',
    body: {
      method: 'GET',
    },
  });
}
export async function getAllTargetId(params) {
  return request(`/api/rolemodule/getselect/${params.id}`, {
    method: 'GET',
    body: {
      method: 'GET',
    },
  });
}
export async function getAllModule() {
  return request('/api/base-modules/list', {
    method: 'POST',
    body: {
      method: 'POST',
    },
  });
}
export async function saveBaseResourcePermissionScopeService(params) {
  return request('/api/rolemodule/save', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function checkRepeat(login) {
  return request('/api/base-modules/checkrepeat', {
    method: 'POST',
    body: {
      login,
      method: 'POST',
    },
  });
}
