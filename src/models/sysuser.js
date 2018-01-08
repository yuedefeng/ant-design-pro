import { queryUser, removeUser, createUser, updateUser, getUser, checkRepeat } from '../services/sysuser';

export default {
  namespace: 'sysuser',

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
      const response = yield call(queryUser, payload);
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
      const response = yield call(createUser, payload);
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
      yield call(removeUser, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getUser, payload);
      yield put({
        type: 'showEntity',
        payload: response,
      });
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, payload);
      yield put({
        type: 'showEntity',
        payload: response.returnData,
      });
      if (callback) callback(response);
    },
    *new({ put }) {
      yield put({
        type: 'showEntity',
        payload: null,
      });
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
