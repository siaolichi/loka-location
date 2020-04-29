import React, { Redirect } from 'react';
import { mount, shallow } from 'enzyme';
import { findByTestAttr, storeFactory } from '../../utils';
import Dashboard, { UnconnectedDashboard } from './Dashboard';
import Spinner from './Spinner';
import { MemoryRouter } from 'react-router-dom/cjs/react-router-dom';

const setup = initialState => {
  const store = storeFactory({ ...initialState });
  return mount(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Dashboard store={store} />
    </MemoryRouter>
  );
};
describe('render component in different situations', () => {
  test('authenticated succeeded', () => {
    const wrapper = setup({
      auth: { isAuthenticated: true },
      profile: { loading: false, profile: [] }
    });
    const component = findByTestAttr(wrapper, 'component-dashboard');
    expect(component.exists()).toBe(true);
    const spinner = wrapper.find(Spinner);
    expect(spinner.exists()).toBe(false);
  });
  test('authenticated failed', () => {
    const wrapper = setup({
      auth: { isAuthenticated: false },
      profile: { loading: false }
    });
    const component = findByTestAttr(wrapper, 'component-dashboard');
    expect(component.exists()).toBe(false);
    const spinner = wrapper.find(Spinner);
    expect(spinner.exists()).toBe(false);
    const redirectPath = wrapper.find('Router').props().history.location
      .pathname;
    expect(redirectPath).toBe('/login');
  });
  test('loading', () => {
    const wrapper = setup({
      auth: { isAuthenticated: true },
      profile: { loading: true }
    });
    const component = findByTestAttr(wrapper, 'component-dashboard');
    expect(component.exists()).toBe(false);
    const spinner = wrapper.find(Spinner);
    expect(spinner.exists()).toBe(true);
  });

  test('Call getCurrentProfile when profile in null but authenticated is true and loading is false', () => {
    const getCurrentProfileMock = jest.fn();
    const props = {
      getCurrentProfile: getCurrentProfileMock,
      auth: { isAuthenticated: true },
      profile: {
        loading: false,
        profile: null
      }
    };
    const wrapper = shallow(<UnconnectedDashboard {...props} />);
    const component = findByTestAttr(wrapper, 'component-dashboard');
    expect(component.exists()).toBe(false);
    const spinner = wrapper.find(Spinner);
    expect(spinner.exists()).toBe(true);
    expect(getCurrentProfileMock).toHaveBeenCalled();
  });
});
