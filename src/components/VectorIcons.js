import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import PropTypes from 'prop-types';

export const VectorIcon = (props) => {
  const {iconName, iconType, color, iconSize} = props;
  let iconComponent = (
    <MaterialIcons {...props} name={iconName} size={iconSize} color={color} />
  );
  if (iconType === 'ant') {
    iconComponent = (
      <AntIcons {...props} name={iconName} size={iconSize} color={color} />
    );
  }
  if (iconType === 'ionic') {
    iconComponent = (
      <Ionicons {...props} name={iconName} size={iconSize} color={color} />
    );
  }
  if (iconType === 'entypo') {
    iconComponent = (
      <Entypo {...props} name={iconName} size={iconSize} color={color} />
    );
  }
  if (iconType === 'materialCommunity') {
    iconComponent = (
      <MaterialCommunityIcons
        {...props}
        name={iconName}
        size={iconSize}
        color={color}
      />
    );
  }
  return iconComponent;
};

VectorIcon.propTypes = {
  name: PropTypes.string.isRequired,
  iconType: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number,
};

VectorIcon.defaultProps = {
  onDismiss: () => null,
  iconType: 'material',
  color: '#000',
  size: 25,
};
