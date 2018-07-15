import { fetch, setConfig } from '../services/aligenie';
const extend = require('extend');

export default {

  namespace: 'aligenie',

  state: {
    devices: []
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch(_, { call, put }) {  // eslint-disable-line
      const res = yield call(fetch);
      yield put({
        type: 'setDeiceList',
        payload: res.data
      });
    },

    *setConfig({ payload }, { call, put }) {  // eslint-disable-line
      yield put({
        type: 'beforeUpdateConfig',
        payload: payload
      });
      const res = yield call(setConfig, payload.id, payload.config);
      if (!res.data.success) {
        throw new Error('set config error');
      }
      yield put({
        type: 'updateConfig',
        payload: payload
      });
    },
  },

  reducers: {
    setDeiceList(state, action) {
      return extend(true, {}, state, {
        devices: action.payload
      });
    },

    beforeUpdateConfig(state, action) {
      const { id } = action.payload;
      return extend(true, {}, state, {
        sending: id
      });
    },

    updateConfig(state, action) {
      const { id, config } = action.payload;

      const newState = extend(true, {}, state, {
        sending: false
      });

      const device = newState.devices.find(device => device.id === id);
      extend(true, device, { config });

      return newState;
    }
  },

};
