const initialState = {toggled: false};


export default function menu(state = initialState, action) {
  switch(action.type) {
    case 'toggle-menu':
      return Object.assign({}, state, {
        toggled: !state.toggled
      });
    case 'hide-menu':
      return Object.assign({}, state, {
        toggled: false
      });
    default:
      return state;
  }
};
