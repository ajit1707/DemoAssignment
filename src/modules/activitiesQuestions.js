import AsyncStorage from '@react-native-async-storage/async-storage';
import {ATTACHED_ACTIVITIES, PROJECT_USER_ACTIVITIES} from '../utility/apis';
import {httpGet, httpPost} from '../utility/http';
import {errorHandler} from './errorHandler';
import Constant from '../utility/constant';

// export const getQuestionData = (pageNumber) =>
//     (dispatch) => new Promise(async (resolve, reject) => {
//         const projectId = await AsyncStorage.getItem(Constant.ASYNC_KEYS.PROJECT_ID, () => {});
//         if (projectId) {
//             dispatch({
//                 type: GET_MENTEE_ACTIVITIES_REQUEST
//             });
//             httpGet(`${ATTACHED_ACTIVITIES}?filter[activitable]=${projectId},project&filter[active_activities]&filter[assigned]&include=activity.categories&page[number]=${pageNumber}&page[size]=10`).then((response) => {
//                 dispatch({
//                     pageNumber,
//                     menteeActivityPayload: response.data,
//                     type: GET_MENTEE_ACTIVITIES_SUCCESS
//                 });
//                 resolve(response.data);
//             }).catch((error) => {
//                 dispatch({
//                     type: GET_MENTEE_ACTIVITIES_FAIL
//                 });
//                 reject(error);
//                 dispatch(errorHandler(error.data.errors[0].title));
//             });
//         }
//     });
