import {createStore, applyMiddleware, compose} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

const getState = (state = {}) => {
  return {
    user: {
      ...state.user
    }
  };
};

const saveState = (state) => {
  try {
    localStorage.setItem("state", JSON.stringify(state));
  } catch (e) {
    return undefined;
  }
};

const loadState = () => {
  try {
    const state = localStorage.getItem("state");
    if (state) {
      return getState(JSON.parse(state));
    } else {
      return getState();
    }
  } catch (e) {
    return getState();
  }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
    applyMiddleware(promiseMiddleware()),
);

const Store = createStore(
    (state, action) => {
      switch (action.type) {
        case 'SUBMIT_USER_DATA_PENDING':
          return {
            ...state,
            loadingStatus: 'PENDING'
          };
        case 'SUBMIT_USER_DATA_FULFILLED':
          return {
            ...state,
            loadingStatus: 'FULFILLED'
          };
        case 'SUBMIT_USER_DATA_REJECTED':
          return {
            ...state,
            loadingStatus: 'REJECTED'
          };
        case 'RESET_LOADING_STATE':
          return {
            ...state,
            loadingStatus: ''
          };
        default:
          return {
            ...state,
            loadingStatus: ''
          };
      }
    },
    loadState(),
    enhancer,
);

Store.subscribe(() => {
  saveState(Store.getState());
});

export default Store;