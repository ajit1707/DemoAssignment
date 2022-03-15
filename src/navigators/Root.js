import React from 'react';
import {
  createStackNavigator,
  createDrawerNavigator,
  DrawerActions,
  createMaterialTopTabNavigator,
  HeaderBackButton,
} from 'react-navigation';
import {connect} from 'react-redux';
import {TouchableOpacity, Image, Text, Platform, View} from 'react-native';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from '../utility/icons';
import Styles from '../components/Styles';
import LoginScreen from '../screens/loginScreen/index';
import SplashScreen from '../components/SplashScreen';
import SideMenu from '../components/SideMenu';
import WelcomeScreen from '../screens/welcomeScreen/index';
import MentoringScreen from '../screens/mentoringScreen/index';
import ProfileScreen from '../screens/profileScreen/index';
import AssignmentScreen from '../screens/assignmentScreen/index';
import CommunitiesScreen from '../screens/communitiesScreen/index';
import AskTheGuruScreen from '../screens/askTheGuruScreen/index';
import BrightKnowledgeScreen from '../screens/brightKnowledgeScreen/index';
import ArticleList from '../screens/brightKnowledgeScreen/articleList';
import CategoryScreen from '../screens/brightKnowledgeScreen/brightKnowledgeCategoryView';
import ActivitiesScreen from '../screens/activitiesScreen/index';
import SignUpScreen from '../screens/signupScreen';
import ProjectResourcesScreen from '../screens/projectResourcesScreen/index';
import ForgotPasswordScreen from '../screens/forgotPasswordScreen/index';
import PasswordValidationCodeScreen from '../screens/forgotPasswordScreen/passwordValidationCodeView';
import ProjectCodeScreen from '../screens/signupScreen/projectCodeView';
import PolicyScreen from '../components/PolicyScreen';
import Color from '../utility/colorConstant';
import LandingScreen from '../screens/landingPageScreen/index';
import ActiveProject from '../screens/projectListScreen/activeProjects';
import ArchivedProject from '../screens/projectListScreen/archivedProjects';
import MessageScreen from '../screens/messageScreen/index';
import ResetPasswordScreen from '../screens/forgotPasswordScreen/resetPasswordView';
import ReportMessageScreen from '../screens/messageScreen/reportMessageView';
import CommonStyle from '../styles/commonStyle';
import ExpertDetailsScreen from '../screens/askTheGuruScreen/expertDetailsView';
import SelectedTopicScreen from '../screens/communitiesScreen/selectedTopic';
import AddTopicScreen from '../screens/communitiesScreen/addTopicOrThread';
import ThreadPost from '../screens/communitiesScreen/threadPostView';
import QuickPost from '../screens/communitiesScreen/quickPostView';
import SubmitArticle from '../screens/submitArticleScreen/index';
import ViewMyArticle from '../screens/submitArticleScreen/viewMyArticle';
import {fontMaker, testID} from '../utility/helper';
import AuthLoadingScreen from '../components/AuthLoadingScreen';
import Constant from '../utility/constant';
import ActivitiesQuestion from '../screens/activitiesScreen/activitesQuestionView';
import ActivitiesMentorQuestion from '../screens/activitiesScreen/activitiesMentorQuestionView';
import MentorQuestionScreen from '../screens/landingPageScreen/mentorQuestion';
import MenteeQuestionScreen from '../screens/landingPageScreen/menteeQuestionScreen';
import MentorDetailsScreen from '../screens/landingPageScreen/mentorDetails';
import MenteeTypeform from '../components/menteeTypeform';
import MentorProfileScreen from '../screens/mentorProfileScreen';
import AchievementScreen from '../screens/achievementScreen';
import ImageModal from '../components/imageModal';
import VideoModal from '../components/videoModal';

const navOptions = {
  headerTitleStyle: {
    textAlign: 'center',
    flexGrow: 1,
    alignSelf: 'center',
    color: '#fff',
  },
};

const tabBarOption = (screenProps) => ({
  upperCaseLabel: false,
  showLabel: true,
  inactiveTintColor: '#ccc',
  activeTintColor: screenProps.sideMenuColor,
  indicatorStyle: {
    backgroundColor: screenProps.sideMenuColor,
  },
  style: {
    backgroundColor: '#fff',
  },
});

