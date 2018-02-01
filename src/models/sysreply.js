import { getForm, createForm } from '../services/reply';

export default {
  namespace: 'sysreply',
  state: {
    loading: true,
    entity: null,
    data: null,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getForm, payload);
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
      const response = yield call(createForm, payload);
      yield put({
        type: 'showEntity',
        payload: response.returnData,
      });
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
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    showEntity(state, action) {
      return {
        ...state,
        entity: action.payload,
      };
    },
  },
};

