import React, { Redirect } from 'react';
import { shallow } from 'enzyme';
import { findByTestAttr, storeFactory } from '../../utils';
import Profile from './Profile';
import CreateProfile from './CreateProfile';

const defaultProps = { profile: { user: { email: '', name: '' } } };

const setup = (initialState, initialProps) => {
  const setupProps = { ...defaultProps };
  return shallow(<Profile {...setupProps} />);
};

test('renders component without error', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'component-profile');
  expect(component.exists()).toBe(true);
  const profileElements = findByTestAttr(wrapper, 'profile-element');
  expect(profileElements.length).toBeGreaterThan(4);
});
test('when click edit profile', () => {
  const wrapper = setup();
  const editButton = findByTestAttr(wrapper, 'edit-button');
  expect(editButton.exists()).toBe(true);
  editButton.simulate('click');
  const createProfileComponent = wrapper.find(CreateProfile);
  expect(createProfileComponent.exists()).toBe(true);
});
