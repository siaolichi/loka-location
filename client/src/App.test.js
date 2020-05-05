import React from 'react';
import App from './App';
import { shallow } from 'enzyme';
import { findByTestAttr } from './utils';
import { storeFactory } from './utils';
const store = storeFactory();
const setup = () => {
  return shallow(<App store={store} />)
    .dive()
    .dive();
};

test('renders component without error', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'component-app');
  expect(component.exists()).toBe(true);
});
