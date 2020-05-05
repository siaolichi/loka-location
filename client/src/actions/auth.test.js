import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { storeFactory } from '../utils';
import { signup, loadUser, login } from './auth';

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);

//Set default data
const defaultUser = {
  _id: '12345678',
  name: 'name from token',
  email: 'token@gmail.com'
};
const defaultLoginData = {
  email: 'token@gmail.com',
  password: '12345678'
};
const defaultToken = 'This is a token for localstorage';

/* SETUP AXIOS MOCK FUNCTION */

//Register user
mock.onPost('/api/user').reply(config => {
  const data = JSON.parse(config.data);
  if (data.name && data.email && data.password.length > 6) {
    return [200, { token: defaultToken }];
  } else {
    return [400, { errors: [{ msg: 'signup failed' }] }];
  }
});

// Create profile
mock.onPost('/api/profile').reply(config => {
  // Get profile
  mock.onGet('/api/profile/me').reply(200, JSON.parse(config.data));
  return [200, JSON.parse(config.data)];
});

// Load user with token
mock.onGet('/api/auth').reply(config => {
  if (config.headers['x-auth-token'] === defaultToken) {
    return [200, defaultUser];
  } else {
    return [500, 'Server Error'];
  }
});

// Login user
mock.onPost('/api/auth').reply(config => {
  const data = JSON.parse(config.data);
  if (
    data.email === defaultLoginData.email &&
    data.password === defaultLoginData.password
  ) {
    return [200, { token: defaultToken }];
  } else {
    return [400, { errors: [{ msg: 'Invalid Credentials' }] }];
  }
});

describe('signup', () => {
  let store;

  beforeEach(() => {
    store = storeFactory();
  });

  test('success signup, create empty profile and loadUser', async () => {
    await store.dispatch(
      signup({
        name: 'userName',
        email: 'user@gmail.com',
        password: '12345678'
      })
    );

    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(true);
    expect(state.auth.token).toBe('This is a token for localstorage');
    expect(state.profile.profile).toMatchObject({
      bio: '',
      website: '',
      location: ''
    });
  });

  test('login failed and return alert', async () => {
    await store.dispatch(
      signup({
        name: 'userName',
        email: 'user@gmail.com',
        password: ''
      })
    );
    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.alert[0].msg).toBe('signup failed');
  });
});

describe('loadUser', () => {
  let store;
  beforeEach(() => {
    delete axios.defaults.headers.common['x-auth-token'];
    store = storeFactory();
  });

  test('user load succeed', async () => {
    localStorage.setItem('token', 'This is a token for localstorage');
    await store.dispatch(loadUser());
    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(true);
    expect(state.auth.user).toMatchObject(defaultUser);
  });

  test('user load failed', async () => {
    localStorage.setItem('token', 'This is not a correct token');
    await store.dispatch(loadUser());
    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.user).toBe(null);
  });
});
describe('login', () => {
  let store;

  beforeEach(() => {
    delete axios.defaults.headers.common['x-auth-token'];
    store = storeFactory();
  });

  test('login succeed', async () => {
    await store.dispatch(login(defaultLoginData));
    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(true);
    expect(state.auth.user).toMatchObject(defaultUser);
  });

  test('login failed', async () => {
    await store.dispatch(login({ email: '', password: '' }));
    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.user).toBe(null);
  });
});
