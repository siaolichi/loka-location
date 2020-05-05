import {
  getCurrentProfile,
  createProfile,
  addGroupToProfile,
  removeGroupToProfile
} from './profile';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { storeFactory } from '../utils';

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);
const store = storeFactory();

describe('getCurrentProfile', () => {
  describe('success', () => {
    let newState;
    const successProfile = {
      user: {
        name: 'test user',
        email: 'a@b.com'
      },
      wersite: ''
    };
    beforeEach(async () => {
      mock.onGet('/api/profile/me').reply(200, successProfile);
      await store.dispatch(getCurrentProfile());
      newState = store.getState();
    });

    test('updates profile after get profile', () => {
      expect(newState.profile.profile).toMatchObject(successProfile);
    });

    test('sets loading to false after got repsonse', async () => {
      expect(newState.profile.loading).toBe(false);
    });
  });

  describe('failed', () => {
    let newState;

    beforeEach(async () => {
      mock.onGet('/api/profile/me').reply(500, 'Server Error');
      await store.dispatch(getCurrentProfile());
      newState = store.getState();
    });

    test('sets error in message', () => {
      const errorMsg = { msg: 'Server Error', status: 500 };
      expect(newState.profile.error).toMatchObject(errorMsg);
    });

    test('sets loading to false after got repsonse', () => {
      expect(newState.profile.loading).toBe(false);
    });
  });
});

describe('createProfile', () => {
  test('success', async () => {
    const editProfile = {
      user: {
        name: 'test user',
        email: 'a@b.com'
      },
      wersite: 'edited website'
    };
    mock.onPost('/api/profile').reply(config => {
      mock.onGet('/api/profile/me').reply(200, JSON.parse(config.data));
      return [200, editProfile];
    });
    // console.log('Create profile');
    await store.dispatch(createProfile(editProfile, false));
    const newState = store.getState();
    expect(newState.profile.profile).toMatchObject(editProfile);
  });

  test('failed', async () => {
    const errorMsg = { msg: 'Server Error', status: 500 };
    mock.onPost('/api/profile').networkErrorOnce();
    await store.dispatch(createProfile({}));
    const newState = store.getState();
    expect(newState.profile.error).toMatchObject(errorMsg);
  });
});

describe('edit groups', () => {
  const initProfile = {
    user: {
      name: 'test user',
      email: 'a@b.com'
    },
    wersite: '',
    groups: ['Bubble tea in Berlin', 'Restaurants in Berlin']
  };

  beforeEach(() => {
    mock.onGet('/api/profile/me').reply(200, initProfile);
    mock.onPost('/api/profile').reply(config => {
      mock.onGet('/api/profile/me').reply(200, JSON.parse(config.data));
      return [200, config.data];
    });
  });

  describe('addGroupToProfile', () => {
    test('success', async () => {
      await store.dispatch(addGroupToProfile('Bars in Taipei'));
      const newState = store.getState();
      expect(newState.profile.profile.groups).toEqual([
        'Bubble tea in Berlin',
        'Restaurants in Berlin',
        'Bars in Taipei'
      ]);
    });

    test('fail', async () => {
      const errorMsg = { msg: 'Server Error', status: 500 };
      mock.onPost('/api/profile').networkErrorOnce();
      await store.dispatch(addGroupToProfile());
      const newState = store.getState();
      expect(newState.profile.error).toMatchObject(errorMsg);
    });
  });

  describe('removeGroupToProfile', () => {
    test('success', async () => {
      await store.dispatch(removeGroupToProfile('Bubble tea in Berlin'));
      const newState = store.getState();
      expect(newState.profile.profile.groups).toEqual([
        'Restaurants in Berlin'
      ]);
    });

    test('fail', async () => {
      const errorMsg = { msg: 'Server Error', status: 500 };
      mock.onPost('/api/profile').networkErrorOnce();
      await store.dispatch(removeGroupToProfile());
      const newState = store.getState();
      expect(newState.profile.error).toMatchObject(errorMsg);
    });
  });
});
