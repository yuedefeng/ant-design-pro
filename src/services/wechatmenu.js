import request from '../utils/request';

// export async function queryWxMenu(params) {
//   return request('/api/base-organizes/page', {
//     method: 'POST',
//     body: {
//       ...params,
//       method: 'POST',
//     },
//   });
// }
export async function removeWxMenu(params) {
  return request(`/api/wx-menus/${params.id}`, {
    method: 'DELETE',
  });
}
export async function removeWxMenuTree(params) {
  return request(`/api/wx-menusByfollowid/${params.id}`, {
    method: 'DELETE',
  });
}
export async function createWxMenu(params) {
  return request('/api/wx-menus/my', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}
export async function releaseWxMenu() {
  return request('/api/wx-menus/create', {
    method: 'POST',
    body: {
      method: 'POST',
    },
  });
}
export async function getWxMenu(params) {
  return request(`/api/wx-menus/${params.id}`, {
    method: 'GET',
    body: {
      method: 'GET',
    },
  });
}
export async function getTree() {
  return request('/api/wx_menu/tree', {
    method: 'GET',
    body: {
      method: 'GET',
    },
  });
}
export async function updateWxMenu(params) {
  return request('/api/wx-menus/my', {
    method: 'PUT',
    body: {
      ...params,
      method: 'PUT',
    },
  });
}
