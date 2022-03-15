import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const LinearGradientBackground = (props) => (
  <LinearGradient {...props}>{props.children}</LinearGradient>
);

export default LinearGradientBackground;
