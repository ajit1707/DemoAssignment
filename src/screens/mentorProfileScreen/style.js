import {StyleSheet} from 'react-native';
import {fontMaker} from '../../utility/helper';

const imageHeight = 140;
const imageWidth = 140;
const imageBorderRadius = 70;

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    ...fontMaker('italic'),
    color: '#0645AD',
    borderBottomWidth: 1,
    borderColor: '#0645AD',
  },
  bottomBorder: {
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#AAABAC',
    marginTop: '16%',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: '5%',
  },
  biography: {
    marginHorizontal: 20,
    fontSize: 16,
    marginTop: '2%',
    color: '#666',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 4,
    borderColor: '#0078af',
    borderWidth: 1,
    marginVertical: '3%',
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
    marginBottom: '4%',
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
    borderColor: '#666',
    borderWidth: 1,
  },
  profileName: {
    fontSize: 18,
    alignSelf: 'center',
    ...fontMaker('bold'),
  },
  sectionTitle: {
    fontSize: 18,
    color: '#002b39',
    marginHorizontal: 20,
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
});

export default styles;
