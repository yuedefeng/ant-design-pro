import { queryKeyreply, removeKeyreply, createKeyreply, updateKeyreply, getKeyreply } from '../services/keyreply';

export default {
  namespace: 'keyreply',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    entity: null,
    loading: true,
    treeData: null,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryKeyreply, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(createKeyreply, payload);
      yield put({
        type: 'showEntity',
        payload: response.returnData,
      });
      if (callback) callback(response);
    },
    *remove({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(removeKeyreply, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(getKeyreply, payload);
      yield put({
        type: 'showEntity',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateKeyreply, payload);
      yield put({
        type: 'showEntity',
        payload: response.returnData,
      });
      if (callback) callback(response);
    },
    *new({ callback }, { put }) {
      yield put({
        type: 'showEntity',
        payload: null,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    showEntity(state, action) {
      return {
        ...state,
        entity: action.payload,
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
