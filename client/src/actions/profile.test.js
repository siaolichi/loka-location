import profile from './profile';
import moxios from 'moxios';

describe('getCurrentProfile', () => {
  beforeEach(() => {
    moxios.install();
  });
  describe('success', () => {
    test('updates profile after get profile', () => {});
    test('sets loading to false after got repsonse', () => {});
  });
  describe('failed', () => {
    test('sets isAuthenticated to false', () => {});
    test('sets loading to false after got repsonse', () => {});
  });
  afterEach(() => {
    moxios.uninstall();
  });
});
