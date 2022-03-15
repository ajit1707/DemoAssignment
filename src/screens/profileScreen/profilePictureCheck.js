import React, {PureComponent} from 'react';
import {
  Modal,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Icon from '../../utility/icons';
import Styles from './style';
import Config from '../../utility/config';
import {fontMaker} from '../../utility/helper';
import Color from '../../utility/colorConstant';
import Constant from '../../utility/constant';
import {VectorIcon} from '../../components/VectorIcons';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const borderRadius = 10;

export const ProfilePictureCheckModal = (props) => {
  const {channelsPayload, modalVisible, showModal, currentChannelData} = props;
  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => {}}>
      <View style={styles.modalViewContainer}>
        <View style={styles.modalSubView}>
          <View style={styles.header}>
            <Text numberOfLines={1} style={styles.headerText}>
              Information
            </Text>
            <TouchableOpacity
              accessibilityLabel="Close group information pop-up"
              accessibilityRole="button"
              onPress={showModal}
              style={styles.crossButtonContainer}>
              <Image source={Icon.CROSS_ICON} style={styles.crossIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.bodyOfProfile}>
            <Text style={styles.headerData}>
              Please add a profile image that is appropriate and that you feel
              will represent you well on the site
            </Text>
            <Text style={styles.appropriate}>
              Appropriate profile images are:
            </Text>
            <View style={styles.details}>
              <VectorIcon
                iconName="check"
                iconType="entypo"
                color="#7FFF00"
                iconSize={20}
              />
              <Text>A head and shoulders photograph of you</Text>
            </View>
            <View style={styles.details}>
              <VectorIcon
                name="check"
                iconType="entypo"
                color="#7FFF00"
                iconSize={20}
              />
              <Text>A picture of a pet, landscape of nature</Text>
            </View>
            <View style={styles.details}>
              <VectorIcon
                name="check"
                iconType="entypo"
                color="#7FFF00"
                iconSize={20}
              />
              <Text>A picture that demonstrates a hobby or interest</Text>
            </View>
          </View>
          <Text style={styles.appropriate}>
            Inappropriate profile images are:
          </Text>
          <View style={styles.details}>
            <VectorIcon
              name="cross"
              iconType="entypo"
              iconSize={20}
              color="#B30000"
            />
            <Text>Pictures that contain other people or groups</Text>
          </View>
          <View style={styles.details}>
            <VectorIcon
              name="cross"
              iconType="entypo"
              iconSize={20}
              color="#B30000"
            />
            <Text>Pictures that display identifying information</Text>
          </View>
          <View style={styles.details}>
            <VectorIcon
              name="cross"
              iconType="entypo"
              iconSize={20}
              color="#B30000"
            />
            <Text>Pictures with offensive or suggestive imagery</Text>
          </View>
          <Text style={styles.projects}>
            Some projects may have different criteria for profile pictures -
            please chat to us through the support channel if you have any
            questions.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  details: {
    flexDirection: 'row',
    paddingHorizontal: 11,
    paddingTop: 4,
  },
  headerData: {
    color: '#666',
    ...fontMaker('bold'),
    paddingHorizontal: 11,
    fontSize: 15,
  },
  appropriate: {
    color: '#666',
    ...fontMaker('bold'),
    paddingHorizontal: 11,
    fontSize: 15,
    paddingTop: 5,
  },
  projects: {
    paddingHorizontal: 11,
    paddingTop: 7,
  },
  bodyOfProfile: {
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  modalSubView: {
    height: deviceHeight * 0.66,
    width: deviceWidth * 0.9,
    borderRadius,
    backgroundColor: '#fff',
  },
  header: {
    height: 55,
    width: deviceWidth * 0.9,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  crossButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  crossIcon: {
    height: 13,
    width: 13,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 17,
  },
  nameText: {
    color: '#444444',
    ...fontMaker('semibold'),
    fontSize: 17,
  },
  lastTimeText: {
    color: '#ccc',
    ...fontMaker('semibold'),
    fontSize: 14,
    paddingTop: 2,
  },
  headerText: {
    fontSize: 18,
    paddingLeft: 110,
    width: '70%',
    color: '#000',
    ...fontMaker('semibold'),
  },
});

ProfilePictureCheckModal.defaultProps = {
  currentChannelData: null,
  modalVisible: false,
  userDetail: null,
  channelsPayload: null,
  showModal: () => {},
};

ProfilePictureCheckModal.propTypes = {
  currentChannelData: PropTypes.object,
  modalVisible: PropTypes.bool,
  userDetail: PropTypes.object,
  showModal: PropTypes.func,
  channelsPayload: PropTypes.object,
};
