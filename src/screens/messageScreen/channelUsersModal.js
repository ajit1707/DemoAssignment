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

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const borderRadius = 10;

class ChannelUserModal extends PureComponent {
  getMessengerName = (payload) => {
    const {currentChannelData} = this.props;
    return payload.type === 'channel_users' &&
      currentChannelData.channelId === payload.attributes.channel_id
      ? payload.attributes.display_name
      : '';
  };

  getMessengerImage = (payload) => {
    let imageURL;
    if (payload.attributes.avatar_id.includes('brightside-assets')) {
      imageURL = `${Config.IMAGE_SERVER_CDN}resize/500x500/${payload.attributes.avatar_id}`;
    } else {
      imageURL = payload.attributes.avatar_id;
    }
    return imageURL;
  };

  filterChannelUsers = (channelPayload) => {
    const {currentChannelData, userDetail} = this.props;
    if (userDetail && userDetail.data.length) {
      const userData = userDetail.included.filter(
        (item) => item.type === 'users',
      );
      if (currentChannelData) {
        if (channelPayload) {
          return channelPayload.filter(
            (payload) =>
              payload.type === 'channel_users' &&
              currentChannelData.channelId === payload.attributes.channel_id &&
              userData[0].id !== payload.attributes.user_id.toString(),
          );
        }
      }
    }
    return [];
  };

  itemSeparator = () => <View style={styles.itemView} />;

  renderItems = (item) => (
    <React.Fragment>
      {this.getMessengerName(item) ? (
        <TouchableOpacity
          accessible={false}
          activeOpacity={0.9}
          disabled
          style={styles.itemContainer}>
          <View accessible style={styles.circleImageContainer}>
            <Image
              accessibilityLabel={`Profile picture of ${this.getMessengerName(
                item,
              )}`}
              accessibilityRole="image"
              accessible
              source={{uri: this.getMessengerImage(item)}}
              style={Styles.circleImage}
            />
          </View>
          <View style={styles.nameView}>
            <Text style={styles.nameText}>{item.attributes.display_name}</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </React.Fragment>
  );

  render() {
    const {
      channelsPayload,
      modalVisible,
      showModal,
      currentChannelData,
    } = this.props;
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
                {currentChannelData && currentChannelData.channelName}
              </Text>
              <TouchableOpacity
                accessibilityLabel="Close group information pop-up"
                accessibilityRole="button"
                onPress={showModal}
                style={styles.crossButtonContainer}>
                <Image source={Icon.CROSS_ICON} style={styles.crossIcon} />
              </TouchableOpacity>
            </View>
            <FlatList
              style={styles.listStyle}
              ref={(ref) => {
                this.flatListRef = ref;
              }}
              data={this.filterChannelUsers(
                channelsPayload && channelsPayload.included,
              )}
              extraData={this.props}
              renderItem={({item, index}) => this.renderItems(item, index)}
              bounces={false}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  itemView: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    marginHorizontal: 20,
  },
  nameView: {
    flexDirection: 'column',
    paddingHorizontal: 15,
  },
  listStyle: {
    marginVertical: 5,
  },
  modalSubView: {
    height: deviceHeight * 0.7,
    width: deviceWidth * 0.9,
    borderRadius,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    width: deviceWidth * 0.9,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: Color.CHANNEL_SEPARATOR_COLOR,
    borderBottomWidth: 0.5,
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
    paddingLeft: 15,
    width: '70%',
    color: '#000',
    ...fontMaker('semibold'),
    textAlign: 'center',
  },
});

ChannelUserModal.defaultProps = {
  currentChannelData: null,
  modalVisible: false,
  userDetail: null,
  channelsPayload: null,
  showModal: () => {},
};

ChannelUserModal.propTypes = {
  currentChannelData: PropTypes.object,
  modalVisible: PropTypes.bool,
  userDetail: PropTypes.object,
  showModal: PropTypes.func,
  channelsPayload: PropTypes.object,
};

const mapStateToProps = (state) => ({
  currentChannelData: state.channelMessage.currentChannelData,
  channelsPayload: state.getchannels.channelsPayload,
  userDetail: state.getUserDetail.userDetailPayload,
});

export default connect(mapStateToProps)(ChannelUserModal);
