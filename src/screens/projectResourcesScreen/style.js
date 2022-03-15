import {StyleSheet} from 'react-native';
import {fontMaker} from '../../utility/helper';
import Color from '../../utility/colorConstant';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  flatListHeader: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
    ...fontMaker('sem-bold'),
  },
  textStyle: {
    fontFamily: 'OpenSans-Italic',
  },
  titleText: {
    color: '#444',
    fontSize: 17,
    ...fontMaker('bold'),
  },
  introText: {
    paddingVertical: 5,
    color: '#000',
    fontSize: 16,
    ...fontMaker('sem-bold'),
  },
  shadow: {
    shadowColor: Color.CHANNEL_SEPARATOR_COLOR,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  projectButton: {
    paddingVertical: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  noDataFoundTitleText: {
    textAlign: 'center',
    fontSize: 17,
    ...fontMaker('bold'),
    color: '#444',
  },
  noDataFoundDescriptionText: {
    paddingTop: 2,
    textAlign: 'center',
    fontSize: 15,
    ...fontMaker('semi-bold'),
    color: '#444',
  },
});

export default styles;
