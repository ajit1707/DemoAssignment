import {
  Text,
  View,
  StyleSheet,
  Switch,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {HeaderBackButton} from 'react-navigation';
import React, {Component} from 'react';
import Toast from 'react-native-simple-toast';
import {Button, Form} from '../../components';
import {setSideMenuItems} from '../../modules/getProjects';
import {
  submitThread,
  submitTopic,
  selectTopicForAddThread,
  getTopics,
  getAllTopics,
  getThreads,
  updatedTopic,
  updatedThread,
  clearSelectedTopics,
  getThreadsForTopic,
  clearPayload,
  getArchivedThreads,
  getSearchedThreadsData,
  getThreadsData,
} from '../../modules/communityScreen';
import TopicsModal from '../../components/TopicsModal';
import IconButton from '../../components/IconButton';
import {errorHandler} from '../../modules/errorHandler';
import Constant from '../../utility/colorConstant';
import {fontMaker} from '../../utility/helper';
import {getTrendingPost} from '../../modules/landingPage';

class AddTopicOrThread extends Component {
  static navigationOptions = ({navigation}) => {
    const {
      state: {
        params: {route, canUpdate},
      },
    } = navigation;
    return {
      title:
        canUpdate && route === 'topics'
          ? 'Edit Topic'
          : canUpdate && route === 'threads'
          ? 'Edit Thread'
          : route === 'topics'
          ? 'Add Topic'
          : 'Add Thread',
      headerLeft: (
        <HeaderBackButton
          tintColor={Constant.HEADER_LEFT_BACK_BUTTON}
          onPress={() =>
            navigation.state.params && navigation.state.params.navigateBack()
          }
        />
      ),
    };
  };
  constructor() {
    super();
    this.state = {
      topic: '',
      description: '',
      topicId: [],
      modalVisible: false,
      switchValue: false,
      topicName: 'Select Topic',
      disabled: false,
    };
  }
  componentDidMount() {
    const {
      navigation: {
        state: {
          params: {route, canUpdate, key},
        },
        setParams,
      },
      dispatch,
    } = this.props;
    if ((route === 'topics' || key === 'threadEdit') && canUpdate) {
      this.updatedValues();
    } else if (route === 'threadToTopic') {
      this.threadToTopicStateUpdate();
    }
    setParams({navigateBack: this.navigateBack});
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(clearSelectedTopics());
  }
  onRowItemSelect = (id, index, name, isChecked) => {
    let topicName;
    const {dispatch, allTopicsData} = this.props;
    if (!isChecked) {
      topicName = name;
      this.setState({topicId: [id], topicName, modalVisible: false});
    } else {
      topicName = 'Select Topic';
      this.setState({topicId: [], topicName, modalVisible: false});
    }
    dispatch(selectTopicForAddThread(id, name, isChecked));
  };
  threadToTopicStateUpdate = () => {
    const {
      navigation: {
        state: {
          params: {id, name},
        },
      },
    } = this.props;
    this.setState({topicName: name, topicId: [id]});
  };
  navigateBack = () => {
    const {
      dispatch,
      navigation: {goBack},
    } = this.props;
    dispatch(clearSelectedTopics());
    goBack();
  };
  handleTextChange = (field) => (text) => {
    const newState = {};
    newState[field] = text;
    this.setState(newState);
  };
  updatedValues = () => {
    const {
      navigation: {
        state: {
          params: {isActive, description, name},
          params,
        },
      },
    } = this.props;
    this.setState({topic: name, description, switchValue: isActive});
  };

  submitTopicOrThread = () => {
    const {
      dispatch,
      navigation: {
        state: {
          params: {route, id},
          params,
        },
        goBack,
        replace,
      },
    } = this.props;
    const {topic, description, topicId} = this.state;
    Keyboard.dismiss();
    if (route === 'threads' && topicId.length <= 0) {
      dispatch(errorHandler('Please select a topic'));
    } else if (this.state.topic.length <= 0) {
      route === 'topics'
        ? dispatch(errorHandler('Please enter topic name'))
        : dispatch(errorHandler('Please enter thread name'));
    } else if (this.state.description.trim().length <= 0) {
      route === 'topics'
        ? dispatch(errorHandler('Please enter topic description'))
        : dispatch(errorHandler('Please enter thread post'));
    } else if (route === 'topics') {
      const payload = {
        data: {
          attributes: {
            description: description.trim(),
            name: topic.trim(),
          },
          type: 'topics',
        },
      };
      this.setState({disabled: true});
      dispatch(clearPayload('addTopic'));
      dispatch(submitTopic(payload)).then((response) => {
        dispatch(getTopics(1)).then(() => {
          dispatch(getAllTopics()).then(() => goBack());
        });
        if (response && response.data && response.data.attributes !== null) {
          Toast.showWithGravity(
            'Topic added successfully',
            Toast.LONG,
            Toast.BOTTOM,
          );
        }
      });
    } else {
      const payload = {
        data: {
          attributes: {
            name: topic.trim(),
            post: {content: description.trim()},
            topic_ids: topicId,
          },
          type: 'threads',
        },
      };
      this.setState({disabled: true});
      dispatch(submitThread(payload)).then((res) => {
        const {
          data: {
            attributes: {slug},
          },
        } = res;
        dispatch(clearPayload('addThread'));
        route !== 'threadToTopic'
          ? dispatch(getThreads(1))
              .then(() => {
                goBack();
              })
              .catch(() => {
                this.setState({disabled: false});
              })
          : dispatch(getThreadsForTopic(1, id))
              .then(() => {
                dispatch(getThreads(1));
                goBack();
              })
              .catch(() => {
                this.setState({disabled: false});
              });
        dispatch(clearSelectedTopics());
        if (res && res.attributes !== null) {
          Toast.showWithGravity(
            'Thread added successfully',
            Toast.LONG,
            Toast.BOTTOM,
          );
        }
      });
    }
  };
  updateTopicOrThread = () => {
    const {switchValue, topic, description} = this.state;
    const {
      dispatch,
      navigation: {
        state: {
          params: {route, id, dataRoute},
        },
        goBack,
      },
      topicId,
      searchString,
      threadsId,
      threadsPostSlug,
    } = this.props;
    const payload = {
      data: {
        attributes: {
          name: topic.trim(),
        },
        id,
        type: route === 'topics' ? 'topics' : 'threads',
      },
    };
    const {
      data: {attributes},
    } = payload;
    Keyboard.dismiss();
    if (route === 'topics') {
      if (topic.length <= 0) {
        dispatch(errorHandler('Please select topic'));
      } else if (description.trim().length <= 0) {
        dispatch(errorHandler('Please enter description'));
      } else {
        attributes.description = description.trim();
        attributes.is_active = switchValue;
        this.setState({disabled: true});
        dispatch(updatedTopic(id, payload)).then((response) => {
          dispatch(clearPayload('addTopic'));
          dispatch(getTopics(1)).then(() => {
            dispatch(getAllTopics());
            goBack();
          });
          if (response && response.data && response.data.attributes !== null) {
            Toast.showWithGravity(
              'Topic updated successfully',
              Toast.LONG,
              Toast.BOTTOM,
            );
          }
        });
      }
    } else if (route === 'threads') {
      if (topic.trim().length <= 0) {
        dispatch(errorHandler('Please enter thread name'));
      } else {
        this.setState({disabled: true});
        dispatch(updatedThread(id, payload))
          .then((response) => {
            dispatch(clearPayload('threadRefresh'));
            dispatch(getTrendingPost());
            if (threadsPostSlug) {
              dispatch(getThreadsData(threadsPostSlug)).then(() => {
                this.dispatchFunction();
              });
            } else {
              this.dispatchFunction();
            }
            if (
              response &&
              response.data &&
              response.data.attributes !== null
            ) {
              Toast.showWithGravity(
                'Thread updated successfully',
                Toast.LONG,
                Toast.BOTTOM,
              );
            }
          })
          .catch(() => {
            this.setState({disabled: false});
          });
      }
    }
  };
  dispatchFunction = () => {
    const {
      dispatch,
      navigation: {
        state: {
          params: {dataRoute, searchString, topicIds, searchPayloadRoute},
        },
        goBack,
      },
      topicId,
    } = this.props;
    if (dataRoute === 'selectedThreads') {
      dispatch(getThreadsForTopic(1, topicId))
        .then(() => {
          dispatch(getThreads(1));
          goBack();
        })
        .catch((err) => console.log('err', err));
    } else if (dataRoute === 'archive') {
      dispatch(getArchivedThreads(1))
        .then(() => {
          goBack();
        })
        .catch((err) => console.log('err', err));
    } else if (dataRoute === 'search') {
      dispatch(
        getSearchedThreadsData(1, topicIds, searchString, searchPayloadRoute),
      )
        .then(() => {
          goBack();
        })
        .catch((err) => console.log('err', err));
    } else {
      dispatch(getThreads(1));
      goBack();
    }
  };
  showModal = () => {
    const {modalVisible} = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };
  toggleSwitch = () => {
    const {switchValue} = this.state;
    this.setState({switchValue: !switchValue});
  };

  render() {
    const {
      sideMenuItems,
      navigation: {
        state: {
          params: {route, canUpdate, key},
        },
      },
      allTopicsData,
      fetching,
      topicId,
    } = this.props;
    const {modalVisible, switchValue, topicName} = this.state;
    return (
      <Form fetching={fetching} barStyle="light-content">
        <ScrollView accessible={false} keyboardShouldPersistTaps="handled">
          {route === 'threads' && !canUpdate ? (
            <Button
              style={[
                styles.buttonContainer,
                {borderColor: sideMenuItems.sideMenuColor},
              ]}
              onPress={this.showModal}>
              <Text
                style={[
                  styles.buttonText,
                  {color: sideMenuItems.sideMenuColor},
                ]}>
                {topicName}
              </Text>
            </Button>
          ) : null}
          {route === 'threadToTopic' ? (
            <Button
              style={[
                styles.buttonContainer,
                {borderColor: sideMenuItems.sideMenuColor},
              ]}
              opacity={0.1}>
              <Text
                style={[
                  styles.buttonText,
                  {color: sideMenuItems.sideMenuColor},
                ]}>
                {topicName}
              </Text>
            </Button>
          ) : null}
          {canUpdate && route === 'topics' ? (
            <View style={styles.viewTopic}>
              <Text style={styles.textTopic}>Active Topic</Text>
              <Switch
                accessibilityLabel={switchValue ? 'Active' : 'Inactive'}
                trackColor={switchValue ? '#f00' : '#00f'}
                onValueChange={this.toggleSwitch}
                value={this.state.switchValue}
              />
            </View>
          ) : null}

          <View style={styles.textAreaContainer}>
            <IconButton
              multiline
              autoCorrect={false}
              placeholder={route === 'topics' ? 'Enter Topic' : 'Enter Thread'}
              icon="sticky-note-o"
              iconSize={22}
              onChangeText={this.handleTextChange('topic')}
              value={this.state.topic}
              maxLength={route === 'topics' ? 50 : 100}
              returnKeyType="next"
              style={styles.textArea}
            />
            {key !== 'threadEdit' ? (
              <IconButton
                multiline
                autoCorrect={false}
                placeholder={
                  route === 'topics' ? 'Enter Description' : 'Enter Post'
                }
                icon="comment-o"
                iconSize={22}
                maxLength={10000}
                onChangeText={this.handleTextChange('description')}
                value={this.state.description}
                returnKeyType="go"
                style={styles.textArea}
              />
            ) : null}
          </View>
          <Button
            accessible
            accessibilityRole="button"
            disabled={this.state.disabled}
            style={[
              styles.buttonContainer,
              {borderColor: sideMenuItems.sideMenuColor},
            ]}
            onPress={
              canUpdate ? this.updateTopicOrThread : this.submitTopicOrThread
            }>
            <Text
              style={[styles.buttonText, {color: sideMenuItems.sideMenuColor}]}>
              {canUpdate ? 'Update' : 'Submit'}
            </Text>
          </Button>
          {modalVisible ? (
            <TopicsModal
              data={allTopicsData}
              headerText="Select Topic"
              modalVisible={modalVisible}
              showModal={this.showModal}
              onRowItemSelect={this.onRowItemSelect}
              route="addTopic"
            />
          ) : null}
        </ScrollView>
      </Form>
    );
  }
}

const styles = StyleSheet.create({
  textArea: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingLeft: 15,
    paddingVertical: 10,
    width: '80%',
    ...fontMaker('regular'),
  },
  textTopic: {
    fontSize: 20,
    color: '#000',
    marginRight: 10,
    paddingBottom: 5,
  },
  viewTopic: {
    marginVertical: 10,
    alignItems: 'flex-end',
    width: '95%',
    alignSelf: 'center',
    height: 50,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
    width: '70%',
  },
  textAreaContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderColor: '#000',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 18,
  },
});
AddTopicOrThread.defaultProps = {
  threadsPostSlug: null,
  navigation: {},
};

AddTopicOrThread.propTypes = {
  sideMenuItems: PropTypes.object.isRequired,
  threadsPostSlug: PropTypes.string,
  navigation: PropTypes.object,
};
const mapStateToProps = (state) => ({
  fetching: state.getCommunityScreenReducer.fetching,
  sideMenuItems: setSideMenuItems(state),
  allTopicsData: state.getCommunityScreenReducer.allTopicsData,
  topicId: state.getCommunityScreenReducer.topicId,
  threadsPostSlug: state.getCommunityScreenReducer.threadsPostSlug,
});
export default connect(mapStateToProps)(AddTopicOrThread);