const TabNavigator = createMaterialTopTabNavigator(
  {
    Active: {
      screen: ActiveProject,
      navigationOptions: ({screenProps}) => ({
        header: null,
        tabBarOptions: tabBarOption(screenProps),
      }),
    },
    Archived: {
      screen: ArchivedProject,
      navigationOptions: ({screenProps}) => ({
        tabBarOptions: tabBarOption(screenProps),
      }),
    },
  },
  {
    initialRouteName: 'Active',
    swipeEnabled: false,
    animationEnabled: false,
    lazy: false,
    navigationOptions: {
      title: 'Project Switcher',
      headerTitleStyle: {
        textAlign: 'center',
        flexGrow: 1,
        color: '#fff',
        paddingRight: Platform.OS === 'ios' ? 22 : 45,
      },
    },
  },
);

export const navigationOptions = ({navigation, screenProps}, title) => ({
  title,
  headerStyle: {backgroundColor: screenProps.sideMenuColor},
  headerLeft: (
    <TouchableOpacity
      accessibilityLabel={
        Constant.ACCESSIBILITY.HAMBURGER_MENU.accessibilityLabel
      }
      accessibilityRole={
        Constant.ACCESSIBILITY.HAMBURGER_MENU.accessibilityRole
      }
      activeOpacity={0.7}
      style={Styles.menuContainer}
      onPress={() => {
        navigation.dispatch(DrawerActions.openDrawer());
      }}>
      <Image source={Icon.MENU} style={Styles.menuStyle} />
    </TouchableOpacity>
  ),
  headerRight: <Text />,
  ...navOptions,
});

export const messageNavigationOptions = (
  {navigation, screenProps},
  currentChannelData,
  showModal,
  showSmartModerationFlag,
  handleReportMessage,
  handleSmartModeration,
) => ({
  title: !showSmartModerationFlag
    ? currentChannelData && currentChannelData.channelName
    : null,
  headerStyle: {
    backgroundColor: screenProps.sideMenuColor,
    ...CommonStyle.shadow,
  },
  headerLeft: (
    <React.Fragment>
      {showSmartModerationFlag ? (
        <HeaderBackButton
          tintColor={Color.HEADER_LEFT_BACK_BUTTON}
          onPress={() => {
            handleSmartModeration();
          }}
        />
      ) : (
        <TouchableOpacity
          accessibilityLabel={
            Constant.ACCESSIBILITY.HAMBURGER_MENU.accessibilityLabel
          }
          accessibilityRole={
            Constant.ACCESSIBILITY.HAMBURGER_MENU.accessibilityRole
          }
          activeOpacity={0.7}
          style={Styles.menuContainer}
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}>
          <Image source={Icon.MENU} style={Styles.menuStyle} />
        </TouchableOpacity>
      )}
    </React.Fragment>
  ),
  headerRight: (
    <React.Fragment>
      {currentChannelData &&
      currentChannelData.channelType === 'group' &&
      !showSmartModerationFlag ? (
        <TouchableOpacity
          accessibilityLabel="Group information"
          accessibilityRole="button"
          activeOpacity={0.7}
          style={Styles.menuContainer}
          onPress={() => {
            showModal();
          }}>
          <FontAwesome name="info-circle" size={25} color="#fff" />
        </TouchableOpacity>
      ) : showSmartModerationFlag ? (
        <TouchableOpacity
          activeOpacity={0.7}
          style={Styles.menuContainer}
          onPress={() => {
            handleReportMessage();
          }}>
          <FontAwesome name="flag" size={18} color="#fff" />
        </TouchableOpacity>
      ) : null}
    </React.Fragment>
  ),
  ...navOptions,
});
export const assignmentNavigationOptions = (
  {navigation, screenProps},
  handleFile,
  IconFlag,
) => ({
  title: 'Assignments',
  headerStyle: {
    backgroundColor: screenProps.sideMenuColor,
    ...CommonStyle.shadow,
  },
  headerLeft: (
    <React.Fragment>
      <TouchableOpacity
        accessibilityLabel={
          Constant.ACCESSIBILITY.HAMBURGER_MENU.accessibilityLabel
        }
        accessibilityRole={
          Constant.ACCESSIBILITY.HAMBURGER_MENU.accessibilityRole
        }
        activeOpacity={0.7}
        style={Styles.menuContainer}
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}>
        <Image source={Icon.MENU} style={Styles.menuStyle} />
      </TouchableOpacity>
    </React.Fragment>
  ),
  headerRight: (
    <React.Fragment>
      {IconFlag ? (
        <TouchableOpacity
          accessibilityLabel="Upload Assignment"
          accessibilityRole="button"
          activeOpacity={0.7}
          style={Styles.menuContainer}
          onPress={() => handleFile()}>
          <Ionicons name="md-add-circle" size={28} color="#fff" />
        </TouchableOpacity>
      ) : null}
    </React.Fragment>
  ),
  ...navOptions,
});

