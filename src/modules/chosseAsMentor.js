const DATA = 'DATA';
const MENTOR_DATA = 'MENTOR_DATA';
const SOCKET_CONNECT = 'SOCKET_CONNECT';
const DOWNLOAD_ICON = 'DOWNLOAD_ICON';
const ANIMATE = 'ANIMATE';
const ROUTENAME = 'ROUTENAME';

export const mentorData = (userInfo) => (dispatch) => {
  dispatch({
    type: DATA,
    chooseYourMentor: userInfo,
  });
};

export const chosseYourMentorData = (userInfo) => (dispatch) => {
  dispatch({
    type: MENTOR_DATA,
    chooseAsMentor: userInfo,
  });
};

export const connectionData = (connectData) => (dispatch) => {
  dispatch({
    type: SOCKET_CONNECT,
    connectionOfSocket: connectData,
  });
};

export const checkData = (checkValue) => (dispatch) => {
  dispatch({
    type: DOWNLOAD_ICON,
    downloadIcon: checkValue,
  });
};

export const checkanimate = (value) => (dispatch) => {
  dispatch({
    type: ANIMATE,
    animation: value,
  });
};
export const routeNameOfScreens = (screenName) => (dispatch) => {
  dispatch({
    type: ROUTENAME,
    screenName,
  });
};

export default function menteeMentorReducer(
  state = {
    chooseYourMentor: {},
    mentorData: {},
    connectionOfSocket: {},
    downloadIcon: {},
    animation: {},
    screenName: {},
  },
  action,
) {
  switch (action.type) {
    case DATA: {
      return {
        ...state,
        chooseYourMentor: action.chooseYourMentor,
      };
    }
    case MENTOR_DATA: {
      return {
        ...state,
        chooseAsMentor: action.chooseAsMentor,
      };
    }
    case SOCKET_CONNECT: {
      return {
        ...state,
        connectionOfSocket: action.connectionOfSocket,
      };
    }
    case DOWNLOAD_ICON: {
      return {
        ...state,
        downloadIcon: action.downloadIcon,
      };
    }
    case ANIMATE: {
      return {
        ...state,
        animation: action.animation,
      };
    }
    case ROUTENAME: {
      return {
        ...state,
        screenName: action.screenName,
      };
    }
    default: {
      return state;
    }
  }
}
