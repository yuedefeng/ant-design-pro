import request from '../utils/request';

export async function getMaterialNews(params) {
  return request(`/api/wechatmp/material-news/${params.mediaId}`, {
    method: 'GET',
    body: {
      method: 'GET',
    },
  });
}

export async function getMaterialNewsBatch(params) {
  return request('/api/wechatmp/material-news/list', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function createMaterialNews(params) {
  return request('/api/wechatmp/material-news/create', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function createMaterialNewsList(params) {
  return request('/api/wechatmp/material-news/create-list', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

