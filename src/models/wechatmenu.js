import { getTree, createWxMenu, updateWxMenu, getWxMenu, removeWxMenuTree, releaseWxMenu } from '../services/wechatmenu';

export default {
  namespace: 'wechatmenu',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    entity: null,
    loading: true,
    treeDate: null,
  },
  effects: {
    // *fetch({ payload }, { call, put }) {
    //   yield put({
    //     type: 'changeLoading',
    //     payload: true,
    //   });
    //   const response = yield call(queryOrganize, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   yield put({
    //     type: 'changeLoading',
    //     payload: false,
    //   });
    // },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(createWxMenu, payload);
      yield put({
        type: 'showEntity',
        payload: response.returnData,
      });
      if (callback) callback(response);
    },
    *removeTree({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(removeWxMenuTree, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      const responseJSON = JSON.parse(response);
      if (callback) callback(responseJSON);
    },
    // *remove({ payload, callback }, { call, put }) {
    //   yield put({
    //     type: 'changeLoading',
    //     payload: true,
    //   });
    //   yield call(removeOrganize, payload);
    //   yield put({
    //     type: 'changeLoading',
    //     payload: false,
    //   });
    //   if (callback) callback();
    // },
    *get({ payload }, { call, put }) {
      const response = yield call(getWxMenu, payload);
      yield put({
        type: 'showEntity',
        payload: response,
      });
    },
    *releaseWxMenu({ payload, callback }, { call }) {
      const response = yield call(releaseWxMenu, payload);
      if (callback) callback(response);
    },
    *getTree({ payload }, { call, put }) {
      const response = yield call(getTree, payload);
      yield put({
        type: 'showTreeData',
        payload: response.returnData,
      });
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateWxMenu, payload);
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
    // *checkRepeat({ payload, callback }, { call }) {
    //   const response = yield call(checkRepeat, payload);
    //   if (callback) callback(response);
    // },
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
    showTreeData(state, action) {
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
