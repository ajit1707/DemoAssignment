import React, {Component} from 'react';
import {View, Text, Keyboard, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import moment from 'moment';
import Style from './style';
import {Form} from '../../components';
import {setSideMenuItems} from '../../modules/getProjects';
import {withImageUploader} from '../../components/withImageUploader';
import Constant from '../../utility/constant';
import {validate} from '../../utility/validator';
import {errorHandler} from '../../modules/errorHandler';
import {
  getProfileDetail,
  updateProfileDetail,
  getIncludedProjectUser,
  updateNotificationPreferences,
  getProjectUser,
} from '../../modules/profile';
import {uploadAttachments} from '../../modules/uploadAttachments';
import {getUserDetails} from '../../modules/getUserDetail';
import Config from '../../utility/config';
import ProfileForm from './profileForm';
import CheckBox from '../../components/CheckBox';
import {profileNavigationOptions} from '../../navigators/Root';
import ProfileImage from './profileImage';
import {logEventForAnalytics} from '../../utility/firebase-utils';
import {channelsUser} from '../../modules/channelsUser';
import {getChannels} from '../../modules/getChannels';
import {postMentorFile, projectMatch} from '../../modules/typeformMentee';
import {typeformMentorData} from '../../modules/typeformMentor';
import {channelDeselected} from '../../modules/displayChannelItems';
import Toast from 'react-native-simple-toast';
import {ProfilePictureCheckModal} from '../profileScreen/profilePictureCheck';

const actionSheetOptions = {
  options: ['Take Photo', 'Photo Library', 'Cancel'],
  fileType: ['camera', 'gallery', 'cancel'],
};

const cancelIndex = {
  buttonIndex: 2,
};

export const navigationOption = ({navigation, screenProps}) => ({
  ...profileNavigationOptions(
    {navigation, screenProps},
    'My Account',
    navigation.state.params && navigation.state.params.handleSubmit,
    navigation.state.params && navigation.state.params.showModal,
  ),
});

class ProfileScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    ...navigationOption({navigation, screenProps}),
  });

  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      postalCode: '',
      dob: '',
      datePickerVisible: false,
      initialDate: moment().subtract(5, 'year').toDate(),
      image: {uri: ''},
      displayName: '',
      isCheckBoxSelected: false,
      previousState: '',
      isImageSelected: false,
      selectedImageData: '',
      isImageSelectedFromGallery: true,
      modalVisible: false,
    };
  }

  resetState = () => {
    this.setState(
      {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        postalCode: '',
        dob: '',
        datePickerVisible: false,
        initialDate: moment().subtract(5, 'year').toDate(),
        image: {uri: ''},
        modalVisible: false,
        displayName: '',
        isCheckBoxSelected: false,
        previousState: '',
        isImageSelected: false,
        selectedImageData: '',
        isImageSelectedFromGallery: true,
      },
      () => {
        this.getUserProfileDetail();
      },
    );
  };

  componentDidMount() {
    const {
      screenProps: {emitter},
      navigation: {setParams},
    } = this.props;
    emitter.on('updateProfile', () => {
      this.resetState();
    });
    setParams({
      showModal: this.showModal,
    });
    this.resetState();
  }
  componentDidUpdate() {
    const {imagePayload, userDetailPayload} = this.props;
    const {isImageSelected, isImageSelectedFromGallery} = this.state;
    let projectUserId = '';
    if (
      imagePayload.eventType === 'imageSelected' &&
      isImageSelected &&
      isImageSelectedFromGallery === true
    ) {
      if (userDetailPayload && userDetailPayload.included.length) {
        if (userDetailPayload.included[0].hasOwnProperty('id')) {
          projectUserId = userDetailPayload.included[0].id;
          this.uploadProfileImage(projectUserId);
        }
      }
    }
  }
  componentWillUnmount() {
    const {
      screenProps: {emitter},
    } = this.props;
    emitter.emit('setSideMenuItemIndex', 0);
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.imagePayload &&
      props.imagePayload.eventType === 'cancel' &&
      state.isImageSelected
    ) {
      return {
        isImageSelected: false,
      };
    }

    if (props.imagePayload && props.imagePayload.eventType === 'openPicker') {
      return {
        isImageSelected: true,
      };
    }
    if (
      props.imagePayload &&
      props.imagePayload.eventType === 'imageSelected'
    ) {
      return {
        selectedImageData: props.imagePayload,
      };
    }
    return null;
  }
  navigateToMentorDetails = () => {
    const {
      dispatch,
      navigation: {navigate},
    } = this.props;
    navigate('MentorQuestionScreen', {channelData: true});
  };
  onCheckBoxSelect = () => {
    const {isCheckBoxSelected} = this.state;
    this.setState({isCheckBoxSelected: !isCheckBoxSelected});
  };
  showModal = () => {
    const {modalVisible} = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };
  getUserProfileDetail = () => {
    const {
      dispatch,
      navigation: {setParams},
    } = this.props;
    setParams({
      handleSubmit: this.handleSubmit,
      handleBackButtonNavigation: this.handleBackButtonNavigation,
    });
    dispatch(getProjectUser()).then(() => {
      dispatch(getIncludedProjectUser()).then((includedUserPayload) => {
        dispatch(getProfileDetail()).then((res) => {
          const avatarId = res.data.attributes.avatar_id;
          this.setState(
            {
              firstName: res.data.attributes.first_name,
              lastName: res.data.attributes.last_name,
              email: res.data.attributes.email,
              postalCode: res.data.attributes.postcode,
              phoneNumber: res.data.attributes.phone_number,
              initialDate: moment(res.data.attributes.dob).toDate(),
              dob: res.data.attributes.dob,
              displayName: `${res.data.attributes.first_name} ${res.data.attributes.last_name}`,
              image: {
                uri: avatarId.includes('brightside-assets')
                  ? `${Config.IMAGE_SERVER_CDN}resize/1280x1280/${avatarId}`
                  : avatarId,
              },
              isCheckBoxSelected:
                includedUserPayload.data.attributes
                  .receive_message_notifications,
            },
            () => {
              this.setState({
                previousState: this.state,
              });
            },
          );
        });
      });
    });
  };

  getDate = (date) => {
    this.setState({dob: date});
  };

  handleBackButtonNavigation = () => {
    const {navigation, dispatch, fetching} = this.props;
    if (!fetching) {
      dispatch(errorHandler());
      navigation.navigate('LandingScreen');
    }
  };

  handleTextChange = (field) => (text) => {
    const newState = {};
    newState[field] = text;
    this.setState(newState);
  };

  uploadProfileImage = (projectUserId) =>
    new Promise((resolve) => {
      const {
        dispatch,
        imagePayload: {
          fileData: {url, format, filename},
        },
      } = this.props;
      this.setState({isImageSelectedFromGallery: false});
      const fileData = new FormData();
      fileData.append('file', {
        uri: url,
        type: format,
        name: filename,
      });
      dispatch(
        uploadAttachments(fileData, `users/${projectUserId}/edit`),
      ).then(() => resolve(this.updateImageDetail(projectUserId)));
    });
  updateImageDetail = (projectUserId) =>
    new Promise((resolve) => {
      const {dispatch, uploadedAttachmentsData} = this.props;
      const {isImageSelected} = this.state;
      let imageData = {};
      if (isImageSelected) {
        imageData = {
          avatar_content_type: uploadedAttachmentsData.data.format,
          avatar_filename: uploadedAttachmentsData.data.filename,
          avatar_id: uploadedAttachmentsData.data.id,
          avatar_size: uploadedAttachmentsData.data.size,
        };
      }
      const userData = {
        data: {
          id: projectUserId,
          type: 'users',
          attributes: {
            ...imageData,
          },
        },
        id: projectUserId,
      };
      dispatch(updateProfileDetail(userData)).then((profileData) => {
        resolve();
        if (
          isImageSelected &&
          profileData &&
          profileData.data &&
          profileData.data.attributes &&
          profileData.data.attributes.is_avatar_in_moderation === true
        ) {
          Toast.showWithGravity(
            Constant.PROFILE_PICTURE_NEEDS_TO_BE_APPROVED,
            Toast.LONG,
            Toast.BOTTOM,
          );
        } else if (
          isImageSelected &&
          profileData &&
          profileData.data &&
          profileData.data.attributes &&
          profileData.data.attributes.is_avatar_in_moderation === false
        ) {
          Toast.showWithGravity(
            Constant.PROFILE_PICTURE_UPDATED_SUCCESSFULLY,
            Toast.LONG,
            Toast.BOTTOM,
          );
        }
        dispatch(getUserDetails());
        this.setState({
          isImageSelected: false,
          isImageSelectedFromGallery: true,
        });
      });
    });
  updateProfileDetail = (projectUserId) =>
    new Promise((resolve) => {
      const {dispatch, uploadedAttachmentsData} = this.props;
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        postalCode,
        dob,
      } = this.state;
      const userData = {
        data: {
          id: projectUserId,
          type: 'users',
          attributes: {
            first_name: firstName,
            last_name: lastName,
            email,
            phone_number: phoneNumber,
            postcode: postalCode,
            dob: moment(dob).format('YYYY-MM-DD'),
          },
        },
        id: projectUserId,
      };
      dispatch(updateProfileDetail(userData)).then(() => {
        resolve();
        dispatch(getUserDetails());
        this.setState({
          previousState: this.state,
          displayName: `${userData.data.attributes.first_name} ${userData.data.attributes.last_name}`,
        });
      });
    });

  updateNotificationPreferences = (projectUserPayload) =>
    new Promise((resolve) => {
      const {isCheckBoxSelected} = this.state;
      const {
        dispatch,
        userDetail,
        projectSessionPayload,
        selectedProjectPayload,
      } = this.props;
      const notificationPreferencesData = {
        data: {
          id: projectUserPayload.data[0].id,
          type: 'project_users',
          attributes: {
            receive_message_notifications: isCheckBoxSelected ? '1' : '0',
          },
        },
      };
      dispatch(updateNotificationPreferences(notificationPreferencesData)).then(
        () => {
          resolve();
          this.setState({
            previousState: this.state,
          });
        },
      );
    });

  selectProfileImage = () => {
    const {showActionSheet} = this.props;
    this.setState(
      {
        isImageSelected: true,
      },
      () => {
        showActionSheet();
      },
    );
  };

  handleSubmit = async () => {
    logEventForAnalytics('user_profile', {});
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      postalCode,
      dob,
      isCheckBoxSelected,
      previousState,
    } = this.state;
    const {
      dispatch,
      projectUserPayload,
      fetching,
      projectSessionPayload,
      selectedProjectPayload,
      userDetail,
    } = this.props;
    const promises = [];
    Keyboard.dismiss();
    let isProjectArchived = false;
    if (
      projectSessionPayload &&
      projectSessionPayload.data &&
      projectSessionPayload.data.length &&
      projectSessionPayload.data[0].attributes === true
    ) {
      isProjectArchived = projectSessionPayload.data[0].attributes.is_archived;
    }
    if (
      selectedProjectPayload &&
      selectedProjectPayload.data &&
      selectedProjectPayload.data.attributes === true
    ) {
      isProjectArchived = selectedProjectPayload.data.attributes.is_archived;
    }
    if (
      userDetail &&
      userDetail.data &&
      userDetail.data.length &&
      userDetail.data[0].attributes &&
      userDetail.data[0].attributes.is_archived === true
    ) {
      isProjectArchived = userDetail.data[0].attributes.is_archived;
    }
    const validationError =
      (email && validate('email', email.trim())) ||
      (phoneNumber && validate('phoneNumber', phoneNumber)) ||
      validate('postalCode', postalCode);
    if (!fetching) {
      if (!firstName.trim()) {
        dispatch(errorHandler(Constant.INVALID_FIRST_NAME));
      } else if (!lastName.trim()) {
        dispatch(errorHandler(Constant.INVALID_LAST_NAME));
      } else if (validationError) {
        dispatch(errorHandler(validationError));
      } else if (!phoneNumber && !email) {
        dispatch(errorHandler(Constant.EMAIL_PHONE_MESSAGE));
      } else if (validationError) {
        dispatch(errorHandler(validationError));
      } else {
        const userDetail = await AsyncStorage.getItem(
          Constant.ASYNC_KEYS.USER_DATA,
          () => {},
        );
        const projectUserId = JSON.parse(userDetail).included[0].id;
        if (
          previousState.firstName !== firstName ||
          previousState.lastName !== lastName ||
          previousState.email !== email ||
          previousState.phoneNumber !== phoneNumber ||
          previousState.postalCode !== postalCode ||
          previousState.dob !== dob
        ) {
          promises.push(this.updateProfileDetail(projectUserId));
        }
        if (isProjectArchived === false) {
          if (isCheckBoxSelected !== previousState.isCheckBoxSelected) {
            promises.push(
              this.updateNotificationPreferences(projectUserPayload),
            );
          }
        }
        Promise.all(promises).then(() => {
          dispatch(errorHandler(Constant.ACCOUNT_UPDATE_MESSAGE, 'Success'));
        });
      }
    }
  };

  render() {
    const {
      imagePayload,
      fetching,
      sideMenuItems,
      projectSessionPayload,
      navigation: {navigate},
      selectedProjectPayload,
      userDetailPayload,
      userDetail,
    } = this.props;
    const {
      displayName,
      initialDate,
      datePickerVisible,
      image,
      isCheckBoxSelected,
      dob,
      isImageSelected,
      modalVisible,
      selectedImageData,
    } = this.state;
    let isProjectArchived = false;
    if (
      projectSessionPayload &&
      projectSessionPayload.data &&
      projectSessionPayload.data.length &&
      projectSessionPayload.data[0].attributes.is_archived === true
    ) {
      isProjectArchived = projectSessionPayload.data[0].attributes.is_archived;
    }
    if (
      selectedProjectPayload &&
      selectedProjectPayload.data &&
      selectedProjectPayload.data.attributes.is_archived === true
    ) {
      isProjectArchived = selectedProjectPayload.data.attributes.is_archived;
    }
    if (
      userDetail &&
      userDetail.data &&
      userDetail.data.length &&
      userDetail.data[0].attributes &&
      userDetail.data[0].attributes.is_archived === true
    ) {
      isProjectArchived = userDetail.data[0].attributes.is_archived;
    }
    const checkBoxText = 'I want to receive new message notifications';
    return (
      <Form barStyle="light-content" fetching={fetching} showAlertSuccessTitle>
        <ProfileImage
          isImageSelected={isImageSelected}
          imagePayload={selectedImageData}
          sideMenuItems={sideMenuItems}
          image={image}
          selectProfileImage={this.selectProfileImage}
          userName={displayName}
        />
        <View style={Style.displayNameContainer}>
          <Text style={Style.profileName}>{`${displayName}`}</Text>
        </View>
        <View style={{marginBottom: 15}}>
          <Text style={Style.sectionTitle}>CONTACT DETAILS</Text>
        </View>
        <ProfileForm
          handleTextChange={(field) => this.handleTextChange(field)}
          dob={dob}
          state={this.state}
          initialDate={initialDate}
          datePickerVisible={datePickerVisible}
          getDate={(date) => this.getDate(date)}
        />
        {isProjectArchived === false && (
          <View>
            <View style={{marginBottom: 15, marginTop: 25}}>
              <Text style={Style.sectionTitle}>NOTIFICATIONS</Text>
            </View>
            <View style={Style.checkBoxContainer}>
              <CheckBox
                accessibilityLabel={`${checkBoxText} checkbox ${
                  isCheckBoxSelected ? 'checked' : 'unchecked'
                }`}
                text={checkBoxText}
                labelTextStyle={Style.checkboxText}
                onSelect={this.onCheckBoxSelect}
                isChecked={isCheckBoxSelected}
              />
            </View>
          </View>
        )}
        {((projectSessionPayload &&
          projectSessionPayload.data[0].attributes.typeform_enabled) ||
          (selectedProjectPayload &&
            selectedProjectPayload.data.attributes.typeform_enabled)) &&
          userDetailPayload.included[1].attributes.name === 'mentor' && (
            <View style={Style.buttonComponent}>
              <TouchableOpacity
                style={Style.buttonView}
                accessible
                accessibilityLabel="Click here to edit your mentor profile"
                accessibilityRole="link"
                onPress={() => this.navigateToMentorDetails()}>
                <Text style={Style.buttonText}>
                  Click here to edit your mentor profile
                </Text>
              </TouchableOpacity>
            </View>
          )}
        <ProfilePictureCheckModal
          modalVisible={modalVisible}
          showModal={this.showModal}
        />
      </Form>
    );
  }
}

