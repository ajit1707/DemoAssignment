/**
 * Entry point for the reducers that will be used in the component.
 */
import {combineReducers} from 'redux';
import {AppNavigator} from './navigators/Root';
import authorization from './modules/authorization';
import checkNetwork from './modules/checkNetwork';
import signUp from './modules/signUp';
import signIn from './modules/signIn';
import forgotPassword from './modules/forgotPassword';
import projectCode from './modules/projectCode';
import passwordValidationCode from './modules/passwordValidationCode';
import errorHandler from './modules/errorHandler';
import getProjects, {SWITCH_PROJECT} from './modules/getProjects';
import logOut, {LOGOUT_SUCCESS, RESET_REDUCER} from './modules/logOut';
import channelsUser from './modules/channelsUser';
import getchannels from './modules/getChannels';
import getUserDetail from './modules/getUserDetail';
import channelMessage from './modules/channelMessage';
import uploadAttachments from './modules/uploadAttachments';
import resetPassword from './modules/resetPassword';
import deepLinkHandler from './modules/deepLinkHandler';
import checkResetPasswordLink from './modules/checkResetPasswordLink';
import socketNotification from './modules/socketNotification';
import {brightKnowledgeReducer} from './modules/brightKnowledgeReducer';
import {
  displayChannelItemsReducer,
  selectedChannelItemIndexReducer,
} from './modules/displayChannelItems';
import getProjectMaterial from './modules/getProjectMaterial';
import brightKnowledgeCategoryReducer from './modules/brightKnowledgeCategoryReducer';
import {pushNotificationReducer} from './modules/pushNotification';
import {
  askGraduateCardReducer,
  getTrendingPostReducer,
  getEventStoryDetailReducer,
} from './modules/landingPage';
import algoliaSearch from './modules/algoliaSearch';
import getLandingPageDetailsReducer from './modules/getLandingPageDetails';
import getDataForSubmitArticleReducer from './modules/getDataForSubmitArticle';
import getSelectedProjectReducer from './modules/getSelectedProject';
import getCommunityScreenReducer from './modules/communityScreen';
import profile from './modules/profile';
import postOfflineMessage from './modules/postOfflineMessages';
import offlineMessageToSend from './modules/offlineMessagesToSend';
import appUpdate from './modules/appUpdate';
import checkProjectToken from './modules/checkProjectToken';
import menteeActivities from './modules/activitiesMentee';
import mentorActivities from './modules/activitiesMentor';
import getAssignmentDataReducer from './modules/assignmentReducer';
import uploadAssignmentFileReducer from './modules/uploadAssignmentFile';
import userSignInInfoReducer from './modules/userSignIn';
import typeformMentorDataReducer from './modules/typeformMentor';
import typeformMenteeDataReducer from './modules/typeformMentee';
import menteeMentorReducer from './modules/chosseAsMentor';
import achievementReducer from './modules/achievement';
import preserveMessageText from './modules/preserveMessageText';
/**
 *  Simply return the original `state` if `nextState` is null or undefined.
 * @param state
 * @param action
 * @returns {*}
 */
function nav(state, action) {
  const newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state;
}

/**
 * Method contains combineReducer for combining reducers used in the components.
 * @type {Reducer<S>}
 */
const rootReducer = combineReducers({
    nav,
    authorization,
    checkNetwork,
    signIn,
    signUp,
    errorHandler,
    forgotPassword,
    projectCode,
    passwordValidationCode,
    getProjects,
    logOut,
    channelsUser,
    getUserDetail,
    channelMessage,
    uploadAttachments,
    getchannels,
    resetPassword,
    deepLinkHandler,
    checkResetPasswordLink,
    socketNotification,
    displayChannelItemsReducer,
    brightKnowledgeReducer,
    selectedChannelItemIndexReducer,
    brightKnowledgeCategoryReducer,
    pushNotificationReducer,
    askGraduateCardReducer,
    getTrendingPostReducer,
    algoliaSearch,
    getLandingPageDetailsReducer,
    getDataForSubmitArticleReducer,
    getEventStoryDetailReducer,
    getSelectedProjectReducer,
    profile,
    getProjectMaterial,
    postOfflineMessage,
    offlineMessageToSend,
    appUpdate,
    getCommunityScreenReducer,
    checkProjectToken,
    getAssignmentDataReducer,
    uploadAssignmentFileReducer,
    menteeActivities,
    mentorActivities,
    userSignInInfoReducer,
    typeformMentorDataReducer,
    typeformMenteeDataReducer,
    menteeMentorReducer,
    achievementReducer,
    preserveMessageText
});

/* eslint-disable no-param-reassign */
const AppReducer = (state, action) => {
  if (action.type === LOGOUT_SUCCESS || action.type === SWITCH_PROJECT) {
    state = undefined;
  }
  return rootReducer(state, action);
};

export default AppReducer;
