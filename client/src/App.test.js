import React from 'react';
import App from './App';
import { shallow } from 'enzyme';
import { findByTestAttr } from './utils';

const setup = () => {
  return shallow(<App />);
};

test('renders component without error', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'component-app');
  expect(component.exists()).toBe(true);
});
