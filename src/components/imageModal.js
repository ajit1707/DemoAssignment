import React, {Component} from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import Feather from 'react-native-vector-icons/Feather';
import {imageShowOptions} from '../navigators/Root';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export const navigationOption = ({navigation}) => ({
  ...imageShowOptions(),
});
class ImageModal extends Component {
  static navigationOptions = ({navigation}) => ({
    ...navigationOption({navigation}),
  });
  constructor() {
    super();
    this.state = {
      widthOfImage: 0,
      heightOfImage: 0,
    };
  }

  componentDidMount() {
    const widthOfDevice = deviceWidth;
    const heightOfDevice = deviceHeight;
    let newWidth = '';
    let newHeight = '';
    Image.getSize(
      this.props.navigation.state.params.newImage,
      (width, height) => {
        if (width > widthOfDevice) {
          const aspectRatio = height / width;
          newWidth = widthOfDevice;
          newHeight = aspectRatio * newWidth;
        }
        if (newWidth !== '' && newHeight !== '') {
          this.setState({widthOfImage: newWidth, heightOfImage: newHeight});
        } else {
          this.setState({widthOfImage: width, heightOfImage: height});
        }
      },
    );
  }
  render() {
    const {widthOfImage, heightOfImage} = this.state;
    return (
      <View style={styles.modalContainer}>
        {
          <Image
            style={{width: widthOfImage, height: heightOfImage}}
            source={{uri: this.props.navigation.state.params.image}}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.99)',
  },
  crossButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    paddingLeft: 163,
  },
  crossIcon: {
    height: 13,
    width: 13,
  },
  header: {
    height: '10%',
    width: '98%',
    paddingRight: '2%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  modalSubContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  landscapeimage: {
    width: '100%',
    height: deviceHeight * 0.31,
  },
  iosLandscapeimage: {
    width: '100%',
    height: deviceHeight * 0.25,
  },
  potraitImage: {
    width: '100%',
    height: deviceHeight * 0.6,
  },
  iosPotraitImage: {
    width: '100%',
    height: deviceHeight * 0.65,
  },
  iosImg: {
    width: '100%',
    height: deviceWidth * 0.9,
    resizeMode: 'cover',
  },
  buttonContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    height: 25,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
});

ImageModal.defaultProps = {
  modalVisible: false,
};

ImageModal.propTypes = {
  modalVisible: PropTypes.bool,
};

export default ImageModal;
