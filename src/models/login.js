import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';
import { setAuthority } from '../utils/authority';
import { storeAuthenticationToken, clearAuthenticationToken } from '../utils/token';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: response.status === 200 ? 'ok' : 'error',
          type: 'account',
          Authorization: response.headers.get('Authorization'),
          rememberMe: payload.rememberMe,
        },
      });
      // Login successfully
      if (response.status === 200) {
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        })
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      /** ±£¥ÊJava Web Token */
      let jwt = '';
      if (payload.status === 'ok') {
        const bearerToken = payload.Authorization;
        if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
          jwt = bearerToken.slice(7, bearerToken.length);
          storeAuthenticationToken(jwt, payload.rememberMe);
        }
      } else {
        clearAuthenticationToken();
      }
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
