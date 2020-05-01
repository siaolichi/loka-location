import { setAlert } from './alert';
import { storeFactory } from '../utils';

test('show error message correctly', () => {
  const store = storeFactory();
  store.dispatch(setAlert('Alert Message', 'success'));
  const newState = store.getState();
  expect(newState.alert[0].msg).toBe('Alert Message');
  expect(newState.alert[0].alertType).toBe('success');
});
