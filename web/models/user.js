import { login } from "../services/user";
import { setAuthority } from "../utils/authority";

export default {
  namespace: 'user',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call }) {
      const response = yield call(login, payload);
      if (!response) {
        window.location = window.webRoot;
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};