export const achievementNavigationOptions = (
  {navigation, screenProps},
  handleFile,
  IconFlag,
) => ({
  title: 'My Achievements',
  headerStyle: {
    backgroundColor: screenProps.sideMenuColor,
    ...CommonStyle.shadow,
  },
  headerLeft: (
    <React.Fragment>
      <TouchableOpacity
        accessibilityLabel={
          Constant.ACCESSIBILITY.HAMBURGER_MENU.accessibilityLabel
        }
        accessibilityRole={
          Constant.ACCESSIBILITY.HAMBURGER_MENU.accessibilityRole
        }
        activeOpacity={0.7}
        style={Styles.menuContainer}
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}>
        <Image source={Icon.MENU} style={Styles.menuStyle} />
      </TouchableOpacity>
    </React.Fragment>
  ),
  headerRight: (
    <React.Fragment>
      {IconFlag ? (
        <TouchableOpacity
          accessibilityLabel="Upload Assignment"
          accessibilityRole="button"
          activeOpacity={0.7}
          style={Styles.menuContainer}
          onPress={() => {
            handleFile();
          }}>
          <AntDesign name="clouddownload" size={28} color="#fff" />
        </TouchableOpacity>
      ) : null}
    </React.Fragment>
  ),
  ...navOptions,
});
export const imageShowOptions = () => ({
  // headerStyle: { backgroundColor: Color.HEADER_COLOUR },
  headerStyle: {backgroundColor: Color.HEADER_COLOUR, ...CommonStyle.shadow},
  ...navOptions,
});

export const articleNavigationOptions = (
  {navigation, screenProps},
  resetArticleState,
  editArticle,
  handleSubmit,
) => ({
  title: 'Submit Article',
  headerStyle: {backgroundColor: screenProps.sideMenuColor},
  headerRight: (
    <React.Fragment>
      <TouchableOpacity
        activeOpacity={0.7}
        style={Styles.menuContainer}
        onPress={() =>
          navigation.navigate('ViewMyArticle', {resetArticleState, editArticle})
        }>
        <Entypo
          name="eye"
          onPress={() => {
            handleSubmit();
          }}
        />
        <FontAwesome name="check" size={25} color="#fff" />
      </TouchableOpacity>
    </React.Fragment>
  ),
  ...navOptions,
});
export const quickPostNavigationOptions = (navigation) => ({
  title: 'Quick post',
  headerLeft: (
    <HeaderBackButton
      tintColor={Color.HEADER_LEFT_BACK_BUTTON}
      onPress={() => navigation.navigation.goBack()}
    />
  ),
  headerTitleStyle: {
    textAlign: 'center',
    flexGrow: 1,
    alignSelf: 'center',
    color: '#fff',
    paddingRight: Platform.OS === 'ios' ? 20 : 45,
  },
});
export const activityQuestionNavigationOptions = (
  handleBackButtonNavigation,
) => ({
  title: 'Activity Question',
  headerLeft: (
    <HeaderBackButton
      tintColor={Color.HEADER_LEFT_BACK_BUTTON}
      onPress={() => handleBackButtonNavigation()}
    />
  ),
  headerTitleStyle: {
    textAlign: 'center',
    flexGrow: 1,
    alignSelf: 'center',
    color: '#fff',
    paddingRight: Platform.OS === 'ios' ? 20 : 45,
  },
  gesturesEnabled: false,
});
export const chooseAsMentorOptions = (
  handleBackButtonNavigation,
  dispatch,
) => ({
  title: 'Choose as mentor',
  headerLeft: (
    <HeaderBackButton
      tintColor={Color.HEADER_LEFT_BACK_BUTTON}
      onPress={() => handleBackButtonNavigation()}
    />
  ),
  headerTitleStyle: {
    textAlign: 'center',
    flexGrow: 1,
    alignSelf: 'center',
    color: '#fff',
    paddingRight: Platform.OS === 'ios' ? 20 : 45,
  },
  gesturesEnabled: false,
});
export const chooseUrMentorOptions = ({navigation}) => ({
  title: 'Choose your mentor',
  headerLeft: (
    <HeaderBackButton
      tintColor={Color.HEADER_LEFT_BACK_BUTTON}
      onPress={() => navigation.navigate('LandingPage')}
    />
  ),
  headerTitleStyle: {
    textAlign: 'center',
    flexGrow: 1,
    alignSelf: 'center',
    color: '#fff',
    paddingRight: Platform.OS === 'ios' ? 20 : 45,
  },
  gesturesEnabled: false,
});

