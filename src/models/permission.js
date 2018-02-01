import { queryPermission, removePermission, createPermission, updatePermission,
  getPermission, checkRepeat, getPermissionTree, removePermissionTree } from '../services/permission';

export default {
  namespace: 'permission',

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
      const response = yield call(queryPermission, payload);
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
      const response = yield call(createPermission, payload);
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
      yield call(removePermission, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      if (callback) callback();
    },
    *removeTree({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(removePermissionTree, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      const responseJson = JSON.parse(response);
      if (callback) callback(responseJson);
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getPermission, payload);
      yield put({
        type: 'showEntity',
        payload: response,
      });
    },
    *getTree({ payload }, { call, put }) {
      const response = yield call(getPermissionTree, payload);
      yield put({
        type: 'showTree',
        payload: response.returnData,
      });
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updatePermission, payload);
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
    *newchildren({ payload, callback }, { put }) {
      yield put({
        type: 'showEntity',
        payload: { parentID: payload.parentID },
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
    showTree(state, action) {
      return {
        ...state,
        treeData: action.payload,
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
