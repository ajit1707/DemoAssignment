import {
  ADD_SUCCESS_MESSAGE,
  CLEAR_SUCCESS_MESSAGE,
} from '../utility/actionTypes';

export function successHandler(success) {
  return (dispatch) => {
    if (success) {
      dispatch({
        type: ADD_SUCCESS_MESSAGE,
        success,
      });
    } else {
      dispatch({
        type: CLEAR_SUCCESS_MESSAGE,
        success: null,
      });
    }
  };
}