export const reportNavigationOptions = (
  navigation,
  handleSubmit,
  title,
  handleBackButtonNavigation,
) => ({
  title: title || 'Report Message',
  headerLeft: (
    <HeaderBackButton
      tintColor={Color.HEADER_LEFT_BACK_BUTTON}
      onPress={() =>
        handleMyAccountNavigation(navigation, title, handleBackButtonNavigation)
      }
    />
  ),
  headerRight: (
    <React.Fragment>
      <TouchableOpacity
        activeOpacity={0.7}
        style={Styles.menuContainer}
        onPress={() => {
          handleSubmit();
        }}>
        <FontAwesome name="check" size={25} color="#fff" />
      </TouchableOpacity>
    </React.Fragment>
  ),
  ...navOptions,
});
const handleMyAccountNavigation = (
  navigation,
  title,
  handleBackButtonNavigation,
) => {
  if (title) {
    handleBackButtonNavigation();
  } else {
    navigation.goBack();
  }
};

export const profileNavigationOptions = (
  {navigation, screenProps},
  title,
  handleSubmit,
) => ({
  title,
  headerStyle: {
    backgroundColor: screenProps.sideMenuColor,
    ...CommonStyle.shadow,
  },
  headerLeft: (
    <React.Fragment>
      <TouchableOpacity
        accessibilityLabel={
          Constant.ACCESSIBILITY.HAMBURGER_MENU.accessibilityLabel
        }
        accessibilityRole={
          Constant.ACCESSIBILITY.HAMBURGER_MENU.accessibilityRole
        }
        activeOpacity={0.7}
        style={Styles.menuContainer}
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}>
        <Image source={Icon.MENU} style={Styles.menuStyle} />
      </TouchableOpacity>
    </React.Fragment>
  ),
  headerRight: (
    <React.Fragment>
      <TouchableOpacity
        accessibilityLabel="submit"
        accessibilityRole="button"
        disabled={!handleSubmit}
        activeOpacity={0.7}
        style={!handleSubmit ? {width: 50} : Styles.menuContainer}
        onPress={() => {
          handleSubmit();
        }}>
        {!handleSubmit ? null : (
          <FontAwesome name="check" size={25} color="#fff" />
        )}
      </TouchableOpacity>
    </React.Fragment>
  ),
  ...navOptions,
});

export const communitiesNavigationOptions = (
  {navigation, screenProps},
  title,
  addTopic,
  isAdmin,
  onTopic,
) => ({
  title,
  headerStyle: {
    backgroundColor: screenProps.sideMenuColor,
    ...CommonStyle.shadow,
  },
  headerLeft: (
    <React.Fragment>
      <TouchableOpacity
        activeOpacity={0.7}
        style={Styles.menuContainer}
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        {...testID('Hamburger Icon', 'Open side menu')}>
        <Image source={Icon.MENU} style={Styles.menuStyle} />
      </TouchableOpacity>
    </React.Fragment>
  ),
  headerRight:
    isAdmin && onTopic ? (
      <React.Fragment>
        <TouchableOpacity
          {...testID('Add topic button', 'Navigate to add topic')}
          activeOpacity={0.7}
          style={{
            borderColor: '#fff',
            alignSelf: 'center',
            marginRight: 15,
          }}
          onPress={() => {
            addTopic('topics');
          }}>
          <AntDesign name="pluscircle" size={25} color="#fff" />
        </TouchableOpacity>
      </React.Fragment>
    ) : (
      <View
        style={{
          borderColor: '#fff',
          alignSelf: 'center',
        }}
      />
    ),
  headerTitleStyle: {
    textAlign: 'center',
    flexGrow: 1,
    alignSelf: 'center',
    color: '#fff',
  },
});
const Mentoring = createStackNavigator({
  MentoringScreen: {
    screen: MentoringScreen,
    navigationOptions: ({navigation, screenProps}) =>
      navigationOptions({navigation, screenProps}, 'Mentoring Screen'),
  },
});

const Assignment = createStackNavigator({
  AssignmentScreen: {
    screen: AssignmentScreen,
    // navigationOptions: ({ navigation, screenProps }) => navigationOptions({ navigation, screenProps }, 'Assignment')
  },
});

