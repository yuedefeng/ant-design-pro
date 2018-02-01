import { queryModule, removeModule, createModule, updateModule, getModuleTree, getModule, checkRepeat, saveBaseResourcePermissionScopeService, getAllTargetId } from '../services/sysmodule';

export default {
  namespace: 'sysmodule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    entity: null,
    loading: true,
    treeData: null,
    AllTargetId: null,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryModule, payload);
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
      const response = yield call(createModule, payload);
      yield put({
        type: 'showEntity',
        payload: response.returnData,
      });
      if (callback) callback(response);
    },
    *saveScope({ payload, callback }, { call, put }) {
      const response = yield call(saveBaseResourcePermissionScopeService, payload);
      yield put({
        type: 'showEntity',
        payload: response.returnData,
      });
      if (callback) callback(response);
    },
    *getTree({ payload, callback }, { call, put }) {
      const response = yield call(getModuleTree, payload);
      yield put({
        type: 'showTree',
        payload: response.returnData,
      });
      if (callback) callback(response.returnData);
    },
    *getAllTargetId({ payload, callback }, { call, put }) {
      const response = yield call(getAllTargetId, payload);
      yield put({
        type: 'showAllTargetId',
        payload: response.returnData,
      });
      if (callback) callback(response.returnData);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeModule, payload);
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(removeModule, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      const responseJson = JSON.parse(response);
      if (callback) callback(responseJson);
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getModule, payload);
      yield put({
        type: 'showEntity',
        payload: response,
      });
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateModule, payload);
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
    showTree(state, action) {
      return {
        ...state,
        treeData: action.payload,
      };
    },
    showAllTargetId(state, action) {
      return {
        ...state,
        AllTargetId: action.payload,
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
