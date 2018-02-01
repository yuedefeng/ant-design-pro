import {
  searchBaseResourcePermissions,
  deleteBaseResourcePermission,
  getRolePermission,
  saveRolePermission,
  updateBaseResourcePermission,
  getAllBaseResourcePermissions,
} from '../services/resourcepermission';

export default {
  namespace: 'resourcepermission',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    entity: null,
    loading: true,
    treeData: null,
    Allid: null,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(searchBaseResourcePermissions, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *save({ payload, callback }, { call }) {
      const response = yield call(saveRolePermission, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(deleteBaseResourcePermission, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(getRolePermission, payload);
      yield put({
        type: 'showAllid',
        payload: response.returnData,
      });
      if (callback) callback(response.returnData);
    },
    *getTree({ payload, callback }, { call, put }) {
      const response = yield call(getAllBaseResourcePermissions, payload);
      yield put({
        type: 'showTree',
        payload: response.returnData,
      });
      if (callback) callback(response.returnData);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateBaseResourcePermission, payload);
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
    showAllid(state, action) {
      return {
        ...state,
        Allid: action.payload,
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
