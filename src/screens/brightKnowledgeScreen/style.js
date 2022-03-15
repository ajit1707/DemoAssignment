import {StyleSheet, Dimensions} from 'react-native';
import {fontMaker} from '../../utility/helper';
import Color from '../../utility/colorConstant';

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  attachmentLink: {
    paddingRight: 3,
    alignSelf: 'center',
  },
  attachmentView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: Color.CHANNEL_SEPARATOR_COLOR,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  leftImageContainer: {
    width: '30%',
    paddingHorizontal: 5,
  },
  image: {
    width: '100%',
    height: 80,
    maxHeight: 80,
  },
  rightContainer: {
    width: '70%',
    paddingHorizontal: 5,
  },
  dateTag: {
    fontSize: 10,
    ...fontMaker('regular'),
    alignSelf: 'center',
  },
  categoryTagContainer: {
    backgroundColor: '#fff',
    marginLeft: 7,
    maxWidth: deviceWidth * 0.3,
  },
  categoryTagContainerArticle: {
    backgroundColor: '#fff',
  },
  categoryButton: {
    width: '100%',
    borderRadius: 2,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  categoryButtonArticle: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  categoryButtonText: {
    fontSize: 10,
    ...fontMaker('bold'),
    padding: 4,
  },
  categoryButtonTextArticles: {
    fontSize: 12,
    ...fontMaker('semibold'),
  },
  rightTopContainer: {
    flexDirection: 'row',
  },
  rightTopLeftView: {
    flex: 3,
    flexDirection: 'row',
  },
  rightTopRightView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  countLikeContainer: {
    fontSize: 12,
    ...fontMaker('regular'),
    alignSelf: 'center',
    color: '#000',
  },
  likeButtonIcon: {
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
  attacheLinkIcon: {
    width: 20,
    height: 20,
  },
  rightBottomContainer: {
    marginTop: 5,
    width: '95%',
  },
  boldTextTitle: {
    color: '#000',
    fontSize: 13,
    ...fontMaker('bold'),
    paddingVertical: 3,
  },
  titleDescription: {
    color: '#4d3a3a',
    fontSize: 13,
    ...fontMaker('regular'),
  },
});

export default styles;
