import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  Platform,
  RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Container, Video, HtmlRenderer} from '../../components';
import Config from '../../utility/config';
import Constant from '../../utility/constant';
import Icons from '../../utility/icons';
import {
  getLandingPageDetails,
  getLandingPageData,
} from '../../modules/getLandingPageDetails';
import {fontMaker, detectHTMLTags} from '../../utility/helper';
import {getProjects, setSideMenuItems} from '../../modules/getProjects';
import {getChannels} from '../../modules/getChannels';
import {channelsUser} from '../../modules/channelsUser';
import {channelMessage} from '../../modules/channelMessage';
import {
  channelSelected,
  displayChannelItems,
  setSelectedChannelItemIndex,
} from '../../modules/displayChannelItems';
import {getSelectedProject} from '../../modules/getSelectedProject';
import {getAskGraduateDetail} from '../../modules/landingPage';
import {getUserDetails} from '../../modules/getUserDetail';
import {navigateToMessage} from '../../modules/deepLinkHandler';
import Toast from 'react-native-simple-toast';
import {getProfileDetail} from '../../modules/profile';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class LandingPage extends Component {
  constructor() {
    super();
    this.state = {
      refreshing: false,
      navigationToMessage: true,
    };
  }

  componentDidMount() {
    const {
      screenProps: {emitter},
    } = this.props;
    this.getLandingPageData();
  }

  showMatchingToolTopupMessage = () => {
    if (
      ((this.props.projectSessionPayload &&
        this.props.projectSessionPayload.data[0].attributes.typeform_enabled) ||
        (this.props.selectedProjectPayload &&
          this.props.selectedProjectPayload.data.attributes
            .typeform_enabled)) &&
      ((this.props.projectSessionPayload &&
        this.props.projectSessionPayload.data[0].attributes.matching_enabled ===
          false) ||
        (this.props.selectedProjectPayload &&
          this.props.selectedProjectPayload.data.attributes.matching_enabled ===
            false)) &&
      this.props.userDetailPayload.data[0].attributes.state === 'unmatched' &&
      this.props.userDetailPayload.included[1].attributes.name === 'mentee' &&
      this.props.userDetailPayload.data[0].attributes.survey_state !==
        'unstarted' &&
      !this.props.userDetailPayload.data[0].attributes['has_survey?']
    ) {
      Toast.showWithGravity(
        'Mentor Matching Tool - needs a top-up!\n' +
          "All the mentors on this project have already been snapped up! We'll allocate more amazing mentors very soon and notify you when you can try again!",
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };

  onRefresh = async () => {
    const {dispatch, channelItems} = this.props;
    const projectSwitcherSelectedData = await AsyncStorage.getItem(
      Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
      () => {},
    );
    const parsedProjectData = JSON.parse(projectSwitcherSelectedData);
    if (parsedProjectData) {
      dispatch(getSelectedProject())
        .then(() => {
          dispatch(getUserDetails());
          dispatch(getChannels());
          dispatch(channelsUser()).then(() => {
            dispatch(displayChannelItems(channelItems));
          });
          this.getLandingPageData();
        })
        .catch(() => {
          this.setState({
            refreshing: false,
          });
        });
    } else {
      dispatch(getProjects())
        .then(() => {
          dispatch(getUserDetails());
          dispatch(getChannels());
          dispatch(channelsUser()).then(() => {
            dispatch(displayChannelItems(channelItems));
          });
          this.getLandingPageData();
        })
        .catch(() => {
          this.setState({
            refreshing: false,
          });
        });
    }
  };

  getLandingPageData = () => {
    const {dispatch} = this.props;
    dispatch(getLandingPageDetails())
      .then(() => {
        dispatch(getAskGraduateDetail()).then(() => {
          this.showMatchingToolTopupMessage();
          this.setState({
            refreshing: false,
          });
        });
      })
      .catch(() => {
        this.setState({
          refreshing: false,
        });
      });
  };

  navigateToChannel = () => {
    const {
      channelItems,
      dispatch,
      navigation: {navigate},
      screenProps: {emitter},
    } = this.props;
    const {navigationToMessage} = this.state;
    if (navigationToMessage === true) {
      navigate('Message');
      this.setState({navigationToMessage: false});
      const channelsPayloadCopy = channelItems;
      dispatch(channelSelected());
      dispatch(getChannels());
      dispatch(channelsUser());
      emitter.emit('setSideMenuItemIndex', -1);
      if (channelItems && channelItems.length) {
        dispatch(channelMessage([], channelItems[0], null, 'sideMenu'));
        channelsPayloadCopy[0].notificationCount = 0;
        dispatch(displayChannelItems(channelsPayloadCopy));
        dispatch(setSelectedChannelItemIndex(0));
        dispatch(getProfileDetail());
        this.setState({navigationToMessage: true});
      }
    }
  };

  render() {
    const {
      sideMenuItems,
      landingPageDetails,
      fetching,
      getLandingPageReduxData: {
        titleData,
        introData,
        imageUrl,
        bodyData,
        videoUrl,
        titleOfLandingPage,
      },
    } = this.props;
    return (
      <Container fetching={fetching} style={{flex: 1}}>
        {landingPageDetails && (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }>
            <View style={styles.landingPageContainer}>
              <Text style={styles.titleDataText}>{titleData}</Text>
              {introData ? (
                detectHTMLTags(introData) ? (
                  <HtmlRenderer
                    html={introData}
                    baseFontStyle={styles.introDatabaseFontStyle}
                    tagsStyles={{p: styles.introDatabasetagsStyles}}
                    containerStyle={styles.introDatabasecontainerStyle}
                  />
                ) : (
                  <Text style={styles.introDatabaseTextStyle}>{introData}</Text>
                )
              ) : (
                <View style={styles.landingPageDefaultView}>
                  <Text style={styles.landingPageDefaultText}>
                    {Constant.LANDING_PAGE_DEFAULT.INTRO}
                  </Text>
                </View>
              )}
              <View style={styles.landingPageDefaultButtonTextView}>
                <TouchableOpacity
                  accessibilityRole="button"
                  style={[
                    styles.buttonTextViewOpacity,
                    {borderColor: sideMenuItems.sideMenuColor},
                  ]}
                  onPress={() => this.navigateToChannel()}>
                  <Text
                    style={[
                      styles.buttonTextView,
                      {color: sideMenuItems.sideMenuColor},
                    ]}
                    numberOfLines={1}>
                    {Constant.LANDING_PAGE_DEFAULT.CHANNEL_BUTTON_TEXT}
                  </Text>
                </TouchableOpacity>
              </View>
              {videoUrl && (
                <View
                  style={styles.videoUrlView}
                  accessible
                  accessibilityLabel="Landing page video">
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
                    videoWidth={
                      Platform.OS === 'android'
                        ? deviceWidth * 0.9
                        : deviceWidth * 0.8
                    }
                  />
                </View>
              )}
              <View
                style={!bodyData ? styles.bodyDataMargin : null}
                accessible
                accessibilityLabel={`${
                  Platform.OS === 'android'
                    ? 'Landing page '
                    : 'Landing page image'
                } `}
                accessibilityRole="image">
                {imageUrl !== '' && titleOfLandingPage !== '' ? (
                  <Image
                    source={
                      imageUrl
                        ? {uri: `${Config.IMAGE_SERVER_CDN}${imageUrl}`}
                        : `${Icons.LANDING_PAGE_DEFAULT}`
                    }
                    resizeMode="contain"
                    style={styles.imageView}
                  />
                ) : imageUrl === '' && titleOfLandingPage !== '' ? (
                  <View />
                ) : (
                  (imageUrl === '' || imageUrl === null) &&
                  titleOfLandingPage === '' && (
                    <Image
                      source={
                        imageUrl
                          ? {uri: `${Config.IMAGE_SERVER_CDN}${imageUrl}`}
                          : `${Icons.LANDING_PAGE_DEFAULT}`
                      }
                      resizeMode="contain"
                      style={styles.imageView}
                    />
                  )
                )}
              </View>
              {bodyData ? (
                detectHTMLTags(bodyData) ? (
                  <HtmlRenderer
                    html={bodyData}
                    baseFontStyle={styles.bodyDataBaseFontStyle}
                    tagsStyles={{p: styles.bodyDatatagsStyles}}
                    containerStyle={styles.bodyDataContainerStyle}
                  />
                ) : (
                  <Text style={styles.bodyDataTextStyle}>{bodyData}</Text>
                )
              ) : null}
            </View>
          </ScrollView>
        )}
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  video: {
    height: deviceHeight * 0.3,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 25,
  },
  webViewContainer: {
    height: deviceHeight * 0.3,
    width: deviceWidth * 0.9,
  },
  webViewContainerIos: {
    height: deviceHeight * 0.25,
    width: deviceWidth * 0.8,
  },
  bodyDataBaseFontStyle: {
    fontSize: 16,
    textAlign: 'center',
    ...fontMaker('regular'),
  },
  bodyDatatagsStyles: {
    textAlign: 'center',
  },
  bodyDataContainerStyle: {
    paddingVertical: 25,
    width: '90%',
    alignSelf: 'center',
  },
  bodyDataTextStyle: {
    fontSize: 16,
    textAlign: 'center',
    ...fontMaker('regular'),
  },
  landingPageContainer: {
    width: deviceWidth * 0.95,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  titleDataText: {
    ...fontMaker('bold'),
    fontSize: 22,
    textAlign: 'center',
    paddingTop: 25,
  },
  introDatabaseFontStyle: {
    fontSize: 16,
    textAlign: 'center',
    ...fontMaker('regular'),
  },
  introDatabasetagsStyles: {
    textAlign: 'center',
  },
  introDatabasecontainerStyle: {
    paddingVertical: 25,
    width: '90%',
    alignSelf: 'center',
  },
  introDatabaseTextStyle: {
    fontSize: 16,
    textAlign: 'center',
    ...fontMaker('regular'),
  },
  landingPageDefaultView: {
    width: '90%',
    alignSelf: 'center',
  },
  landingPageDefaultText: {
    ...fontMaker('regular'),
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 25,
  },
  landingPageDefaultButtonTextView: {
    width: '80%',
    alignSelf: 'center',
    paddingBottom: 25,
  },
  buttonTextViewOpacity: {
    borderWidth: 1,
    borderRadius: 2,
  },
  buttonTextView: {
    padding: 10,
    ...fontMaker('semiBold'),
    fontSize: 16,
    textAlign: 'center',
  },
  videoUrlView: {
    paddingBottom: 25,
    alignItems: 'center',
  },
  imageView: {
    height: 250,
    width: '100%',
  },
  bodyDataMargin: {
    marginBottom: 30,
  },
});

LandingPage.defaultProps = {
  fetching: false,
  landingPageDetails: null,
  navigation: null,
  channelItems: null,
  getLandingPageReduxData: null,
};
LandingPage.propTypes = {
  fetching: PropTypes.bool,
  sideMenuItems: PropTypes.object.isRequired,
  landingPageDetails: PropTypes.object,
  navigation: PropTypes.object,
  channelItems: PropTypes.array,
  getLandingPageReduxData: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  screenProps: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetching: state.getLandingPageDetailsReducer.fetching,
  landingPageDetails: state.getLandingPageDetailsReducer.landingPageDetails,
  getLandingPageReduxData: getLandingPageData(state),
  sideMenuItems: setSideMenuItems(state),
  channelItems: state.displayChannelItemsReducer.channelItems,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
});

export default connect(mapStateToProps)(LandingPage);
