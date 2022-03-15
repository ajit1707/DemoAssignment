import {StyleSheet} from 'react-native';
import {fontMaker} from '../../utility/helper';

const imageHeight = 120;
const imageWidth = 120;
const imageBorderRadius = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonComponent: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    ...fontMaker('italic'),
    color: '#0645AD',
    borderBottomWidth: 1,
    borderColor: '#0645AD',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 4,
    borderColor: '#0078af',
    borderWidth: 1,
    marginVertical: '3%',
  },
  cameraIcon: {
    marginVertical: 11,
    marginHorizontal: 11,
  },
  notificationView: {
    marginBottom: 15,
    marginTop: 25,
  },
  headerStyles: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 20,
  },
  imageContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButton: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
    backgroundColor: '#ccc',
    marginTop: 60,
  },
  profileImage: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
  },
  profileName: {
    fontSize: 18,
    alignSelf: 'center',
    ...fontMaker('bold'),
  },
  sectionTitle: {
    fontSize: 14,
    color: '#ccc',
    marginHorizontal: 20,
    ...fontMaker('bold'),
  },
  checkboxText: {
    fontSize: 14,
    color: '#000',
    width: '100%',
    ...fontMaker('semibold'),
  },
  checkBoxContainer: {
    flexDirection: 'row',
    marginLeft: 5,
    marginBottom: 8,
  },
  displayNameContainer: {
    marginTop: 60,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectImageButton: {
    height: 45,
    width: 45,
    borderRadius: 25,
    position: 'absolute',
    bottom: -5,
    right: 8,
  },
});

export default styles;
