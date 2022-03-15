import React from 'react';
import {ImageBackground} from 'react-native';
import PropTypes from 'prop-types';
import Icons from '../utility/icons';
import Styles from './Styles';

const Background = (props) => (
  <ImageBackground source={Icons.BACKGROUND} style={Styles.background}>
    {props.children}
  </ImageBackground>
);

Background.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Background;
