import {Dimensions, StyleSheet, Platform} from 'react-native';
import Color from '../../utility/colorConstant';
import {fontMaker} from '../../utility/helper';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  headerStyles: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 20,
  },
  textStyle: {
    fontFamily: 'OpenSans-Italic',
  },
  flatListContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 70,
    borderColor: Color.SEPARATOR_COLOR,
    flexDirection: 'row',
    width: deviceWidth * 0.92,
    alignItems: 'center',
  },
  circleContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircleText: {
    color: '#fff',
    fontSize: 27,
    textAlign: 'center',
    paddingLeft: Platform.OS === 'ios' ? null : 7,
    paddingBottom: Platform.OS === 'ios' ? null : 2,
  },
  projectListText: {
    fontSize: 16,
    marginLeft: 15,
    fontFamily: 'OpenSans-Regular',
    color: '#000',
    width: '80%',
  },
  noContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContentText: {
    ...fontMaker('semibold'),
    fontSize: 18,
  },
  FlatListView: {
    height: 1000,
  },
});

export default styles;
