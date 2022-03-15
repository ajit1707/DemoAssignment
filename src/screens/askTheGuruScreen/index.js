import React, {Component} from 'react';
import {connect} from 'react-redux';
import {HeaderBackButton, NavigationActions} from 'react-navigation';
import {TabView, TabBar} from 'react-native-tab-view';
import {Text, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import Style from './style';
import {Container} from '../../components';
import AskTheGuru from './askTheGuru';
import FeaturedGuru from './featuredGuru';
import HoldingPage from './holdingPage';
import Constant from '../../utility/colorConstant';
import {setSideMenuItems} from '../../modules/getProjects';
import {
  channelDeselected,
  displayChannelItems,
  resetSelectedChannelItemIndex,
} from '../../modules/displayChannelItems';
import {clearChannelMessages} from '../../modules/channelMessage';
import {socketLeaveChannel} from '../../utility/phoenix-utils';
import {getChannels} from '../../modules/getChannels';
import {channelsUser} from '../../modules/channelsUser';

class AskTheGuruScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.title && navigation.state.params.title,
    headerLeft: (
      <HeaderBackButton
        tintColor={Constant.HEADER_LEFT_BACK_BUTTON}
        onPress={() =>
          navigation.state.params.updateLandingPage &&
          navigation.state.params.updateLandingPage()
        }
      />
    ),
  });

  constructor(props) {
    super(props);
    const {
      navigation: {
        state: {
          params: {expertTitle},
        },
      },
    } = props;
    this.state = {
      index: 0,
      routes: [
        {
          key: 'first',
          title: `Ask The ${expertTitle}`,
          accessibilityLabel: `Ask The ${expertTitle} tab`,
        },
        {
          key: 'second',
          title: `Featured ${expertTitle}`,
          accessibilityLabel: `Featured ${expertTitle} tab`,
        },
      ],
    };
  }

  componentDidMount() {
    const {
      getAskGraduateDetailsPayload: {
        data: [
          {
            attributes: {holding_text_enabled: holdingTextEnabled},
          },
        ],
      },
      navigation: {
        state: {
          params: {expertTitle, expertIsAvailable},
        },
      },
      navigation: {setParams},
    } = this.props;
    if (expertIsAvailable || holdingTextEnabled) {
      setParams({title: `Ask The ${expertTitle}`});
    } else {
      setParams({title: `Featured ${expertTitle}`});
    }
    setParams({updateLandingPage: this.updateLandingPage});
  }

  onTabPress = (currentTab) => {
    const {
      navigation: {setParams},
    } = this.props;
    setParams({title: currentTab.route.title});
  };

  navigateToAskExpert = (item, route) => {
    const {
      navigation: {
        navigate,
        state: {
          params: {expertTitle},
        },
      },
    } = this.props;
    navigate('ExpertDetailsScreen', {item, expertTitle, route});
  };

  updateLandingPage = () => {
    const {
      screenProps: {emitter},
      navigation: {navigate},
      dispatch,
      channelItems,
    } = this.props;
    dispatch(getChannels());
    dispatch(channelsUser()).then(() => {
      dispatch(displayChannelItems(channelItems));
    });
    emitter.emit('updateLandingPage');
    emitter.emit('setSideMenuItemIndex', 0);
    dispatch(resetSelectedChannelItemIndex());
    dispatch(clearChannelMessages());
    dispatch(channelDeselected());
    socketLeaveChannel();
    navigate('LandingPage');
  };

  renderTabBar = (props) => {
    const {sideMenuItems} = this.props;
    return (
      <TabBar
        {...props}
        style={{backgroundColor: '#fff'}}
        renderLabel={this.renderLabel}
        indicatorStyle={{
          backgroundColor: sideMenuItems && sideMenuItems.sideMenuColor,
        }}
        onTabPress={this.onTabPress}
      />
    );
  };

  renderLabel = ({route, focused}) => {
    const {sideMenuItems} = this.props;
    return (
      <Text
        style={[
          Style.boldTextTitle,
          focused
            ? {color: sideMenuItems && sideMenuItems.sideMenuColor}
            : {opacity: 0.5, color: '#ccc'},
        ]}>
        {route.title}
      </Text>
    );
  };

  renderScene = ({route}) => {
    const {
      navigation: {
        state: {
          params: {expertIsAvailable},
        },
      },
      getAskGraduateDetailsPayload,
      getAskGraduateDetailsPayload: {
        data: [
          {
            attributes: {responsible_mail: responsibleMail},
          },
        ],
      },
    } = this.props;
    if (route && route.key) {
      let activeGraduate = [];
      if (
        getAskGraduateDetailsPayload &&
        getAskGraduateDetailsPayload.included
      ) {
        activeGraduate = getAskGraduateDetailsPayload.included.filter(
          (graduate) => graduate.attributes.state === 'active',
        );
      }
      const showHoldingPage = !expertIsAvailable || activeGraduate.length === 0;

      switch (route.key) {
        case 'first':
          return showHoldingPage ? (
            <HoldingPage />
          ) : (
            <AskTheGuru
              guru={activeGraduate[0]}
              route={route.key}
              responsibleMail={responsibleMail}
              featuredOn={false}
            />
          );
        case 'second':
          return (
            <FeaturedGuru
              navigateToAskExpert={this.navigateToAskExpert}
              route={route}
            />
          );
        default:
          return null;
      }
    }
  };

  render() {
    const {
      getAskGraduateDetailsPayload,
      navigation: {
        state: {
          params: {expertIsAvailable},
        },
      },
    } = this.props;
    const holdingTextEnabled =
      getAskGraduateDetailsPayload &&
      getAskGraduateDetailsPayload.data &&
      getAskGraduateDetailsPayload.data[0].attributes.holding_text_enabled;

    return (
      <Container>
        {(expertIsAvailable || holdingTextEnabled) && (
          <TabView
            onIndexChange={(index) => this.setState({index})}
            swipeEnabled={false}
            navigationState={this.state}
            renderScene={this.renderScene}
            initialLayout={{width: Dimensions.get('window').width}}
            renderTabBar={this.renderTabBar}
          />
        )}
        {!(expertIsAvailable || holdingTextEnabled) && (
          <FeaturedGuru navigateToAskExpert={this.navigateToAskExpert} />
        )}
      </Container>
    );
  }
}
AskTheGuruScreen.defaultProps = {
  userDetailPayload: null,
  sideMenuItems: null,
  getAskGraduateDetailsPayload: null,
  screenProps: null,
};

AskTheGuruScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  userDetailPayload: PropTypes.object,
  sideMenuItems: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  getAskGraduateDetailsPayload: PropTypes.object,
  screenProps: PropTypes.object,
};

const mapStateToProps = (state) => ({
  getAskGraduateDetailsPayload:
    state.askGraduateCardReducer.getAskGraduateDetailsPayload,
  sideMenuItems: setSideMenuItems(state),
  channelItems: state.displayChannelItemsReducer.channelItems,
});

export default connect(mapStateToProps)(AskTheGuruScreen);
