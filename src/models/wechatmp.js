import { getMaterialNews, getMaterialNewsBatch, createMaterialNews } from '../services/wechatmp';

export default {
  namespace: 'wechatmp',

  state: {
    createResult: {},
    loading: true,
    materialInfo: {},
    list: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getMaterialNewsBatch, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getMaterialNews, payload);
      yield put({
        type: 'showMaterialInfo',
        payload: response,
      });
    },
    *create({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(createMaterialNews, payload);
      yield put({
        type: 'createResponse',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    createResponse(state, action) {
      return {
        ...state,
        createResult: action.payload,
      };
    },
    showMaterialInfo(state, action) {
      return {
        ...state,
        materialInfo: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
