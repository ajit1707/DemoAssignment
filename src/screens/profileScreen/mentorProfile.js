// import React, { Component } from 'react';
// import {
//     View,
//     FlatList,
//     Text,
//     StyleSheet,
//     RefreshControl,
//     ScrollView,
//     TouchableOpacity,
//     Platform,
//     Image, Dimensions, Animated, KeyboardAvoidingView, Modal, TextInput, Keyboard
// } from 'react-native';
// import { connect } from 'react-redux';
// import Style from './Styles';
// import {
//     AuthButton,
//     AuthTextInput,
//     Button,
//     Container,
//     Dropdown,
//     HtmlRenderer,
//     PaginationSpinner,
//     Video
// } from '../../components';
// import Icon from '../../utility/icons';
// import { detectHTMLTags, fontMaker } from '../../utility/helper';
// import Color from '../../utility/colorConstant';
// import { typeformMentorData, selectAnswers, submittypeformData, getFormMentorData } from '../../modules/typeformMentor';
// import Styles from '../../components/Styles';
// import CheckBox from '../../components/CheckBox';
// import { get } from 'lodash';
// import Constant from '../../utility/constant';
// import Entypo from 'react-native-vector-icons/Entypo';
// import ArticleSubModal from '../../components/ArticleSubModalComponent';
// import CheckBoxMcq from '../landingPageScreen/checkBoxMcq';
// import { selectTopicsForThread } from '../../modules/communityScreen';
// import { validate } from '../../utility/validator';
// import { errorHandler } from '../../modules/errorHandler';
// import DeviceInfo from 'react-native-device-info';
// import { userSignInInfo } from '../../modules/userSignIn';
// import { signIn } from '../../modules/signIn';
// import DropdownLanding from '../landingPageScreen/DropdownLanding';
// import Toast from 'react-native-simple-toast';
// import { getAssignmentData } from '../../modules/assignmentReducer';
// import { uploadAssignmentFile } from '../../modules/uploadAssignmentFile';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { logEventForAnalytics } from '../../utility/firebase-utils';
// import { setBugsnagMetaData } from '../../utility/bugsnag-utils';
// import { NavigationActions, StackActions } from '@react-navigation/native';
//
// const deviceWidth = Dimensions.get('window').width;
// const deviceHeight = Dimensions.get('window').height;
// const imageHeight = 65;
// const imageWidth = 65;
// const imageBorderRadius = 35;
// const borderRadius = 10;
// const buttonBorderRadius = 5;
// const DATA = [
//     {
//         img: Icon.MENTOR,
//         heading: 'TELL US ABOUT YOURSELF',
//         headingText: 'Please create a short profile about yourself. Tell us about your career, hobbies and interests.',
//         id: '1'
//     },
// ];
// class MentorProfileScreen extends Component {
//     static navigationOptions = ({ navigation }) => (
//         {
//             title: 'Mentor Typeform',
//         });
//     constructor(props) {
//         super(props);
//         this.state = {
//             modalVisible: false,
//             check: false,
//             defaultValue: 1,
//             answer: {},
//             ans: [],
//             field: {},
//             label: '',
//             textQuestionID: [],
//             multipleQuestionId: [],
//             afterSubmissionAnswer: '',
//             allId: [],
//             booleanArray: []
//         };
//     }
//     componentDidMount() {
//         const { dispatch, getFormMentorPayload, typeformMentorPayload } = this.props;
//         dispatch(typeformMentorData());
//         // const typeformId = typeformMentorPayload.data.attributes.typeform_id;
//         // dispatch(getFormMentorData(typeformId));
//         const lengthField = getFormMentorPayload.fields.length;
//         const data = getFormMentorPayload.fields;
//         const ids = this.state.textQuestionID;
//         const multipleId = this.state.multipleQuestionId;
//         const allid = this.state.allId;
//         for (let i = 0; i < lengthField; i += 1) {
//             if (data[i].validations.required === true) {
//                 if (data[i].type === 'short_text' || data[i].type === 'long_text') {
//                     ids[i] = data[i].id;
//                 } else {
//                     multipleId[i] = data[i].id;
//                 }
//                 allid[i] = data[i].id;
//             }
//         }
//         this.setState({
//             textQuestionID: ids,
//             multipleQuestionId: multipleId,
//             allId: allid
//         });
//     }
//     componentDidUpdate(prevProps) {
//         const {
//             typeformMentorPayload, navigation: { dispatch }
//         } = this.props;
//         if (prevProps.typeformMentorPayload !== typeformMentorPayload && typeformMentorPayload.hasOwnProperty('data') && typeformMentorPayload.data.attributes.submit_for_review === true) {
//             this.setState({
//                 answer: typeformMentorPayload.data.attributes.data,
//                 ans: typeformMentorPayload.data.attributes.answers,
//                 defaultValue: typeformMentorPayload.data.attributes.maximum_matches,
//             });
//         }
//     }
//     onRowItemSelect = (id, questionId, multipleSelection, length, ref, index, type, options, mainIndex, text, check) => {
//         const { dispatch, } = this.props;
//         const { answer, ans } = this.state;
//         let arr = new Array(length);
//         let choice,
//             choices;
//         if (multipleSelection && !!answer[questionId]) {
//             arr = answer[questionId];
//             arr.splice(index, 1, !check);
//             choices = ans[mainIndex].choices;
//             if (!check) {
//                 choices.labels.push(text);
//             } else {
//                 const ind = choices.labels.findIndex(item => item === text);
//                 if (ind >= 0) {
//                     choices.labels.splice(ind, 1);
//                 }
//             }
//         } else {
//             for (let i = 0; i < length; i += 1) {
//                 arr[i] = false;
//             }
//             arr.splice(index, 1, !check);
//             choice = {
//                 label: !check ? text : '',
//             };
//             if (multipleSelection) {
//                 choices = {
//                     labels: [text],
//                 };
//             }
//         }
//         dispatch(selectAnswers(id, questionId, multipleSelection));
//         const newMcqAnswer = answer;
//         newMcqAnswer[questionId] = arr;
//         this.setState({
//             answer: newMcqAnswer
//         });
//         const field = {
//             id: questionId,
//             type,
//             ref,
//         };
//         if (multipleSelection === true) {
//             const data = {
//                 field,
//                 type: 'choice',
//                 options,
//                 choices
//             };
//             const payload = this.state.ans;
//             payload[mainIndex] = data;
//             this.setState({
//                 ans: payload
//             });
//         } else {
//             const data = {
//                 field,
//                 type: 'choice',
//                 options,
//                 choice
//             };
//             const payload = this.state.ans;
//             payload[mainIndex] = data;
//             this.setState({
//                 ans: payload
//             });
//         }
//     };
//     onTextInputSelect = (answer, id, ref, type, mainIndex, validation) => {
//         console.log('mainindex', this.state.answer);
//         const newAnswer = this.state.answer;
//         newAnswer[id] = answer;
//         this.setState({
//             answer: newAnswer
//         });
//         const field = {
//             id,
//             type,
//             ref,
//         };
//         const data = {
//             field,
//             type: 'text',
//             text: answer
//         };
//         const payload = this.state.ans;
//         payload[mainIndex] = data;
//         this.setState({
//             ans: payload
//         });
//         // if (validation === true) {
//         //     const ids = this.state.questionID;
//         //     ids[mainIndex] = id;
//         //     this.setState({
//         //         questionID: ids
//         //     });
//         // }
//     };
//     // handleButtonDisability = () => {
//     //     const { answers } = this.state;
//     //     return !answers;
//     // };
//     handleSubmit = async () => {
//         const {
//             userDetailPayload, getFormMentorPayload, typeformMentorPayload, dispatch
//         } = this.props;
//         const {
//             answer, defaultValue, ans, textQuestionID, multipleQuestionId, allId
//         } = this.state;
//         const dataId = userDetailPayload.data[0].relationships.mentor_profiles.data[0].id;
//         const project_user_id = userDetailPayload.data[0].id;
//         const project_id = String(userDetailPayload.data[0].attributes.project_id);
//         const typeform_id = typeformMentorPayload.data.attributes.typeform_id;
//         const fields = getFormMentorPayload.fields;
//         const data = answer;
//         const answers = ans;
//         let matchId;
//         const l = textQuestionID.length;
//         const lm = multipleQuestionId.length;
//         const la = allId.length;
//         // console.log('allId', allId);
//         let validateError;
//         let validateErrorMcq,
//             lengthOfMcq;
//         let valueMcq;
//         const arr = this.state.booleanArray;
//         // for (let i = 0; i < l; i += 1) {
//         //     const idText = textQuestionID[i];
//         //     const value = data[idText];
//         //     validateError = validate('textRequired', value, 'Please enter the text');
//         // }
//         // for (let j = 0; j < lm; j += 1) {
//         //     const idvalue = multipleQuestionId[j];
//         //     const mcqvalue = data[idvalue];
//         //     // console.log('mcqvalue', mcqvalue);
//         //     // const value = mcqvalue.find(item => item === 'true');
//         // }
//         // for (let k = 0; k < la; k += 1) {
//         //     const id = allId[k];
//         //     const value = data[id];
//         //     if (Array.isArray(value)) {
//         //         validateErrorMcq = value.some(item => item === true);
//         //         console.log('validateErrorMcq', validateErrorMcq);
//         //         // if (validateErrorMcq === true) {
//         //         //     validateErrorMcq = true;
//         //         // } else {
//         //         //     validateErrorMcq = false;
//         //         // }
//         //     } else {
//         //         validateError = validate('textRequired', value, 'Please enter the text');
//         //     }
//         // }
//         const newvalue = allId.every((id) => {
//             const value = data[id];
//             if (Array.isArray(value)) {
//                 return value.some(item => item === true);
//             }else {
//                 validateError = validate('textRequired', value, 'Please enter the text');
//                 if (validateError) {
//                     return false;
//                 }
//                 return true;
//             }
//         });
//         console.log('newvalue', newvalue);
//         if (!newvalue) {
//             dispatch(errorHandler('Please select at least one option'));
//         } else {
//             const payload = {
//                 data: {
//                     type: 'mentor_profiles',
//                     id: dataId,
//                     attributes: {
//                         project_user_id,
//                         project_id,
//                         typeform_id,
//                         submit_for_review: true,
//                         data,
//                         answers,
//                         maximum_matches: defaultValue
//                     }
//                 }
//             };
//             dispatch(submittypeformData(payload))
//                 .then(() => {
//                     if (typeformMentorPayload.data.attributes.submit_for_review === true) {
//                         Toast.showWithGravity(' Mentor matching profile submitted for review', Toast.LONG, Toast.BOTTOM);
//                     } else {
//                         Toast.showWithGravity(' Mentor matching profile updated successfully', Toast.LONG, Toast.BOTTOM);
//                     }
//                 }).catch(() => {
//                 Toast.showWithGravity('Unable to update mentor matching profile', Toast.SHORT, Toast.BOTTOM);
//             });
//             console.log('payload', payload);
//         }
//     };
//     renderItem = (questionDetails, mainIndex) => (
//         <View style={styles.viewContainer}>
//             <View style={styles.card}>
//                 {questionDetails.type === 'short_text' &&
//                 <View style={styles.shortQuestion}>
//                     <View style={styles.questionTitleComponenet}>
//                         <Text style={styles.questionTitle}>{questionDetails.title}</Text>
//                         {questionDetails.validations.required === true &&
//                         <View style={styles.star}>
//                             <Entypo
//                                 name="star"
//                                 size={14}
//                                 color="#B30000"
//                             />
//                         </View>
//                         }
//
//                     </View>
//                     <View>
//                         <TextInput
//                             style={styles.inputStyle}
//                             value={this.state.answer[questionDetails.id] || ''}
//                             onChangeText={(text) => this.onTextInputSelect(text, questionDetails.id, questionDetails.ref, questionDetails.type, mainIndex, questionDetails.validations.required)}
//                             placeholder={questionDetails.ref}
//                             underlineColorAndroid="transparent"
//                             spellCheck
//                             autoCorrect
//                             autoCapitalize="none"
//                         />
//                     </View>
//                 </View>
//                 }
//                 {questionDetails.type === 'long_text' &&
//                 <View style={styles.shortQuestion}>
//                     <View style={styles.questionTitleComponenet}>
//                         <Text style={styles.questionTitle}>{questionDetails.title}</Text>
//                         {questionDetails.validations.required === true &&
//                         <View style={styles.star}>
//                             <Entypo
//                                 name="star"
//                                 size={14}
//                                 color="#B30000"
//                             />
//                         </View>
//                         }
//
//                     </View>
//                     <View>
//                         <TextInput
//                             style={styles.inputStyle}
//                             value={this.state.answer[questionDetails.id] || ''}
//                             onChangeText={(text) => this.onTextInputSelect(text, questionDetails.id, questionDetails.ref, questionDetails.type, mainIndex)}
//                             placeholder={questionDetails.ref}
//                             underlineColorAndroid="transparent"
//                             multiline
//                             spellCheck
//                             autoCorrect
//                             autoCapitalize="none"
//                         />
//                     </View>
//                 </View>
//                 }
//                 {questionDetails.type === 'multiple_choice' &&
//                 <View style={styles.shortQuestion}>
//                     <View style={styles.questionTitleComponenetMcq}>
//                         <Text style={styles.questionTitle}>{questionDetails.title}</Text>
//                         {questionDetails.validations.required === true &&
//                         <View style={styles.star}>
//                             <Entypo
//                                 name="star"
//                                 size={14}
//                                 color="#B30000"
//                             />
//                             {/* <Text style={styles.starQuestion}>(Select at least one option)</Text> */}
//                         </View>
//                         }
//                     </View>
//                     <FlatList
//                         data={get(questionDetails, 'properties.choices', [])}
//                         renderItem={({ item, index }) =>
//                             (
//                                 <CheckBoxMcq
//                                     text={item.label}
//                                     onRowItemSelect={this.onRowItemSelect}
//                                     check={!!item.isChecked}
//                                     questionDetails={questionDetails}
//                                     id={item.id}
//                                     index={index}
//                                     mainIndex={mainIndex}
//                                 />
//                             )
//                         }
//                         keyExtractor={(mcq, index) => index.toString()}
//                         extraData={this.props.getFormMentorPayload.fields}
//                     />
//                 </View>
//                 }
//             </View>
//         </View>);
//
//     onSelect = (index, value) => {
//         this.setState({
//             defaultValue: value
//         });
//     };
//     render() {
//         const {
//             typeformMentorPayload, getFormMentorPayload, fetching
//         } = this.props;
//         const { defaultValue } = this.state;
//         return (
//             <Container style={styles.mainContainer} fetching={fetching}>
//                 { getFormMentorPayload && getFormMentorPayload.fields.length > 0 ?
//                     <FlatList
//                         data={getFormMentorPayload.fields}
//                         renderItem={({ item, index }) =>
//                             (this.renderItem(item, index))
//                         }
//                         ListFooterComponent={
//                             <View style={styles.startView}>
//                                 <View style={styles.matching}>
//                                     <Text style={styles.questionTitle}>Maximum matches</Text>
//                                     <View style={styles.star}>
//                                         <Entypo
//                                             name="star"
//                                             size={14}
//                                             color="#B30000"
//                                         />
//                                     </View>
//                                     <View style={styles.dropdown}>
//                                         <DropdownLanding
//                                             data={['1', '2', '3', '4', '5', '6']}
//                                             onChangeHandler={(index, value) => this.onSelect(index, value)}
//                                             defaultValue={defaultValue}
//                                         />
//                                     </View>
//                                 </View>
//                                 { typeformMentorPayload.data.attributes.submit_for_review === false &&
//                                 <View style={styles.buttonComponent}>
//                                     <View style={styles.button}>
//                                         <TouchableOpacity
//                                             // disabled={this.handleButtonDisability()}
//                                             onPress={this.handleSubmit}
//                                         >
//                                             <Text style={styles.buttonText}>Submit For Review</Text>
//                                         </TouchableOpacity>
//                                     </View>
//                                 </View>
//                                 }
//                                 <View style={styles.buttonComponent}>
//                                     <View style={styles.button}>
//                                         <TouchableOpacity
//                                             // disabled={this.handleButtonDisability()}
//                                             onPress={this.handleSubmit}
//                                         >
//                                             <Text style={styles.buttonText}>Update Profile Info </Text>
//                                         </TouchableOpacity>
//                                     </View>
//                                 </View>
//                             </View>
//                         }
//                     />
//                     : null}
//             </Container>
//         );
//     }
// }
// const styles = StyleSheet.create({
//     mainContainer: {
//         flex: 1,
//         backgroundColor: '#E5E5E5'
//     },
//     starQuestion: {
//         color: '#B30000',
//         ...fontMaker('italic'),
//         fontSize: 18,
//         flexDirection: 'row'
//     },
//     star: {
//         // justifyContent: 'center',
//         // alignItems:'center'
//     },
//     questionTitleComponenet: {
//         marginTop: 10,
//         flexDirection: 'row'
//     },
//     matching: {
//         // marginTop: 10,
//         flexDirection: 'row',
//         marginLeft: 15
//     },
//     dropdown: {
//         marginLeft: 20
//     },
//     questionTitleComponenetMcq: {
//         marginTop: 10,
//         // marginHorizontal: '5%',
//         flexDirection: 'row',
//         justifyContent: 'flex-start',
//     },
//     shortQuestion: {
//         marginHorizontal: '5%',
//     },
//     questionTitle: {
//         fontSize: 18,
//         marginTop: 5,
//         color: '#444444',
//         ...fontMaker('regular'),
//         // backgroundColor: '#B30000',
//
//         // flexDirection: 'row'
//     },
//     viewContainer: {
//         // backgroundColor: '#E5E5E5',
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     card: {
//         backgroundColor: '#fff',
//         width: '100%',
//         marginTop: '5.5%',
//         height: '100%',
//         // marginBottom: '3%',
//         // borderBottomWidth: StyleSheet.hairlineWidth,
//         // borderColor: '#666',
//     },
//     img: {
//         width: '100%',
//         height: deviceWidth * 0.5,
//         resizeMode: 'cover',
//     },
//     textContainer: {
//         marginLeft: '4%',
//     },
//     title: {
//         color: '#666',
//         ...fontMaker('bold'),
//         fontSize: 18,
//         marginVertical: '3%'
//     },
//     textTitle: {
//         color: '#1f5b98',
//
//         fontSize: 18,
//         marginVertical: '3%'
//     },
//     wordstyle: {
//         height: imageHeight,
//         width: imageWidth,
//         borderRadius: imageBorderRadius,
//         backgroundColor: '#e28834',
//         marginLeft: deviceWidth * 0.37,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: '2%'
//     },
//     number: {
//         color: '#fff',
//         ...fontMaker('bold'),
//         fontSize: 30,
//     },
//     startView: {
//         // marginTop: '4%',
//         backgroundColor: '#fff',
//         // alignItems: 'center',
//         // justifyContent: 'center'
//     },
//     titleStart: {
//         color: '#666',
//         ...fontMaker('bold'),
//         fontSize: 18,
//         marginVertical: '3%',
//         marginHorizontal: '8%',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     buttonComponent: {
//         // width: '50%',
//         // height: '50%',
//         flexDirection: 'row',
//         // alignSelf: 'center',
//         justifyContent: 'center',
//         marginBottom: 2,
//         // backgroundColor: '#B30000'
//     },
//     buttonText: {
//         fontSize: 18,
//         ...fontMaker('bold'),
//         color: '#0078af'
//     },
//     press: {
//         marginHorizontal: 6,
//         fontSize: 15,
//         justifyContent: 'center',
//         alignItems: 'flex-end',
//         paddingBottom: 7,
//     },
//     enter: {
//         ...fontMaker('bold'),
//         fontSize: 15,
//         justifyContent: 'center',
//         alignItems: 'flex-end',
//         paddingBottom: 7,
//     },
//     button: {
//         // backgroundColor: '#e28834',
//         paddingVertical: 10,
//         paddingHorizontal: 25,
//         borderRadius: 4,
//         borderColor: '#0078af',
//         borderWidth: 1,
//         marginVertical: '3%',
//     },
//     pressEnter: {
//         flexDirection: 'row',
//         alignItems: 'flex-end',
//     },
//     modalViewContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)'
//     },
//     modalSubView: {
//         height: deviceHeight * 0.70,
//         width: deviceWidth * 0.90,
//         borderRadius,
//         backgroundColor: '#fff',
//     },
//     header: {
//         height: 60,
//         width: deviceWidth * 0.90,
//         borderTopLeftRadius: borderRadius,
//         borderTopRightRadius: borderRadius,
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         flexDirection: 'row',
//         borderBottomColor: Color.CHANNEL_SEPARATOR_COLOR,
//         borderBottomWidth: 0.5,
//     },
//     crossButtonContainer: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: 50
//     },
//     crossIcon: {
//         height: 13,
//         width: 13
//     },
//     itemContainer: {
//         flexDirection: 'row',
//         paddingVertical: 10,
//         alignItems: 'center',
//         marginHorizontal: 17
//     },
//     nameText: {
//         color: '#444444',
//         ...fontMaker('semibold'),
//         fontSize: 17,
//     },
//     lastTimeText: {
//         color: '#ccc',
//         ...fontMaker('semibold'),
//         fontSize: 14,
//         paddingTop: 2
//     },
//     headerText: {
//         fontSize: 18,
//         paddingLeft: 15,
//         width: '70%',
//         color: '#000',
//         ...fontMaker('semibold')
//     },
//     crossButton: {
//         justifyContent: 'flex-end',
//     },
//     inputStyle: {
//         width: '100%',
//         height: 45,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//         // color: '#000',
//         paddingHorizontal: 7,
//         fontSize: 18,
//         backgroundColor: '#fff',
//         marginVertical: 10
//     },
// });
// const mapStateToProps = state => ({
//     fetching: state.typeformMentorDataReducer.fetching,
//     typeformMentorPayload: state.typeformMentorDataReducer.typeformMentorPayload,
//     getFormMentorPayload: state.typeformMentorDataReducer.getFormMentorPayload,
//     userDetailPayload: state.getUserDetail.userDetailPayload,
// });
//
// export default connect(mapStateToProps)(MentorProfileScreen);
//
