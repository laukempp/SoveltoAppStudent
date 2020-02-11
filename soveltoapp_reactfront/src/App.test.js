import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { shallow } from '../enzyme';
import Routes from '../src/layout/Routes'

test('renders without crashing', () => {
  const app = shallow(<App/>);
  expect(app.containsAnyMatchingElements([<div><Routes/></div>])).toBe(true);
});
