import {Dimensions, StyleSheet} from 'react-native';
import {fontMaker} from '../../utility/helper';

const deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexStyle: {
    flex: 1,
  },
  headerStyles: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 20,
  },
  textStyle: {
    fontFamily: 'OpenSans-Italic',
  },
  defaultText: {
    alignSelf: 'center',
    flex: 1,
    color: '#444',
    fontSize: 22,
    textAlign: 'center',
    marginVertical: 15,
    width: '100%',
    paddingHorizontal: 15,
    ...fontMaker('bold'),
  },
  noActivitesMessage: {
    color: '#444',
    fontSize: 17,
    ...fontMaker('bold'),
  },
  message: {
    color: '#444',
    fontSize: 15,
    marginTop: 2,
  },
  noActivites: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mentorBackground: {
    backgroundColor: '#E5E5E5',
  },
  viewMarginBottom: {
    marginBottom: deviceWidth * 0.035,
  },
});

export default styles;
