import React, {Component} from 'react';
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {Button, Form} from '../../components';
import {setSideMenuItems} from '../../modules/getProjects';
import {withImageUploader} from '../../components/withImageUploader';
import {uploadAttachments} from '../../modules/uploadAttachments';
import {
  submitPost,
  updatedPost,
  getThreadsData,
  getSearchedThreadsPostData,
  getThreads,
} from '../../modules/communityScreen';
import {bytesConverter, fontMaker} from '../../utility/helper';
import {quickPostNavigationOptions} from '../../navigators/Root';
import Icon from '../../utility/icons';
import Style from '../messageScreen/style';
import {errorHandler} from '../../modules/errorHandler';
import IconButton from '../../components/IconButton';
import Toast from 'react-native-simple-toast';
import Constant from '../../utility/constant';

const actionSheetOptions = {
  options: ['Take Photo', 'Photo Library', 'Cancel'],
  fileType: ['camera', 'gallery', 'cancel'],
};
const cancelIndex = {buttonIndex: 2};

export const navigationOption = ({navigation}) => ({
  ...quickPostNavigationOptions({navigation}),
});

class QuickPost extends Component {
  static navigationOptions = ({navigation}) => ({
    ...navigationOption({navigation}),
  });

  constructor(props) {
    super(props);
    this.state = {
      inputText: null,
      is_anonymous: false,
      attachment: [],
      imageData: {},
      shouldImageUpload: false,
      disabled: false,
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (
      props.imagePayload.eventType === 'imageSelected' &&
      state.shouldImageUpload &&
      props.imagePayload.fileData
    ) {
      const {
        imagePayload: {
          fileData: {filename, format, size},
        },
      } = props;
      return {
        imageData: {
          attachment_content_type: format,
          attachment_filename: filename,
          attachment_size: String(size),
        },
      };
    }
    return null;
  }

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
      threadsPost,
    } = this.props;
    if (params.postId) {
      const filterData = threadsPost.included.find(
        (item) => item.id === params.postId,
      );
      const {
        attributes: {content, is_anonymous, attachments},
      } = filterData;
      this.setEditData(content, is_anonymous, attachments);
    }
  }
  onChangeText = (changedText) => {
    this.setState({inputText: changedText});
  };
  onUploadImage = () => {
    const {
      showActionSheet,
      userDetail,
      projectSessionPayload,
      selectedProjectPayload,
    } = this.props;
    let isProjectArchived = false;
    let archivedMessage = Constant.ARCHIVED_PROJECT;
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
      archivedMessage = Constant.USER_ARCHIVED;
    }
    if (
      (userDetail &&
        userDetail.data &&
        userDetail.data.length &&
        userDetail.data[0].attributes &&
        userDetail.data[0].attributes.is_archived === true &&
        selectedProjectPayload &&
        selectedProjectPayload.data &&
        selectedProjectPayload.data.attributes &&
        selectedProjectPayload.data.attributes.is_archived === true) ||
      (projectSessionPayload &&
        projectSessionPayload.data &&
        projectSessionPayload.data.length &&
        projectSessionPayload.data[0].attributes &&
        projectSessionPayload.data[0].attributes.is_archived === true)
    ) {
      archivedMessage = Constant.ARCHIVED_PROJECT;
    }
    if (isProjectArchived === false) {
      this.setState({shouldImageUpload: true});
      showActionSheet();
    } else {
      Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
    }
  };
  onSubmitPost = () => {
    const {
      imagePayload,
      dispatch,
      userDetail,
      projectSessionPayload,
      selectedProjectPayload,
    } = this.props;
    const {inputText} = this.state;
    let isProjectArchived = false;
    let archivedMessage = Constant.ARCHIVED_PROJECT;
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
      archivedMessage = Constant.USER_ARCHIVED;
    }
    if (
      (userDetail &&
        userDetail.data &&
        userDetail.data.length &&
        userDetail.data[0].attributes &&
        userDetail.data[0].attributes.is_archived === true &&
        selectedProjectPayload &&
        selectedProjectPayload.data &&
        selectedProjectPayload.data.attributes &&
        selectedProjectPayload.data.attributes.is_archived === true) ||
      (projectSessionPayload &&
        projectSessionPayload.data &&
        projectSessionPayload.data.length &&
        projectSessionPayload.data[0].attributes &&
        projectSessionPayload.data[0].attributes.is_archived === true)
    ) {
      archivedMessage = Constant.ARCHIVED_PROJECT;
    }
    if (isProjectArchived === false) {
      this.setState({disabled: true});
      if (inputText && inputText.trim().length > 0) {
        const payload = {
          data: {
            attributes: {
              attachments: this.state.attachment,
              content: this.state.inputText.trim(),
            },
            type: 'posts',
          },
        };
        if (
          imagePayload &&
          imagePayload.fileData &&
          imagePayload.fileData !== ''
        ) {
          const {
            fileData: {filename, format, url},
          } = imagePayload;
          const fileData = new FormData();
          fileData.append('file', {
            uri: url,
            type: format,
            name: filename,
          });
          dispatch(uploadAttachments(fileData)).then((res) => {
            const {
              data: {id},
            } = res;
            const {attachment, imageData} = this.state;
            imageData.attachment_id = id;
            attachment.push(this.state.imageData);
            this.submitOrUpdatePost(payload);
          });
        } else {
          this.submitOrUpdatePost(payload);
        }
      } else {
        dispatch(errorHandler('Enter some post content'));
        this.setState({disabled: false});
      }
    } else {
      Toast.showWithGravity(archivedMessage, Toast.LONG, Toast.BOTTOM);
    }
  };
  setEditData = (content, is_anonymous, attachments) => {
    this.setState({inputText: content, is_anonymous, attachment: attachments});
  };
  closeUploadView = () => {
    this.setState({
      attachment: [],
      imageData: {},
      shouldImageUpload: false,
    });
  };
  submitOrUpdatePost = (payload) => {
    const {
      navigation: {
        goBack,
        replace,
        state: {
          params: {id, postId, slug, route, searchEnabled},
        },
      },
      dispatch,
      threadPostSearchId,
      threadPostSearchString,
    } = this.props;
    if (postId) {
      const {data} = payload;
      data.id = postId;
      dispatch(updatedPost(postId, payload)).then((response) => {
        const status = response?.data.attributes.state;
        dispatch(getThreadsData(slug)).then(() => {
          if (searchEnabled) {
            dispatch(
              getSearchedThreadsPostData(
                threadPostSearchId,
                threadPostSearchString,
              ),
            ).then(() => {
              this.setState({disabled: false});
              goBack();
            });
          } else {
            this.setState({disabled: false});
            goBack();
          }
          if (status === 'pending') {
            Toast.showWithGravity(
              'Your post has been sent into the moderation queue. Once it is approved, it will be seen by the recipient.',
              Toast.LONG,
              Toast.BOTTOM,
            );
          } else {
            Toast.showWithGravity(
              'Post updated successfully',
              Toast.LONG,
              Toast.BOTTOM,
            );
          }
        });
      });
    } else {
      const {
        data: {attributes},
      } = payload;
      attributes.community_thread_id = id;
      attributes.is_anonymous = this.state.is_anonymous;
      dispatch(submitPost(payload))
        .then((response) => {
          const status = response?.data.attributes.state;
          if (route === 'threadPost') {
            dispatch(getThreadsData(slug)).then(() => {
              this.setState({disabled: false});
              goBack();
            });
          } else {
            replace('ThreadPost', {slug});
          }
          if (status === 'pending') {
            Toast.showWithGravity(
              'Your post has been sent into the moderation queue. Once it is approved, it will be seen by the recipient.',
              Toast.LONG,
              Toast.BOTTOM,
            );
          } else {
            Toast.showWithGravity(
              'Post added successfully',
              Toast.LONG,
              Toast.BOTTOM,
            );
          }
        })
        .catch(() => {
          dispatch(errorHandler('Forbidden'));
          this.setState({disabled: false});
        });
    }
  };
  postAnonymously = () => {
    this.setState({is_anonymous: !this.state.is_anonymous});
  };
  goBackOnForbidden = () => {
    const {
      navigation: {
        state: {
          params: {route},
        },
        navigate,
        goBack,
      },
      dispatch,
    } = this.props;
    dispatch(getThreads(1)).then(() => {
      if (route === 'threadPost') {
        navigate('CommunitiesScreen');
      } else {
        goBack();
      }
    });
  };

  render() {
    const {
      sideMenuItems: {sideMenuColor},
      navigation: {
        state: {params},
      },
      fetching,
    } = this.props;
    const {is_anonymous, imageData} = this.state;
    return (
      <Form
        style={Style.formStyle}
        fetching={fetching}
        barStyle="light-content"
        goBack
        goBackAction={
          this.state.disabled ? () => this.goBackOnForbidden() : null
        }>
        <ScrollView keyboardShouldPersistTaps="never">
          <TextInput
            style={styles.textInput}
            textAlignVertical="top"
            multiline
            value={this.state.inputText}
            placeholder="Enter Post"
            maxLength={10000}
            onChangeText={(changedText) => this.onChangeText(changedText)}
            autoCorrect
            spellCheck
          />
          {Object.hasOwnProperty.call(
            this.state.imageData,
            'attachment_filename',
          ) ? (
            <View
              style={[
                Style.uploadViewContainer,
                Style.uploadViewContainerExtraStyle,
              ]}>
              <View
                style={Style.iconWidth}
                accessible
                accessibilityLabel="Attachment file icon">
                <Image source={Icon.UPLOAD_ICON} style={Style.uploadIcon} />
              </View>
              <View style={Style.fileNameContainer}>
                <Text style={Style.fileNameText}>{`${
                  imageData.attachment_filename
                } ${bytesConverter(imageData.attachment_size)}`}</Text>
              </View>
              <View
                style={Style.iconWidth}
                accessible
                accessibilityLabel="Remove file icon">
                <TouchableOpacity
                  onPress={this.closeUploadView}
                  style={Style.crossButtonContainer}
                  accessible
                  accessibilityLabel="Remove file icon">
                  <Image
                    accessible
                    accessibilityLabel="Remove file icon"
                    source={Icon.CROSS_ICON}
                    style={Style.crossIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          {!params.postId ? (
            <View
              style={Style.checkBoxView}
              accessibilityLabel={`Post Anonymously checkbox ${
                is_anonymous ? 'checked' : 'unchecked'
              }`}>
              <TouchableOpacity
                accessible={false}
                activeOpacity={0.6}
                style={styles.itemContainer}
                onPress={this.postAnonymously}>
                {!is_anonymous ? (
                  <MaterialCommunityIcons
                    name="checkbox-blank-outline"
                    size={24}
                    color="#000"
                    style={styles.vectorIcons}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="checkbox-marked"
                    size={24}
                    color="#00f"
                    style={styles.vectorIcons}
                  />
                )}
                <View style={styles.checkBoxPost}>
                  <Text style={styles.nameText}>Post Anonymously</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          <Button
            accessible
            accessibilityRole="button"
            opacity={0.7}
            style={[styles.buttonStyle, {borderColor: sideMenuColor}]}
            onPress={this.onUploadImage}>
            <Text>Upload Image</Text>
          </Button>
          <Button
            accessible
            accessibilityRole="button"
            disabled={this.state.disabled}
            opacity={0.7}
            style={[styles.buttonStyle, {borderColor: sideMenuColor}]}
            onPress={() => this.onSubmitPost()}>
            <Text>{params.postId ? 'Update' : 'Submit'}</Text>
          </Button>
        </ScrollView>
      </Form>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: 17,
  },
  nameText: {
    color: '#000',
    ...fontMaker('regular'),
    fontSize: 17,
  },
  searchBoxTextInput: {
    fontSize: 16,
    color: '#000',
    transform: [{scaleX: 1.0086}],
    ...fontMaker('regular'),
    width: '95%',
    textAlignVertical: 'top',
  },
  searchBoxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    borderRadius: 0.5,
    borderTopWidth: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 5,
  },
  buttonStyle: {
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 2,
    marginVertical: 10,
    backgroundColor: '#fff',
    marginTop: 15,
  },
  textInput: {
    alignSelf: 'center',
    height: 150,
    width: '95%',
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 18,
  },
  vectorIcons: {
    marginTop: 2,
  },
  formStyle: {
    backgroundColor: '#E5E5E5',
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  uploadViewContainerExtraStyle: {
    width: '95%',
    marginTop: 15,
    alignSelf: 'center',
  },
  checkBoxView: {
    flexDirection: 'row',
    marginTop: 15,
    alignSelf: 'center',
  },
  checkBoxPost: {
    paddingHorizontal: 15,
    paddingBottom: 3,
  },
});
QuickPost.defaultProps = {
  dispatch: () => {},
  showActionSheet: () => {},
  navigation: null,
  threadsPost: null,
  imagePayload: null,
  sideMenuItems: null,
  threadPostSearchId: '',
  threadPostSearchString: '',
  fetching: false,
};

QuickPost.propTypes = {
  dispatch: PropTypes.func,
  showActionSheet: PropTypes.func,
  navigation: PropTypes.object,
  threadsPost: PropTypes.object,
  imagePayload: PropTypes.object,
  sideMenuItems: PropTypes.object,
  threadPostSearchId: PropTypes.string,
  threadPostSearchString: PropTypes.string,
  fetching: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  sideMenuItems: setSideMenuItems(state),
  threadsPost: state.getCommunityScreenReducer.threadsPost,
  threadPostSearchString:
    state.getCommunityScreenReducer.threadPostSearchString,
  threadPostSearchId: state.getCommunityScreenReducer.threadPostSearchId,
  fetching: state.getCommunityScreenReducer.fetching,
  userDetail: state.getUserDetail.userDetailPayload,
  projectSessionPayload: state.getProjects.projectSessionPayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
});
export default connect(mapStateToProps)(
  withImageUploader(
    QuickPost,
    navigationOption,
    actionSheetOptions,
    cancelIndex,
  ),
);
