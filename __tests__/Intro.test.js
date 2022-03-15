import React from 'react';
import renderer from 'react-test-renderer';
import Intro from '../Intro';

jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');

test('renders correctly', () => {
  const tree = renderer.create(<Intro />).toJSON();
  expect(tree).toMatchSnapshot();
});
