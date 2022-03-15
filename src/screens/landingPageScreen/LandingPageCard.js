import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import Icon from '../../utility/icons';
import {Video} from '../../components';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default function LandingPageCard(props) {
  const {item, navigateToScreens, navigateToThreadPost, videoUrl} = props;
  return (
    <React.Fragment>
      {item.isCardVisible && (
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <View style={styles.iconContainer}>
              <Image
                accessible
                accessibilityLabel={`${item.title} icon`}
                accessibilityRole="image"
                source={item.icon}
                style={styles.crossIcon}
              />
            </View>
            <View style={styles.titles}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.subTitleText}>{item.subtitle}</Text>
            </View>
          </View>
          {item.image && (
            <Image
              accessible
              accessibilityLabel={
                item.id !== 'submit-article'
                  ? 'Expert profile'
                  : 'Submit Article'
              }
              accessibilityRole="image"
              resizeMode="contain"
              source={item.image}
              style={styles.mainImage}
            />
          )}
          {item.videoId && (
            <Video
              html={
                '<html><meta name="viewport" content="width=device-width", initial-scale=1 />' +
                `<iframe src="${videoUrl}"` +
                ` frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:200
                                        ;width:${deviceWidth}*0.9;position:absolute;top:0px;left:0px;right:0px;
                                        bottom:0px" height="100%" width="100%"  controls>` +
                '</iframe>' +
                '</html>'
              }
              containerStyles={
                Platform.OS === 'android'
                  ? styles.webViewContainer
                  : styles.webViewContainerIos
              }
              videoHeight={deviceHeight * 0.3}
              isYoutubeVideo
              videoWidth={
                Platform.OS === 'android'
                  ? deviceWidth * 0.85
                  : deviceWidth * 0.8
              }
              parentViewStyle={styles.videoContainer}
            />
          )}
          {item.picDesc && <Text style={styles.descText}>{item.picDesc}</Text>}
          {item.getTrendingPostPayload &&
          item.getTrendingPostPayload.data.length > 0 ? (
            <FlatList
              data={item.getTrendingPostPayload.data}
              extraData={item}
              bounces={false}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.newsArticleContainer}
                  onPress={() =>
                    navigateToThreadPost(item.attributes.thread_slug)
                  }>
                  <View style={styles.articleHeader}>
                    <Image source={Icon.POST_ICON} style={styles.articleIcon} />
                    <Text accessibilityRole="link" style={styles.articleTitle}>
                      {item.attributes.thread_name.trim()}
                      <Text style={styles.articleUploadedAt}>
                        {!item.attributes.is_anonymous
                          ? ` Posted ${formatDate(
                              item.attributes.created_at,
                            )} by` +
                            ` ${
                              item.attributes.created_by.first_name
                            } ${item.attributes.created_by.last_name
                              .charAt(0)
                              .toUpperCase()}`
                          : ` Posted ${formatDate(
                              item.attributes.created_at,
                            )} by Anonymous`}
                      </Text>
                    </Text>
                  </View>
                  <Text numberOfLines={2} style={styles.articleDetail}>
                    {item.attributes.content}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : item.getTrendingPostPayload &&
            item.getTrendingPostPayload.data.length === 0 ? (
            <View style={styles.expertNotAvailableContainer}>
              <Text style={styles.expertNotAvailableText}>
                No Trending Post Available
              </Text>
            </View>
          ) : null}
          {item.eventTitle && (
            <View style={styles.eventTitle}>
              <Text style={styles.eventTitleText}>{item.eventTitle}</Text>
            </View>
          )}
          {item.eventDetail && (
            <View style={styles.eventDetail}>
              <View style={styles.eventDetailRow}>
                <View style={styles.bullet} />
                <Text>{item.eventDetail.date}</Text>
              </View>
              <View style={styles.eventDetailRow}>
                <View style={styles.bullet} />
                <Text>{item.eventDetail.time}</Text>
              </View>
              <View style={styles.eventDetailRow}>
                <View style={styles.bullet} />
                <Text>{item.eventDetail.cost}</Text>
              </View>
            </View>
          )}
          {item.expertIsAvailable === false && (
            <View style={styles.expertNotAvailableContainer}>
              <Text style={styles.expertNotAvailableText}>
                {item.noExpertText}
              </Text>
            </View>
          )}
          {item.footer && (
            <View style={styles.footerContainer}>
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.2}
                onPress={() => {
                  item.index ? navigateToScreens(item.index) : null;
                }}>
                <Text style={styles.footerText}>{item.footer}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </React.Fragment>
  );
}

const formatDate = (date) => {
  const dataObject = new Date(Date.parse(date));
  const currentDate = moment.utc(moment().toDate());
  const createdDate = moment.utc(dataObject);
  let dateString = '';
  switch (currentDate.diff(createdDate, 'days')) {
    case 0:
      dateString = `today ${createdDate.format('[@] HH:mm')}`;
      break;
    case 1:
      dateString = `yesterday ${createdDate.format('[@] HH:mm')}`;
      break;
    default:
      dateString = createdDate.format('Do MMM YYYY [@] HH:mm');
  }
  return dateString;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '98%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: {width: 3, height: 3},
    elevation: 5,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 5,
  },
  iconContainer: {},
  crossIcon: {
    height: 40,
    width: 40,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 10,
  },
  titles: {
    marginTop: 5,
    width: '70%',
    overflow: 'hidden',
  },
  titleText: {
    fontSize: 20,
    flexWrap: 'wrap',
    color: '#1E2121',
    marginBottom: 5,
  },
  subTitleText: {
    flexWrap: 'wrap',
    color: '#667A93',
  },
  mainImage: {
    width: '95%',
    height: 200,
    alignSelf: 'center',
  },
  footerContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  footerText: {
    flexWrap: 'wrap',
    fontSize: 18,
    color: '#621D6E',
    marginVertical: 10,
    textAlign: 'center',
  },
  descText: {
    textAlign: 'center',
    flexWrap: 'wrap',
    color: '#667A93',
    marginBottom: 15,
    marginHorizontal: 10,
    marginTop: 10,
  },
  newsArticleContainer: {
    marginBottom: 10,
    width: '90%',
  },
  articleHeader: {
    flex: 1,
    flexDirection: 'row',
    width: '85%',
  },
  articleIcon: {
    height: 20,
    width: 20,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 10,
  },
  eventDetail: {
    marginHorizontal: 45,
    width: '80%',
    marginBottom: 10,
  },
  eventTitle: {
    marginHorizontal: 45,
    marginBottom: 20,
  },
  articleTitle: {
    marginTop: 10,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  articleUploadedAt: {
    color: 'blue',
    marginTop: 10,
    flexWrap: 'wrap',
    fontWeight: 'normal',
  },
  articleDetail: {
    marginLeft: 50,
    // textAlign:'center'
  },
  eventTitleText: {
    fontWeight: 'bold',
  },
  expertNotAvailableContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '95%',
    height: 150,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  expertNotAvailableText: {
    alignSelf: 'center',
    flexWrap: 'wrap',
    fontSize: 20,
    color: '#000',
    // marginVertical: 10
  },
  eventDetailRow: {
    flex: 1,
    flexDirection: 'row',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
    marginTop: 7,
    marginRight: 5,
  },
  video: {
    height: 220,
    width: '100%',
    alignSelf: 'center',
  },
  webViewContainer: {
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.85,
  },
  webViewContainerIos: {
    height: deviceHeight * 0.25,
    width: deviceWidth * 0.8,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

LandingPageCard.propTypes = {
  item: PropTypes.object.isRequired,
  navigateToScreens: PropTypes.func.isRequired,
  navigateToThreadPost: PropTypes.func.isRequired,
};
