import React, {Component} from 'react';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {PermissionsAndroid, Platform} from 'react-native';
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import Permissions from 'react-native-permissions';
import {androidRequestAlert, openSettings} from '../utility/helper';
import Constant from '../utility/constant';
import {errorHandler} from '../modules/errorHandler';

export const withImageUploader = (
  WrappedComponent,
  navigationOption,
  actionSheetOptions,
  cancelIndex,
) =>
  class ImageUpload extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
      ...navigationOption({navigation, screenProps}),
    });

    constructor() {
      super();
      this.state = {
        imagePath: '',
        eventType: '',
        fileData: '',
      };
    }

    getEventType = (eventType) => {
      this.setState(
        {
          eventType,
        },
        () => {
          setTimeout(() => {
            this.setState({
              eventType: '',
            });
          }, 10);
        },
      );
    };

    getImageData = (image, eventType, filePayload) => {
      let fileData;
      const {dispatch} = this.props;
      if (eventType !== 'cancel' || eventType !== 'openPicker') {
        if (eventType === 'browse') {
          fileData = filePayload;
        } else if (image.size > 10000000) {
          setTimeout(
            () => dispatch(errorHandler(Constant.FILE_SIZE_VALIDATION)),
            150,
          );
          this.getEventType('invalidImage');
        } else if (
          image.mime !== 'image/jpeg' &&
          image.mime !== 'image/jpg' &&
          image.mime !== 'image/png' &&
          image.mime !== 'image/gif'
        ) {
          setTimeout(
            () => dispatch(errorHandler(Constant.FILE_FORMAT_VALIDATION)),
            150,
          );
          this.getEventType('invalidImage');
        } else {
          const fileName = image.path.split('/');
          fileData = {
            filename: fileName[fileName.length - 1],
            format: image.mime,
            size: image.size,
            url: image.path,
          };
        }
      }
      this.setState({imagePath: image, eventType, fileData}, () => {
        this.getEventType('imageSelected');
        setTimeout(() => {
          this.getEventType('closed');
        }, 10);
      });
    };

    openDocumentPicker = () => {
      DocumentPicker.show(
        {
          filetype: [DocumentPickerUtil.allFiles()],
        },
        (error, res) => {
          if (res) {
            const fileData = {
              filename: res.fileName,
              format: res.type,
              size: res.fileSize,
              url: res.uri,
            };
            this.getImageData(res, 'browse', fileData);
          } else {
            this.getEventType('cancel');
          }
        },
      );
    };

    imagePicker = (eventType) => {
      if (eventType === 'camera') {
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: false,
        })
          .then((image) => {
            this.getImageData(image, eventType);
          })
          .catch(() => {
            this.getEventType('cancel');
          });
      } else {
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: false,
          mediaType: 'photo',
        })
          .then((image) => {
            this.getImageData(image, eventType);
          })
          .catch(() => {
            this.getEventType('cancel');
          });
      }
    };

    openUploader = async (index) => {
      const fileType = actionSheetOptions.fileType[index];
      if (fileType === 'cancel') {
        this.getEventType(fileType);
      } else {
        this.getEventType('openPicker');
      }

      if (fileType === 'camera') {
        if (Platform.OS === 'ios') {
          Permissions.check('camera').then((response) => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            if (response === 'denied') {
              openSettings('camera');
            } else {
              this.imagePicker('camera');
            }
          });
        } else {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: Constant.CAMERA_PERMISSION_TITLE,
                message: Constant.CAMERA_PERMISSION,
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              this.imagePicker('camera');
            } else {
              androidRequestAlert('camera');
            }
          } catch (err) {
            androidRequestAlert('camera');
          }
        }
      } else if (fileType === 'gallery') {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: Constant.PHOTO_PERMISSION_TITLE,
                message: Constant.GALLERY_PERMISSION,
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              this.imagePicker('gallery');
            } else {
              androidRequestAlert('gallery');
            }
          } catch (err) {
            androidRequestAlert('gallery');
          }
        } else if (Platform.OS === 'ios') {
          Permissions.check('photo').then((response) => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            if (response === 'denied') {
              openSettings('gallery');
            } else {
              this.imagePicker('gallery');
            }
          });
        }
      } else if (fileType === 'file') {
        this.openDocumentPicker();
      }
    };

    showActionSheet = () => {
      this.ActionSheet.show();
    };

    render() {
      return (
        <React.Fragment>
          <WrappedComponent
            compressVideoPreset="low"
            imagePayload={this.state}
            showActionSheet={this.showActionSheet}
            {...this.props}
          />
          <ActionSheet
            ref={(o) => {
              this.ActionSheet = o;
            }}
            title="Please select an option"
            options={actionSheetOptions.options}
            cancelButtonIndex={cancelIndex.buttonIndex}
            textStyle={{color: '###'}}
            // destructiveButtonIndex={1}
            onPress={(index) => {
              this.openUploader(index, actionSheetOptions);
            }}
          />
        </React.Fragment>
      );
    }
  };
