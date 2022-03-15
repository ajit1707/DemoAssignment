export const USER_DATA = 'USER_DATA';
export const USER_FLAG = 'USER_FLAG';

export const userSignInInfo = (userInfo) => (dispatch) => {
  dispatch({
    type: USER_DATA,
    userData: userInfo,
  });
};
export const userSign = () => (dispatch) => {
  dispatch({
    type: USER_FLAG,
  });
};
export default function userSignInInfoReducer(
  state = {
    userData: {},
  },
  action,
) {
  switch (action.type) {
    case USER_DATA: {
      return {
        ...state,
        userData: action.userData,
      };
    }
    case USER_FLAG: {
      return {
        ...state,
        userData: {
          ...state.userData,
          back: false,
        },
      };
    }
    default: {
      return state;
    }
  }
}