ProfileScreen.defaultProps = {
  fetching: false,
  imagePayload: null,
  sideMenuItems: null,
  projectUserPayload: null,
  uploadedAttachmentsData: null,
  showActionSheet: () => {},
};

ProfileScreen.propTypes = {
  fetching: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  imagePayload: PropTypes.object,
  navigation: PropTypes.object.isRequired,
  sideMenuItems: PropTypes.object,
  projectUserPayload: PropTypes.object,
  showActionSheet: PropTypes.func,
  screenProps: PropTypes.object.isRequired,
  uploadedAttachmentsData: PropTypes.object,
};

const mapStateToProps = (state) => ({
  fetching:
    state.profile.fetching ||
    state.uploadAttachments.fetching ||
    state.getProjects.fetching ||
    state.getSelectedProjectReducer.fetching,
  sideMenuItems: setSideMenuItems(state),
  projectUserPayload: state.profile.projectUserPayload,
  includedProjectUserPayload: state.profile.includedProjectUserPayload,
  uploadedAttachmentsData: state.uploadAttachments.uploadAttachmentsData,
  projectSessionPayload: state.getProjects.projectSessionPayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
  userDetailPayload: state.getUserDetail.userDetailPayload,
  userDetail: state.getUserDetail.userDetailPayload,
});

export default connect(mapStateToProps)(
  withImageUploader(
    ProfileScreen,
    navigationOption,
    actionSheetOptions,
    cancelIndex,
  ),
);
