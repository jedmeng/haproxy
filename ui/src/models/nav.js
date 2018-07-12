export default {
  namespace: 'nav',
  state: {
    collapsed: false
  },
  reducers: {
    'toggle'(state) {
      return Object.assign({}, state, {
        collapsed: !state.collapsed
      });
    },
  },
};
