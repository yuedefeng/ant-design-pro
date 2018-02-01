import { queryRole, removeRole, createRole, updateRole, getRole, checkRepeat } from '../services/sysrole';

export default {
  namespace: 'sysrole',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    entity: null,
    loading: true,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryRole, payload);
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
      const response = yield call(createRole, payload);
      yield put({
        type: 'showEntity',
        payload: response.returnData,
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(removeRole, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getRole, payload);
      yield put({
        type: 'showEntity',
        payload: response,
      });
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRole, payload);
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
    *checkRepeat({ payload, callback }, { call }) {
      const response = yield call(checkRepeat, payload);
      if (callback) callback(response);
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
