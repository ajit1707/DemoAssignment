import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Platform,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux';
import {Container, TextArea} from '../../components';
import {fontMaker, iPhoneXHelper} from '../../utility/helper';
import Color from '../../utility/colorConstant';
import {
  typeformMentorData,
  selectAnswers,
  submittypeformData,
} from '../../modules/typeformMentor';
import {get} from 'lodash';
import Entypo from 'react-native-vector-icons/Entypo';
import CheckBoxMcq from '../landingPageScreen/checkBoxMcq';
import {validate} from '../../utility/validator';
import {errorHandler} from '../../modules/errorHandler';
import DropdownLanding from '../landingPageScreen/DropdownLanding';
import Toast from 'react-native-simple-toast';
import {updateProfileDetail} from '../../modules/profile';

import {mentorProfile} from '../../modules/typeformMentee';
import ProfileForm from '../profileScreen/profileForm';
import {getUserDetails} from '../../modules/getUserDetail';
import DropDownPicker from 'react-native-dropdown-picker';
import {Picker} from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const imageHeight = 65;
const imageWidth = 65;
const imageBorderRadius = 35;
const borderRadius = 10;
const buttonBorderRadius = 5;

class MentorQuestionScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Mentor Typeform',
  });
  constructor(props) {
    super(props);
    const mentorProfileData = props.typeformMentorPayload?.data.attributes;
    this.state = {
      modalVisible: false,
      check: false,
      defaultValue:
        mentorProfileData.maximum_matches >=
        mentorProfileData.minimum_mentee_matches
          ? mentorProfileData.maximum_matches
          : mentorProfileData.minimum_mentee_matches,
      answer: {},
      ans: [],
      field: {},
      label: '',
      textQuestionID: [],
      multipleQuestionId: [],
      afterSubmissionAnswer: '',
      allId: [],
      booleanArray: [],
      submitForReview: false,
      refreshing: false,
      maxmimumMatches: [],
      bio: '',
      bioPayload: '',
      country:
        mentorProfileData.maximum_matches >=
        mentorProfileData.minimum_mentee_matches
          ? mentorProfileData.maximum_matches
          : mentorProfileData.minimum_mentee_matches,
      isVisibleA: false,
    };
  }
  componentDidMount() {
    const {
      dispatch,
      getFormMentorPayload,
      typeformMentorPayload,
      profileDetailPayload,
      userDetailPayload,
    } = this.props;
    const lengthField = getFormMentorPayload.fields.length;
    const data = getFormMentorPayload.fields;
    const ids = this.state.textQuestionID;
    const multipleId = this.state.multipleQuestionId;
    const allid = this.state.allId;
    for (let i = 0; i < lengthField; i += 1) {
      if (data[i].validations.required === true) {
        if (data[i].type === 'short_text' || data[i].type === 'long_text') {
          ids[i] = data[i].id;
        } else {
          multipleId[i] = data[i].id;
        }
        allid[i] = data[i].id;
      }
    }
    this.setState({
      textQuestionID: ids,
      multipleQuestionId: multipleId,
      allId: allid,
    });
    if (
      userDetailPayload.data[0].attributes.typeform_link !==
      typeformMentorPayload.data.attributes.typeform_id
    ) {
      this.setState({
        answer: {},
        ans: [],
        defaultValue: typeformMentorPayload.data.attributes.maximum_matches,
        bio: profileDetailPayload.data.attributes.biography,
      });
    } else if (
      typeformMentorPayload.hasOwnProperty('data') &&
      Object.keys(typeformMentorPayload.data.attributes.data).length > 0
    ) {
      this.setState({
        answer: typeformMentorPayload.data.attributes.data,
        ans: typeformMentorPayload.data.attributes.answers,
        defaultValue: typeformMentorPayload.data.attributes.maximum_matches,
        bio: profileDetailPayload.data.attributes.biography,
      });
    } else if (
      Object.keys(typeformMentorPayload.data.attributes.data).length === 0
    ) {
      this.setState({
        defaultValue:
          typeformMentorPayload.data.attributes.minimum_mentee_matches,
      });
    }
    if (
      profileDetailPayload &&
      profileDetailPayload.data &&
      profileDetailPayload.data.attributes &&
      profileDetailPayload.data.attributes.biography
    ) {
      this.setState({
        bio: profileDetailPayload.data.attributes.biography,
      });
    }
  }
  onRowItemSelect = (
    id,
    questionId,
    multipleSelection,
    length,
    ref,
    index,
    type,
    options,
    mainIndex,
    text,
    check,
  ) => {
    const {dispatch} = this.props;
    const {answer, ans} = this.state;
    let arr = new Array(length);
    let choice, choices;
    if (multipleSelection && !!answer[questionId]) {
      arr = answer[questionId];
      arr.splice(index, 1, !check);
      choices = ans[mainIndex].choices;
      if (!check) {
        choices.labels.push(text);
      } else {
        const ind = choices.labels.findIndex((item) => item === text);
        if (ind >= 0) {
          choices.labels.splice(ind, 1);
        }
      }
    } else {
      for (let i = 0; i < length; i += 1) {
        arr[i] = false;
      }
      arr.splice(index, 1, !check);
      choice = {
        label: !check ? text : '',
      };
      if (multipleSelection) {
        choices = {
          labels: [text],
        };
      }
    }
    dispatch(selectAnswers(id, questionId, multipleSelection));
    const newMcqAnswer = answer;
    newMcqAnswer[questionId] = arr;
    this.setState({
      answer: newMcqAnswer,
    });
    const field = {
      id: questionId,
      type,
      ref,
    };
    if (multipleSelection === true) {
      const data = {
        field,
        type: 'choices',
        options,
        choices,
      };
      const payload = this.state.ans;
      payload[mainIndex] = data;
      this.setState({
        ans: payload,
      });
    } else {
      const data = {
        field,
        type: 'choice',
        options,
        choice,
      };
      const payload = this.state.ans;
      payload[mainIndex] = data;
      this.setState({
        ans: payload,
      });
    }
  };
  onTextInputSelect = (answer, id, ref, type, mainIndex) => {
    const newAnswer = this.state.answer;
    newAnswer[id] = answer;
    this.setState({
      answer: newAnswer,
    });
    const field = {
      id,
      type,
      ref,
    };
    const data = {
      field,
      type: 'text',
      text: answer,
    };
    const payload = this.state.ans;
    payload[mainIndex] = data;
    this.setState({
      ans: payload,
    });
  };
  handleTextChange = (text, userId) => {
    this.setState({
      bio: text,
    });
    const id = userId;
    const data = {
      id,
      type: 'users',
      attributes: {
        biography: text,
      },
    };
    const bioData = {data};
    this.setState({
      bioPayload: bioData,
    });
  };
  handleSubmit = async () => {
    const {
      userDetailPayload,
      getFormMentorPayload,
      typeformMentorPayload,
      dispatch,
      navigation: {navigate, state},
      screenProps: {emitter},
    } = this.props;
    const {
      answer,
      defaultValue,
      ans,
      textQuestionID,
      multipleQuestionId,
      allId,
      submitForReview,
      bioPayload,
      bio,
    } = this.state;
    const dataId = typeformMentorPayload.data.id;
    const project_user_id = userDetailPayload.data[0].id;
    const project_id = String(userDetailPayload.data[0].attributes.project_id);
    let typeform_id = '';
    if (
      userDetailPayload.data[0].attributes.typeform_link !==
      typeformMentorPayload.data.attributes.typeform_id
    ) {
      typeform_id = userDetailPayload.data[0].attributes.typeform_link;
    } else {
      typeform_id = typeformMentorPayload.data.attributes.typeform_id;
    }
    const data = answer;
    const answers = ans;
    const userData = bioPayload;
    let validateError;
    let valueOfvalidateError = true;
    let validateErrorBio;
    const newvalue = allId.every((id) => {
      const value = data[id];
      if (Array.isArray(value)) {
        return value.some((item) => item === true);
      }
      validateError = validate('textRequired', value, 'Please enter the text');
      if (validateError) {
        return false;
      }
      return true;
    });
    validateErrorBio = validate('textRequired', bio, 'Please enter the text');
    if (validateErrorBio) {
      valueOfvalidateError = false;
    }
    if (!newvalue || !valueOfvalidateError) {
      dispatch(errorHandler('Please select at least one option'));
    } else {
      const payload = {
        data: {
          type: 'mentor_profiles',
          id: dataId,
          attributes: {
            project_user_id,
            project_id,
            typeform_id,
            submit_for_review: true,
            data,
            answers,
            maximum_matches: defaultValue,
          },
        },
      };
      dispatch(submittypeformData(payload))
        .then(() => {
          dispatch(updateProfileDetail(userData));
          if (
            typeformMentorPayload.data.attributes.submit_for_review === true
          ) {
            Toast.showWithGravity(
              'Mentor matching profile submitted for review',
              Toast.LONG,
              Toast.BOTTOM,
            );
          }
          if (state.params.channelData === false) {
            emitter.emit('updateLandingPage');
            emitter.emit('setSideMenuItemIndex', 0);
            navigate('LandingPage');
          }
        })
        .catch(() => {
          Toast.showWithGravity(
            'Unable to update mentor matching profile',
            Toast.SHORT,
            Toast.BOTTOM,
          );
        });
    }
  };
  handleSubmitForUpdate = async () => {
    const {
      userDetailPayload,
      getFormMentorPayload,
      typeformMentorPayload,
      dispatch,
      navigation: {navigate},
      screenProps: {emitter},
    } = this.props;
    const {
      answer,
      defaultValue,
      ans,
      textQuestionID,
      multipleQuestionId,
      allId,
      submitForReview,
      bioPayload,
      bio,
    } = this.state;
    let isSubmittedForReview;
    if (
      typeformMentorPayload.hasOwnProperty('data') &&
      Object.keys(typeformMentorPayload.data.attributes.data).length > 0
    ) {
      isSubmittedForReview =
        typeformMentorPayload.data.attributes.submit_for_review;
    }
    const dataId = typeformMentorPayload.data.id;
    const project_user_id = userDetailPayload.data[0].id;
    const project_id = String(userDetailPayload.data[0].attributes.project_id);
    let typeform_id = '';
    if (
      userDetailPayload.data[0].attributes.typeform_link !==
      typeformMentorPayload.data.attributes.typeform_id
    ) {
      typeform_id = userDetailPayload.data[0].attributes.typeform_link;
    } else {
      typeform_id = typeformMentorPayload.data.attributes.typeform_id;
    }
    const data = answer;
    const answers = ans;
    let validateError;
    let valueOfvalidateError = true;
    let validateErrorBio;
    const userData = bioPayload;
    const newvalue = allId.every((id) => {
      const value = data[id];
      if (Array.isArray(value)) {
        return value.some((item) => item === true);
      }
      validateError = validate('textRequired', value, 'Please enter the text');
      if (validateError) {
        return false;
      }
      return true;
    });
    validateErrorBio = validate('textRequired', bio, 'Please enter the text');
    if (validateErrorBio) {
      valueOfvalidateError = false;
    }
    if (!newvalue || !valueOfvalidateError) {
      dispatch(errorHandler('Please select at least one option'));
    } else {
      const payload = {
        data: {
          type: 'mentor_profiles',
          id: dataId,
          attributes: {
            project_user_id,
            project_id,
            typeform_id,
            submit_for_review: isSubmittedForReview,
            data,
            answers,
            maximum_matches: defaultValue,
          },
        },
      };
      dispatch(submittypeformData(payload))
        .then(() => {
          dispatch(updateProfileDetail(userData));
          if (
            typeformMentorPayload.data.attributes.submit_for_review === true
          ) {
            Toast.showWithGravity(
              'Mentor matching profile submitted for review',
              Toast.LONG,
              Toast.BOTTOM,
            );
          } else {
            Toast.showWithGravity(
              'Mentor matching profile updated successfully',
              Toast.LONG,
              Toast.BOTTOM,
            );
          }
        })
        .catch(() => {
          Toast.showWithGravity(
            'Unable to update mentor matching profile',
            Toast.SHORT,
            Toast.BOTTOM,
          );
        });
    }
  };
  onRefresh = () => {
    const {dispatch, profileDetailPayload} = this.props;
    this.setState({refreshing: true}, () => {
      dispatch(getUserDetails()).then((userData) => {
        dispatch(typeformMentorData())
          .then((response) => {
            this.setState({refreshing: false}, () => {
              if (
                response.data.data.attributes.typeform_id !==
                userData.data[0].attributes.typeform_link
              ) {
                this.setState({
                  answer: {},
                  ans: [],
                  defaultValue: response.data.data.attributes.maximum_matches,
                  bio: profileDetailPayload.data.attributes.biography,
                });
              } else if (
                response.data.hasOwnProperty('data') &&
                Object.keys(response.data.data.attributes.data).length > 0
              ) {
                this.setState({
                  answer: response.data.data.attributes.data,
                  ans: response.data.data.attributes.answers,
                  defaultValue: response.data.data.attributes.maximum_matches,
                  bio: profileDetailPayload.data.attributes.biography,
                });
              } else if (
                Object.keys(response.data.data.attributes.data).length === 0
              ) {
                this.setState({
                  defaultValue: response.data.data.attributes.maximum_matches,
                });
              }
              if (
                profileDetailPayload &&
                profileDetailPayload.data &&
                profileDetailPayload.data.attributes &&
                profileDetailPayload.data.attributes.biography
              ) {
                this.setState({
                  bio: profileDetailPayload.data.attributes.biography,
                });
              }
            });
          })
          .catch((err) => {
            dispatch(errorHandler(err));
            this.setState({refreshing: false});
          });
      });
    });
  };
  renderItem = (questionDetails, mainIndex) => (
    <View style={styles.viewContainer}>
      <View style={styles.card}>
        {questionDetails.type === 'short_text' && (
          <View style={styles.shortQuestion}>
            <View style={styles.questionTitleComponenet}>
              <Text style={styles.questionTitle}>{questionDetails.title}</Text>
              {questionDetails.validations.required === true && (
                <View style={styles.star}>
                  <Entypo name="star" size={14} color="#B30000" />
                </View>
              )}
            </View>
            <View>
              <TextInput
                style={styles.inputStyle}
                // accessibilityLabel={questionDetails.ref}
                value={this.state.answer[questionDetails.id] || ''}
                onChangeText={(text) =>
                  this.onTextInputSelect(
                    text,
                    questionDetails.id,
                    questionDetails.ref,
                    questionDetails.type,
                    mainIndex,
                  )
                }
                placeholder={questionDetails.ref}
                underlineColorAndroid="transparent"
                spellCheck
                autoCorrect
                autoCapitalize="none"
              />
            </View>
          </View>
        )}
        {questionDetails.type === 'long_text' && (
          <View style={styles.shortQuestion}>
            <View style={styles.questionTitleComponenet}>
              <Text style={styles.questionTitle}>{questionDetails.title}</Text>
              {questionDetails.validations.required === true && (
                <View style={styles.star}>
                  <Entypo name="star" size={14} color="#B30000" />
                </View>
              )}
            </View>
            <View>
              <TextArea
                value={this.state.answer[questionDetails.id] || ''}
                onChangeText={(text) =>
                  this.onTextInputSelect(
                    text,
                    questionDetails.id,
                    questionDetails.ref,
                    questionDetails.type,
                    mainIndex,
                  )
                }
                placeholder={questionDetails.ref}
                underlineColorAndroid="transparent"
                multiline
                spellCheck
                autoCorrect
                autoCapitalize="none"
                maxLength={2000}
                style={styles.textArea}
              />
            </View>
          </View>
        )}
        {questionDetails.type === 'multiple_choice' && (
          <View style={styles.shortQuestion}>
            <View style={styles.questionTitleComponenetMcq}>
              <Text style={styles.questionTitle}>{questionDetails.title}</Text>
              {/* {questionDetails.validations.required === true && */}
              {/* <View style={styles.starMcq}> */}
              {/*    <Entypo */}
              {/*        name="star" */}
              {/*        size={14} */}
              {/*        color="#B30000" */}
              {/*    /> */}
              {/* </View> */}
              {/* } */}
            </View>
            <View style={styles.questionTitleComponenetMcqselect}>
              {questionDetails.validations.required === true && (
                <View>
                  <Text style={styles.starQuestion}>
                    (Select at least one option)
                  </Text>
                </View>
              )}
            </View>
            <FlatList
              data={get(questionDetails, 'properties.choices', [])}
              renderItem={({item, index}) => (
                <CheckBoxMcq
                  text={item.label}
                  onRowItemSelect={this.onRowItemSelect}
                  check={!!item.isChecked}
                  questionDetails={questionDetails}
                  id={item.id}
                  index={index}
                  mainIndex={mainIndex}
                />
              )}
              keyExtractor={(mcq, index) => index.toString()}
              extraData={this.props.getFormMentorPayload.fields}
            />
          </View>
        )}
      </View>
    </View>
  );

  onSelect = (value) => {
    this.setState({
      defaultValue: value,
    });
  };
  changeVisibility(state) {
    this.setState({
      isVisible: false,
      ...state,
    });
  }
  changeVisibilityClose = () => {
    this.setState({
      isVisible: false,
    });
  };

  render() {
    const {
      typeformMentorPayload,
      getFormMentorPayload,
      fetching,
      navigation,
      profileDetailPayload,
      userDetailPayload,
    } = this.props;
    const userId = userDetailPayload.data[0].relationships.user.data.id;
    const {defaultValue, refreshing, country} = this.state;
    const matching = [];
    const numberOfmatches = [];
    for (
      let i = typeformMentorPayload.data.attributes.minimum_mentee_matches;
      i <= typeformMentorPayload.data.attributes.maximum_mentee_matches;
      i += 1
    ) {
      const value = String(i);
      matching.push(value);
      numberOfmatches.push({
        label: value,
        value: value,
      });
    }
    const defaultValueForDropDown = String(defaultValue);
    return (
      <Container style={styles.mainContainer}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={
            Platform.OS === 'ios' ? iPhoneXHelper(70, 50) : null
          }
          behavior={Platform.OS === 'ios' && 'padding'}
          keyboardShouldPersistTaps="never"
          alwaysBounceVertical={false}>
          {getFormMentorPayload && getFormMentorPayload.fields.length > 0 ? (
            <View
              activeOpacity={0.0}
              onPress={() => this.changeVisibilityClose()}>
              <FlatList
                data={getFormMentorPayload.fields}
                renderItem={({item, index}) => this.renderItem(item, index)}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => this.onRefresh()}
                  />
                }
                ListFooterComponent={
                  <KeyboardAvoidingView>
                    <View style={styles.startView}>
                      <View style={styles.shortQuestion}>
                        <View style={styles.questionTitleComponenet}>
                          <Text style={styles.questionTitle}>
                            Write a short bio about yourself.
                          </Text>
                          <View style={styles.star}>
                            <Entypo name="star" size={14} color="#B30000" />
                          </View>
                        </View>
                        <View>
                          <TextInput
                            style={styles.textArea}
                            value={this.state.bio || ''}
                            onChangeText={(text) =>
                              this.handleTextChange(text, userId)
                            }
                            placeholder="biography"
                            multiline
                            maxLength={2000}
                            underlineColorAndroid="transparent"
                            spellCheck
                            autoCorrect
                            autoCapitalize="none"
                          />
                        </View>
                      </View>
                      <View style={styles.matching}>
                        <Text style={styles.questionTitle}>
                          Maximum matches
                        </Text>
                        <View style={styles.star}>
                          <Entypo name="star" size={14} color="#B30000" />
                        </View>
                        <RNPickerSelect
                          onValueChange={(value) => {
                            if (value) {
                              this.onSelect(value);
                            }
                          }}
                          items={numberOfmatches}
                          style={styles}
                          placeholder={{
                            label: 'Select matches',
                            value: null,
                          }}
                          value={defaultValueForDropDown}
                        />
                        {/*<View style={styles.dropdown}>*/}
                        {/*  {numberOfmatches && numberOfmatches.length > 0 && (*/}
                        {/*    <DropDownPicker*/}
                        {/*      items={numberOfmatches}*/}
                        {/*      defaultValue={defaultValueForDropDown}*/}
                        {/*      containerStyle={{height: 30}}*/}
                        {/*      style={{backgroundColor: '#fff', fontSize: 22}}*/}
                        {/*      itemStyle={{*/}
                        {/*        backgroundColor: '#fff',*/}
                        {/*        borderBottomWidth: 1,*/}
                        {/*        borderColor: '#E5E5E5',*/}
                        {/*        justifyContent: 'flex-start',*/}
                        {/*      }}*/}
                        {/*      arrowStyle={{*/}
                        {/*        color: '#ccc',*/}
                        {/*      }}*/}
                        {/*      labelStyle={{*/}
                        {/*        fontSize: 16,*/}
                        {/*        textAlign: 'left',*/}
                        {/*        //color: '#ccc'*/}
                        {/*      }}*/}
                        {/*      onOpen={() =>*/}
                        {/*        this.changeVisibility({*/}
                        {/*          isVisibleA: true,*/}
                        {/*        })*/}
                        {/*      }*/}
                        {/*      onClose={() => this.changeVisibilityClose()}*/}
                        {/*      dropDownStyle={{*/}
                        {/*        backgroundColor: '#fff',*/}
                        {/*        height: 100,*/}
                        {/*      }}*/}
                        {/*      onChangeItem={(index, value) =>*/}
                        {/*        this.onSelect(index, value)*/}
                        {/*      }*/}
                        {/*    />*/}
                        {/*  )}*/}
                        {/*</View>*/}
                      </View>
                      {typeformMentorPayload.data.attributes
                        .submit_for_review === false && (
                        <View style={styles.buttonComponent}>
                          <View
                            style={styles.button}
                            accessible
                            accessibilityLabel="Submit For Review"
                            accessibilityRole="button">
                            <TouchableOpacity
                              onPress={this.handleSubmit}
                              accessible={false}>
                              <Text
                                style={styles.buttonText}
                                accessible={false}>
                                Submit For Review
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                      <View style={styles.buttonComponent}>
                        <View
                          style={styles.button}
                          accessible
                          accessibilityLabel="Update Profile Info "
                          accessibilityRole="button">
                          <TouchableOpacity
                            onPress={this.handleSubmitForUpdate}
                            accessible={false}>
                            <Text style={styles.buttonText} accessible={false}>
                              Update Profile Info{' '}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </KeyboardAvoidingView>
                }
              />
            </View>
          ) : null}
        </KeyboardAvoidingView>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    marginTop: -15,
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    width: 100,
    textAlign: 'right',
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    width: 100,
    textAlign: 'right',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  starMcq: {
    position: 'absolute',
    right: 0,
    bottom: 2,
    left: 15,
  },
  flexContainer: {
    flex: 1,
  },
  starQuestion: {
    color: '#B30000',
    ...fontMaker('italic'),
    fontSize: 16,
    flexDirection: 'row',
  },
  questionTitleComponenet: {
    marginTop: 10,
    flexDirection: 'row',
  },
  matching: {
    flexDirection: 'row',
    marginLeft: 15,
    flex: 1,
  },
  dropdown: {
    marginLeft: 20,
    flex: 1,
  },
  questionTitleComponenetMcq: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  questionTitleComponenetMcqselect: {
    marginTop: -2,
    justifyContent: 'flex-start',
  },
  shortQuestion: {
    marginHorizontal: '5%',
  },
  questionTitle: {
    fontSize: 18,
    marginTop: 5,
    marginRight: -5,
    color: '#444444',
    ...fontMaker('regular'),
  },
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    marginTop: '5.5%',
    height: '100%',
  },
  img: {
    width: '100%',
    height: deviceWidth * 0.5,
    resizeMode: 'cover',
  },
  textContainer: {
    marginLeft: '4%',
  },
  title: {
    color: '#666',
    ...fontMaker('bold'),
    fontSize: 18,
    marginVertical: '3%',
  },
  textTitle: {
    color: '#1f5b98',
    fontSize: 18,
    marginVertical: '3%',
  },
  wordstyle: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
    backgroundColor: '#e28834',
    marginLeft: deviceWidth * 0.37,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2%',
  },
  number: {
    color: '#fff',
    ...fontMaker('bold'),
    fontSize: 30,
  },
  startView: {
    backgroundColor: '#fff',
  },
  titleStart: {
    color: '#666',
    ...fontMaker('bold'),
    fontSize: 18,
    marginVertical: '3%',
    marginHorizontal: '8%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonComponent: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 2,
  },
  buttonText: {
    fontSize: 18,
    ...fontMaker('bold'),
    color: '#0078af',
  },
  press: {
    marginHorizontal: 6,
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 7,
  },
  enter: {
    ...fontMaker('bold'),
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 7,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 4,
    borderColor: '#0078af',
    borderWidth: 1,
    marginVertical: '3%',
  },
  pressEnter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  modalViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSubView: {
    height: deviceHeight * 0.7,
    width: deviceWidth * 0.9,
    borderRadius,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    width: deviceWidth * 0.9,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: Color.CHANNEL_SEPARATOR_COLOR,
    borderBottomWidth: 0.5,
  },
  crossButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  crossIcon: {
    height: 13,
    width: 13,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 17,
  },
  nameText: {
    color: '#444444',
    ...fontMaker('semibold'),
    fontSize: 17,
  },
  lastTimeText: {
    color: '#ccc',
    ...fontMaker('semibold'),
    fontSize: 14,
    paddingTop: 2,
  },
  headerText: {
    fontSize: 18,
    paddingLeft: 15,
    width: '70%',
    color: '#000',
    ...fontMaker('semibold'),
  },
  crossButton: {
    justifyContent: 'flex-end',
  },
  inputStyle: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 7,
    fontSize: 18,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  textArea: {
    maxHeight: 120,
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 18,
    height: 100,
    width: '100%',
    color: '#000',
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    paddingHorizontal: 7,
    marginVertical: 10,
  },
});
const mapStateToProps = (state) => ({
  fetching: state.typeformMentorDataReducer.fetching,
  typeformMentorPayload: state.typeformMentorDataReducer.typeformMentorPayload,
  getFormMentorPayload: state.typeformMentorDataReducer.getFormMentorPayload,
  userDetailPayload: state.getUserDetail.userDetailPayload,
  profileDetailPayload: state.profile.profileDetailPayload,
});

export default connect(mapStateToProps)(MentorQuestionScreen);
