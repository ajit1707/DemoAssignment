import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  Platform,
  Dimensions,
  RefreshControl,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import Style from './style';
import {connect} from 'react-redux';
import {PaginationSpinner, Spinner} from '../../components';
import Container from '../../components/Container';
import MenteeAssignment from '../assignmentScreen/menteeAssignment';
import {
  getAssignmentData,
  resetAssignmentStateData,
} from '../../modules/assignmentReducer';
import {uploadAssignmentFile} from '../../modules/uploadAssignmentFile';
import {assignmentNavigationOptions} from '../../navigators/Root';
import {withImageUploader} from '../../components/withImageUploader';
import {uploadAttachments} from '../../modules/uploadAttachments';
import {bytesConverter, getRandomNumber} from '../../utility/helper';
import Dialog, {
  DialogButton,
  DialogContent,
  DialogFooter,
  DialogTitle,
  ScaleAnimation,
} from 'react-native-popup-dialog';
import PropTypes from 'prop-types';
import Constant from '../../utility/constant';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob';
import Config from '../../utility/config';
import {setSideMenuItems} from '../../modules/getProjects';

const deviceWidth = Dimensions.get('window').width;
const actionSheetOptions = {
  ...Platform.select({
    ios: {
      options: ['Take Photo', 'Photo Library', 'Browse', 'Cancel'],
      fileType: ['camera', 'gallery', 'file', 'cancel'],
    },
    android: {
      options: ['Take Photo', 'Files', 'Cancel'],
      fileType: ['camera', 'file', 'cancel'],
    },
  }),
};
const cancelIndex = {
  ...Platform.select({
    ios: {
      buttonIndex: 3,
    },
    android: {
      buttonIndex: 2,
    },
  }),
};
export const navigationOption = ({navigation, screenProps}) => ({
  ...assignmentNavigationOptions(
    {navigation, screenProps},
    navigation.state.params && navigation.state.params.handleFile,
    navigation.state.params && navigation.state.params.IconFlag,
  ),
});
class AssignmentScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    ...navigationOption({navigation, screenProps}),
  });
  constructor(props) {
    super(props);
    this.state = {
      filename: '',
      format: '',
      size: '',
      url: '',
      visible: false,
      updateState: false,
      paginationSpinner: false,
      enableLazyLoading: false,
      refreshing: false,
      displaySpinner: false,
    };
  }
  static getDerivedStateFromProps(props, state) {
    const {dispatch} = props;
    if (
      props.imagePayload &&
      props.imagePayload.eventType === 'imageSelected' &&
      state.updateState
    ) {
      const {
        fileData: {filename, format, size, url},
      } = props.imagePayload;
      if (size > 10000000) {
        Toast.showWithGravityWithGravity(
          'Please attach file size upto 10 MB',
          Toast.LONG,
          Toast.BOTTOM,
        );
      } else {
        dispatch(resetAssignmentStateData(true));
        return {
          filename,
          format,
          size,
          url,
          visible: true,
          updateState: false,
        };
      }
    }
    return null;
  }
  componentDidMount() {
    const {dispatch, userDetailPayload} = this.props;
    dispatch(getAssignmentData(1));
    if (userDetailPayload.included[1].attributes.name === 'mentee') {
      this.props.navigation.setParams({
        handleFile: this.handleFileUpload,
        IconFlag: true,
      });
    }
  }
  backPress = (route) => {
    const {dispatch} = this.props;
    if (route === 'cancel') {
      this.resetState();
      dispatch(resetAssignmentStateData(false));
    }
  };

  handleFileUpload = () => {
    const {showActionSheet, userDetailPayload} = this.props;
    const isArchived = userDetailPayload?.data[0]?.attributes.is_archived;
    if (isArchived === true) {
      Toast.showWithGravity(
        'You have been archived',
        Toast.SHORT,
        Toast.BOTTOM,
      );
    } else {
      this.setState(
        {
          updateState: true,
        },
        () => {
          showActionSheet();
        },
      );
    }
  };

  resetState = () => {
    this.setState({
      filename: '',
      format: '',
      size: '',
      url: '',
      visible: false,
      updateState: false,
    });
  };
  onRefresh = () => {
    const {dispatch} = this.props;
    this.setState({refreshing: true});
    dispatch(getAssignmentData(1)).then(() => {
      this.setState({refreshing: false});
    });
  };
  downloadForAndroid = async (item) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: Constant.EXTERNAL_STORAGE_TITLE,
          message: Constant.EXTERNAL_STORAGE_PERMISSION,
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const directory = RNFetchBlob.fs.dirs.DownloadDir;
        this.setState({
          displaySpinner: true,
        });
        RNFetchBlob.fetch(
          'GET',
          `${Config.IMAGE_SERVER_CDN}${item.attributes.attachment_id}`,
        )
          .then((res) => {
            const base64data = res.data;
            const fileName = item.attributes.attachment_filename.split('.');
            const randomNumber = getRandomNumber(0, 999);
            const attachmentFilename = `${fileName[0]}_${randomNumber}.${fileName[1]}`;
            const filePath = `${directory}/${attachmentFilename}`;
            RNFetchBlob.fs.writeFile(filePath, base64data, 'base64');
            RNFetchBlob.fs
              .scanFile([{path: filePath}])
              .then(() => {
                this.setState({
                  displaySpinner: false,
                });
                Toast.showWithGravity(
                  'File Downloaded Successfully!',
                  Toast.SHORT,
                  Toast.BOTTOM,
                );
              })
              .catch(() => {
                this.setState({
                  displaySpinner: false,
                });
              });
          })
          // Something went wrong:
          .catch((error) => {
            console.log('catch error', error);
            // error handling
          });
      } else {
        Toast.showWithGravity(
          'Permission Required to store data.',
          Toast.LONG,
          Toast.BOTTOM,
        );
      }
    } catch (err) {
      Toast.showWithGravity(
        'Permission Required to store data.',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };
  downloadForIOS = async (item) => {
    const directory = RNFetchBlob.fs.dirs.DocumentDir;
    this.setState({
      displaySpinner: true,
    });
    RNFetchBlob.fetch(
      'GET',
      `${Config.IMAGE_SERVER_CDN}${item.attributes.attachment_id}`,
    )
      .then((res) => {
        const base64data = res.data;
        const fileName = item.attributes.attachment_filename;
        const filePath = `${directory}/${fileName}`;
        RNFetchBlob.fs
          .writeFile(filePath, base64data, 'base64')
          .then(() => {
            RNFetchBlob.ios.previewDocument(filePath);
            this.setState({
              displaySpinner: false,
            });
          })
          .catch(() => {
            Toast.showWithGravity(
              'Error in Downloading file',
              Toast.SHORT,
              Toast.BOTTOM,
            );
            this.setState({
              displaySpinner: false,
            });
          });
      })
      // Something went wrong:
      .catch(() => {
        this.setState({
          displaySpinner: false,
        });
        // error handling
      });
  };
  onMomentumScrollBegin = () => {
    this.setState({enableLazyLoading: true});
  };
  onEndReached = () => {
    const {paginationSpinner, enableLazyLoading} = this.state;
    const {dispatch, pageNumber, getAssignmentPayload} = this.props;
    if (enableLazyLoading && !paginationSpinner) {
      if ((pageNumber - 1) * 10 <= getAssignmentPayload.meta.record_count) {
        this.setState(
          {
            paginationSpinner: true,
          },
          () =>
            dispatch(getAssignmentData(pageNumber)).then(() => {
              this.setState({
                paginationSpinner: false,
                enableLazyLoading: false,
              });
            }),
        );
      }
    }
  };
  uploadDocument = () => {
    const {dispatch, imagePayload} = this.props;
    if (imagePayload && imagePayload.fileType !== '') {
      dispatch(resetAssignmentStateData(false));
      this.setState(
        {
          visible: false,
          updateState: false,
          upload: false,
          Back: true,
        },
        () => {
          const fileData = new FormData();
          fileData.append('file', {
            type: imagePayload.fileData.format,
            name: imagePayload.fileData.filename,
            uri: imagePayload.fileData.url,
            size: imagePayload.fileData.size,
          });
          dispatch(uploadAttachments(fileData, null)).then((res) => {
            const payload = {
              data: {
                attributes: {
                  attachment_content_type: res.data.format,
                  attachment_filename: res.data.filename,
                  attachment_id: res.data.id,
                  attachment_size: res.data.size,
                },
                type: 'assignments',
              },
            };
            dispatch(uploadAssignmentFile(payload)).then(() => {
              Toast.showWithGravity(
                'Assignment uploaded successfully',
                Toast.LONG,
                Toast.BOTTOM,
              );
              dispatch(getAssignmentData(1));
            });
          });
        },
      );
    }
  };
  renderTitle = () => (
    <DialogTitle
      title="Do you want upload the assignment?"
      textStyle={[Style.buttonText, Style.titleText]}
      hasTitleBar={false}
    />
  );
  renderFooter = () => (
    <DialogFooter>
      <TouchableOpacity
        accessible
        accessibilityLabel="Cancel assignment uploading"
        accessibilityRole="button"
        style={Style.leftButton}
        onPress={() => this.backPress('cancel')}>
        <Text style={Style.leftButtonStyle}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessible
        accessibilityLabel="Upload assignment"
        accessibilityRole="button"
        style={Style.rightButton}
        onPress={() => this.uploadDocument()}>
        <Text style={Style.rightButtonStyle}>Upload</Text>
      </TouchableOpacity>
    </DialogFooter>
  );
  render() {
    const {userDetailPayload, getAssignmentPayload, fetching} = this.props;
    const {paginationSpinner, refreshing, displaySpinner, upload} = this.state;
    return (
      <Container
        style={{backgroundColor: '#E5E5E5', flex: 1}}
        fetching={
          !paginationSpinner &&
          fetching &&
          !refreshing &&
          !displaySpinner &&
          !upload
        }>
        {getAssignmentPayload.data && getAssignmentPayload.data.length > 0 ? (
          <View style={{flex: 1}}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              data={getAssignmentPayload.data}
              extraData={this.props}
              renderItem={({item, index}) => (
                <MenteeAssignment
                  item={item}
                  index={index}
                  downloadForAndroid={this.downloadForAndroid}
                  downloadForIOS={this.downloadForIOS}
                  {...this.props}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={
                <PaginationSpinner animating={this.state.paginationSpinner} />
              }
              onMomentumScrollBegin={this.onMomentumScrollBegin}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={0.2}
            />
          </View>
        ) : !fetching &&
          (userDetailPayload.included[1].attributes.name === 'mentor' ||
            userDetailPayload.included[1].attributes.name === 'coordinator' ||
            userDetailPayload.included[0].attributes.super_admin) ? (
          <View style={Style.noAssignment}>
            <Text style={Style.mentor}>No mentee assignments yet</Text>
            <Text style={Style.message}>
              Assignments from your mentees will be displayed here
            </Text>
          </View>
        ) : !fetching &&
          userDetailPayload.included[1].attributes.name === 'mentee' ? (
          <View style={Style.noAssignment}>
            <View style={Style.noAssignment}>
              <Text style={Style.mentor}>No assignments uploaded yet</Text>
              <Text style={Style.message}>
                Your assignments will be displayed here
              </Text>
            </View>
          </View>
        ) : null}
        <Dialog
          accessible
          visible={this.state.visible}
          useNativeDriver
          hasOverlay
          overlayOpacity={0.6}
          overlayBackgroundColor="rgba(0, 0, 0, 0.4)"
          width={deviceWidth * 0.85}
          dialogTitle={this.renderTitle()}
          dialogAnimation={
            new ScaleAnimation({
              initialValue: 0,
              useNativeDriver: true,
            })
          }
          footer={this.renderFooter()}>
          <View
            style={Style.dialogContainer}
            accessible
            accessibilityLabel={`${this.state.filename} ${bytesConverter(
              this.state.size,
            )}`}
            accessibilityRole="text">
            <Text style={Style.messageStyle} numberOfLines={2}>
              {`${this.state.filename} ${bytesConverter(this.state.size)}`}
            </Text>
          </View>
        </Dialog>
        <Spinner animating={displaySpinner} />
      </Container>
    );
  }
}
AssignmentScreen.defaultProps = {
  imagePayload: null,
  error: null,
  isVisible: false,
  resetStateData: false,
  close: () => {},
  pageNumber: 1,
  screenProps: null,
};
AssignmentScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  showActionSheet: PropTypes.func.isRequired,
  imagePayload: PropTypes.object,
  error: PropTypes.string,
  isVisible: PropTypes.bool,
  resetStateData: PropTypes.bool,
  close: PropTypes.func,
  pageNumber: PropTypes.number,
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object,
};
const mapStateToProps = (state) => ({
  userDetailPayload: state.getUserDetail.userDetailPayload,
  getAssignmentPayload: state.getAssignmentDataReducer.getAssignmentPayload,
  fetching:
    state.getAssignmentDataReducer.fetching ||
    state.uploadAssignmentFileReducer.fetching ||
    state.uploadAttachments.fetching,
  pageNumber: state.getAssignmentDataReducer.pageNumber,
  sideMenuItems: setSideMenuItems(state),
  resetStateData: state.getAssignmentDataReducer.resetStateData,
});

export default connect(mapStateToProps)(
  withImageUploader(
    AssignmentScreen,
    navigationOption,
    actionSheetOptions,
    cancelIndex,
  ),
);
