import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../../configureStore';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import { LoginPage } from '../Login';

describe('<Login />', () => {
  it('it should render correctly', () => {
    const output = shallow(
      <Provider store={store}>
        <LoginPage />
      </Provider>,
    );
    expect(shallowToJson(output)).toMatchSnapshot();
  });
});
