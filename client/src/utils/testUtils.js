// import Enzyme from 'enzyme';
// import PropTypes from 'prop-types';
import rootReducer from '../reducers';
import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';

export const storeFactory = (initialState = {}) => {
  const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
  return createStoreWithMiddleware(rootReducer, initialState);
};

export const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test='${val}']`);
};

// export const checkProps = (component, props) => {
//   const checkError = PropTypes.checkPropTypes(
//     component.propTypes,
//     props,
//     'prop',
//     component.name
//   );
//   expect(checkError).toBeUndefined();
// };
