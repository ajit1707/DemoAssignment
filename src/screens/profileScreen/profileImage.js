import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Style from './style';

const ProfileImage = (props) => {
  const {
    imagePayload,
    image,
    sideMenuItems,
    selectProfileImage,
    userName,
  } = props;
  return (
    <View style={[Style.imageContainer]}>
      <View style={Style.imageButton}>
        {image.uri ? (
          <Image
            accessible
            accessibilityLabel={`Profile picture of ${userName}`}
            accessibilityRole="image"
            style={Style.profileImage}
            source={
              !imagePayload.fileData ? image : {uri: imagePayload.fileData.url}
            }
          />
        ) : null}

        <TouchableOpacity
          accessibilityLabel="Change profile picture"
          accessibilityRole="button"
          onPress={selectProfileImage}
          activeOpacity={0.8}
          style={[
            Style.selectImageButton,
            {backgroundColor: sideMenuItems.sideMenuColor},
          ]}>
          <View accessible={false} style={Style.cameraIcon}>
            <FontAwesome
              accessible={false}
              name="camera"
              size={22}
              color="#fff"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

ProfileImage.defaultProps = {
  imagePayload: null,
  image: null,
  sideMenuItems: null,
  userName: '',
};

ProfileImage.propTypes = {
  imagePayload: PropTypes.object,
  image: PropTypes.object,
  userName: PropTypes.string,
  sideMenuItems: PropTypes.object,
  selectProfileImage: PropTypes.func.isRequired,
};

export default ProfileImage;
