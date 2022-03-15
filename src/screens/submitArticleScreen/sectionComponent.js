import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import {fontMaker} from '../../utility/helper';
import {AuthTextInput} from '../../components';
import Style from './styles';
import {setSideMenuItems} from '../../modules/getProjects';
import {withImageUploader} from '../../components/withImageUploader';
import Config from '../../utility/config';

const deviceWidth = Dimensions.get('window').width;

const actionSheetOptions = {
  options: ['Take Photo', 'Photo Library', 'Cancel'],
  fileType: ['camera', 'gallery', 'cancel'],
};
const cancelIndex = {buttonIndex: 2};

class SectionComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidUpdate(prevProps) {
    const {imagePayload, onSectionChange, index} = this.props;
    if (imagePayload !== prevProps.imagePayload) {
      onSectionChange('imageUrl', imagePayload.fileData, index);
    }
  }

  itemSeparator = () => <View style={styles.separatorView} />;
  render() {
    const {
      onSectionChange,
      item,
      index,
      sideMenuItems: {sideMenuColor},
      removeSection,
      addNewSection,
    } = this.props;
    return (
      <View
        style={[
          styles.modalViewContainer,
          styles.viewContainer,
          {borderColor: sideMenuColor},
        ]}>
        <View style={styles.sectionView}>
          <Text
            style={[
              Style.textStyle,
              {alignSelf: 'flex-start', paddingLeft: 2},
            ]}>
            Section
          </Text>
        </View>
        <AuthTextInput
          placeholder="Enter the section title"
          value={item.title}
          onChangeText={(text) => onSectionChange('title', text, index)}
          multiline
          textStyle={{width: '90%'}}
        />
        {Object.keys(item.imageUrl).length > 0 && (
          <ImageBackground
            source={{
              url:
                item.imageUrl.url ||
                `${Config.IMAGE_SERVER_CDN}${item.imageUrl.image_id}`,
            }}
            resizeMode="contain"
            style={styles.imageStyle}>
            <TouchableOpacity
              style={styles.crossIconStyle}
              onPress={() => console.log('onSecImagePress', item, index)}>
              <Text>X</Text>
            </TouchableOpacity>
          </ImageBackground>
        )}
        <TouchableOpacity
          style={[Style.uploadImageButton, {borderColor: sideMenuColor}]}
          onPress={this.props.showActionSheet}>
          <View style={{alignSelf: 'center'}}>
            <Entypo name="camera" size={18} color="#000" />
          </View>
          <Text style={[Style.addSectionButtonText, {paddingLeft: 10}]}>
            Click here to upload image
          </Text>
        </TouchableOpacity>
        <AuthTextInput
          placeholder="Enter the section body"
          multiline
          textStyle={styles.sectionBody}
        />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-evenly',
            width: '90%',
          }}>
          <TouchableOpacity onPress={() => removeSection(index)}>
            <Entypo name="minus" size={30} color="#f00" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addNewSection()}>
            <Entypo name="plus" size={30} color="#0f0" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalViewContainer: {
    flex: 1,
    justifyContent: 'space-between',
    elevation: 1,
    borderWidth: 1,
    borderRadius: 2,
    width: deviceWidth * 0.9,
    alignItems: 'center',
  },
  sectionBody: {
    height: 100,
    width: '90%',
    marginTop: 15,
    textAlignVertical: 'top',
  },
  crossIconStyle: {
    justifyContent: 'flex-end',
  },
  imageStyle: {
    height: 250,
    width: '90%',
    marginBottom: 15,
    alignSelf: 'center',
  },
  sectionView: {
    width: '90%',
    marginBottom: 15,
  },
  viewContainer: {
    backgroundColor: '#e2e7ed',
    paddingVertical: 15,
    marginBottom: 15,
    justifyContent: 'space-evenly',
  },
  separatorView: {
    borderWidth: 0.5,
    borderColor: '#ccc',
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
  },
  searchBoxContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50,
    borderRadius: 0.5,
    borderTopWidth: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    width: '100%',
    paddingLeft: 17,
    flexDirection: 'row',
  },
  searchBoxTextInput: {
    fontSize: 16,
    color: '#000',
    paddingLeft: 17,
    transform: [{scaleX: 1.0086}],
    ...fontMaker('regular'),
    width: '95%',
  },
});

SectionComponent.defaultProps = {
  modalVisible: false,
  showModal: () => {},
  data: null,
};

SectionComponent.propTypes = {};

const mapStateToProps = (state) => ({
  sideMenuItems: setSideMenuItems(state),
});

export default connect(mapStateToProps)(
  withImageUploader(
    SectionComponent,
    () => {},
    actionSheetOptions,
    cancelIndex,
  ),
);