const Activities = createStackNavigator({
  ActivitiesScreen: {
    screen: ActivitiesScreen,
    navigationOptions: ({navigation, screenProps}) =>
      navigationOptions({navigation, screenProps}, 'Activities'),
  },
});

const LandingPage = createStackNavigator({
  LandingScreen: {
    screen: LandingScreen,
    navigationOptions: ({navigation, screenProps}) =>
      navigationOptions({navigation, screenProps}, 'Landing Page'),
  },
});

const Message = createStackNavigator({
  MessageScreen: {
    screen: MessageScreen,
    // navigationOptions: ({ navigation, screenProps }) => navigationOptions({ navigation, screenProps }, '')
  },
});

const Profile = createStackNavigator({
  ProfileScreen: {
    screen: ProfileScreen,
  },
});
const achievement = createStackNavigator({
  MentorProfileScreen: {
    screen: AchievementScreen,
    // navigationOptions: ({ navigation, screenProps }) => navigationOptions({ navigation, screenProps }, 'My Achievements')
  },
});
const mentorProfile = createStackNavigator({
  MentorProfileScreen: {
    screen: MentorProfileScreen,
    navigationOptions: ({navigation, screenProps}) =>
      navigationOptions({navigation, screenProps}, 'My Mentor'),
  },
});
const ProjectMaterial = createStackNavigator({
  ProfileScreen: {
    screen: ProjectResourcesScreen,
  },
});

const Communities = createStackNavigator({
  CommunitiesScreen: {
    screen: CommunitiesScreen,
    // navigationOptions: ({ navigation, screenProps }) => navigationOptions({ navigation, screenProps }, 'Communities')
  },
});

const DrawerNavigator = createDrawerNavigator(
  {
    Mentoring,
    mentorProfile,
    achievement,
    Assignment,
    ProjectMaterial,
    Communities,
    Activities,
    LandingPage,
    Message,
    Profile,
  },
  {
    initialRouteName: 'LandingPage',
    drawerWidth: 270,
    contentComponent: SideMenu,
    drawerPosition: 'left',
    drawerBackgroundColor: Color.LOGO,
    drawerLockMode: 'locked-closed',
    overlayColor: Color.DRAWER_OVERLAY,
    contentOptions: {
      inactiveTintColor: Color.LOGO,
      activeTintColor: Color.LOGO,
    },
    navigationOptions: {
      header: null,
    },
  },
);

/**
 * Root stack for all the screens.
 */
const AppNavigator = createStackNavigator(
  {
    SplashScreen,
    WelcomeScreen,
    AuthLoadingScreen,
    MentorProfileScreen,
    LoginScreen,
    SignUpScreen,
    DrawerNavigator,
    ForgotPasswordScreen,
    ProjectCodeScreen,
    PolicyScreen,
    MenteeTypeform,
    ImageModal,
    VideoModal,
    ArticleList,
    MentorQuestionScreen,
    MenteeQuestionScreen,
    MentorDetailsScreen,
    CategoryScreen,
    BrightKnowledgeScreen,
    ResetPasswordScreen,
    AskTheGuruScreen,
    AssignmentScreen,
    ExpertDetailsScreen,
    ProfileScreen,
    CommunitiesScreen,
    SelectedTopicScreen,
    AddTopicScreen,
    ThreadPost,
    QuickPost,
    SubmitArticle,
    ViewMyArticle,
    ActivitiesQuestion,
    ActivitiesMentorQuestion,
    achievement,
    ProjectListScreen: {
      screen: TabNavigator,
    },
    ReportMessageScreen: {
      screen: ReportMessageScreen,
    },
    PasswordValidationCodeScreen,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: ({screenProps}, title) => ({
      title,
      headerBackTitle: null,
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: screenProps.sideMenuColor,
      },
      headerTitleStyle: {
        textAlign: 'center',
        flexGrow: 1,
        alignSelf: 'center',
        color: '#fff',
        paddingRight: Platform.OS === 'ios' ? 0 : 50,
        paddingLeft: Platform.OS === 'ios' ? 10 : 0,
      },
    }),
    navigationOptions: {
      header: null,
    },
  },
);

const middlewareNavigator = createReactNavigationReduxMiddleware(
  'root',
  (state) => state.nav,
);
const RootNavigator = reduxifyNavigator(AppNavigator, 'root');
const mapStateToProps = (state) => ({
  state: state.nav,
});
const Root = connect(mapStateToProps)(RootNavigator);
export {AppNavigator, Root, middlewareNavigator};
