import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  BackHandler,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import {Container} from '../../components';
import Icon from '../../utility/icons';
import {fontMaker} from '../../utility/helper';
import Config from '../../utility/config';
import {postMentorFile} from '../../modules/typeformMentee';
import {chooseUrMentorOptions} from '../../navigators/Root';
import {errorHandler} from '../../modules/errorHandler';
import {chosseYourMentorData, mentorData} from '../../modules/chosseAsMentor';
import Toast from 'react-native-simple-toast';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const borderRadius = 10;
const imageHeight = 140;
const imageWidth = 140;
const imageBorderRadius = 70;

export const navigationOption = ({navigation, screenProps}) => ({
  ...chooseUrMentorOptions(
    {navigation, screenProps},
    navigation.state.params &&
      navigation.state.params.handleBackButtonNavigation,
  ),
});
class MenteeQuestionScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    ...navigationOption({navigation, screenProps}),
  });
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }
  componentDidMount() {
    const {
      navigation: {setParams, state, navigate},
      dispatch,
      userDetailPayload,
      screenProps: {emitter},
    } = this.props;
    if (
      state &&
      state.params &&
      state.params.mentorData &&
      state.params.mentorData.hasOwnProperty('data')
    ) {
      const payload = state.params.mentorData;
      dispatch(postMentorFile(payload, navigate)).catch(() => {
        Toast.showWithGravity(
          'Unable to find matching mentor',
          Toast.SHORT,
          Toast.BOTTOM,
        );
        emitter.emit('updateLandingPage');
        emitter.emit('setSideMenuItemIndex', 0);
        navigate('LandingPage');
      });
    }
    setParams({handleBackButtonNavigation: this.handleBackPress});
  }
  handleBackPress = () => {
    const {
      navigation: {navigate},
      screenProps: {emitter},
      dispatch,
      chooseYourMentor,
    } = this.props;
    emitter.emit('updateLandingPage');
    emitter.emit('setSideMenuItemIndex', 0);
    navigate('LandingPage');
  };
  postcall = (index, mentor_id) => {
    const {
      dispatch,
      navigation: {navigate},
      matchingMentorPayload,
    } = this.props;
    const data = true;
    const payload = {
      data: {
        type: matchingMentorPayload.data.type,
        attributes: {
          respondent_id: matchingMentorPayload.data.attributes.respondent_id,
          project_id: matchingMentorPayload.data.attributes.project_id,
          mentor_id: String(mentor_id),
        },
      },
    };
    dispatch(postMentorFile(payload, navigate)).then(() => {
      const flag = true;
      dispatch(chosseYourMentorData(flag));
      navigate('MentorDetailsScreen', {index});
    });
  };
  onRefresh = () => {
    const {dispatch, userDetailPayload} = this.props;
    const project = userDetailPayload.data[0].attributes.project_id;
    const url = userDetailPayload.data[0].attributes.typeform_link;
    const questionSplit = url.split('?');
    const questionId = questionSplit.find((item) => item.includes('id='));
    const replaceId = questionId.replace('id=', '');
    const id = replaceId.replace('%3D', '=');
    const payload = {
      data: {
        type: 'matching_users',
        attributes: {
          respondent_id: id,
          project_id: String(project),
        },
      },
    };
    this.setState({refreshing: true}, () => {
      dispatch(postMentorFile(payload))
        .then((response) => {
          this.setState({refreshing: false});
        })
        .catch((err) => {
          dispatch(errorHandler(err));
          this.setState({refreshing: false});
        });
    });
  };
  renderItem = (item, index) => {
    let image;
    if (item.avatar_id.includes('brightside-assets')) {
      image = `${Config.IMAGE_SERVER_CDN}resize/500x500/${item.avatar_id}`;
    } else {
      image = item.avatar_id;
    }
    return (
      <TouchableOpacity onPress={() => this.postcall(index, item.mentor_id)}>
        <View style={styles.viewContainer} accessible={false}>
          <View style={styles.card} accessible={false}>
            <View style={styles.upperCard} accessible={false}>
              <View style={[styles.imageContainer]} accessible={false}>
                <View
                  style={styles.imageButton}
                  accessible
                  accessibilityLabel={`Profile picture of ${item.display_name}`}
                  accessibilityRole="image">
                  <Image style={styles.profileImage} source={{uri: image}} />
                </View>
              </View>
              <View
                style={styles.mentorNumberCategory}
                accessible
                accessibilityLabel={`Mentor ${item.rank}`}>
                <Text style={[styles.mentorNumber]}>Mentor {item.rank}</Text>
              </View>
            </View>
            <View style={styles.textContainer}>
              <Text
                style={styles.title}
                accessible
                accessibilityLabel={`${item.display_name}`}>
                {item.display_name}
              </Text>
              {item.hasOwnProperty('position') && item.position.trim() !== '' && (
                <View accessible accessibilityLabel={`${item.position}`}>
                  <Text style={styles.textTitlePosition} numberOfLines={1}>
                    {item.position}
                  </Text>
                </View>
              )}
              {item.hasOwnProperty('education') &&
                item.education.trim() !== '' && (
                  <View accessible accessibilityLabel={`${item.education}`}>
                    <Text style={styles.textTitleEducation} numberOfLines={3}>
                      {item.education}
                    </Text>
                  </View>
                )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const {matchingMentorPayload, fetching, userDetailPayload} = this.props;
    const {refreshing} = this.state;
    let numberOfMentees;
    if (
      !fetching &&
      matchingMentorPayload &&
      matchingMentorPayload.hasOwnProperty('data')
    ) {
      numberOfMentees =
        matchingMentorPayload.data.attributes.potential_matching_users.length;
    }
    return (
      <Container style={styles.mainContainer} fetching={fetching}>
        {matchingMentorPayload &&
        matchingMentorPayload.hasOwnProperty('data') ? (
          <FlatList
            data={
              matchingMentorPayload.data.attributes.potential_matching_users
            }
            renderItem={({item, index}) => this.renderItem(item, index)}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => this.onRefresh()}
              />
            }
            ListHeaderComponent={
              <View>
                <View
                  style={styles.header}
                  accessible
                  accessibilityLabel="default matching"
                  accessibilityRole="image">
                  <Image style={styles.img} source={Icon.COMPELTE} />
                </View>
                <View style={styles.textContainerforMentor}>
                  <Text style={styles.numberOfMentors}>
                    You have{' '}
                    {
                      matchingMentorPayload.data.attributes
                        .potential_matching_users.length
                    }{' '}
                    matched mentors!
                  </Text>
                </View>
              </View>
            }
            keyExtractor={(item) => item.id}
          />
        ) : null}
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  upperCard: {
    marginVertical: 10,
    borderBottomWidth: 2,
    borderColor: '#E5E5E5',
  },
  imageContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '4%',
    marginTop: '2%',
  },
  imageButton: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
    backgroundColor: '#ccc',
  },
  profileImage: {
    height: imageHeight,
    width: imageWidth,
    borderRadius: imageBorderRadius,
  },
  mentorNumberCategory: {
    marginTop: 10,
    marginBottom: 5,
    alignSelf: 'flex-end',
  },
  mentorNumber: {
    color: '#505d68',
    fontSize: 15,
  },
  numberOfMentors: {
    alignItems: 'center',
    color: '#666',
    ...fontMaker('bold'),
    fontSize: 16,
  },
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    marginLeft: 28,
    marginVertical: '3%',
    height: '90%',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: {width: 3, height: 3},
    elevation: 5,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    width: '92%',
    height: '90%',
  },
  img: {
    width: '100%',
    height: deviceWidth * 0.5,
    resizeMode: 'cover',
  },
  textContainer: {
    marginLeft: '4%',
    paddingBottom: '4%',
  },
  textContainerforMentor: {
    marginLeft: '4%',
    marginVertical: '4%',
    alignItems: 'center',
  },
  title: {
    color: '#666',
    ...fontMaker('bold'),
    fontSize: 18,
    marginTop: '2%',
  },
  textTitlePosition: {
    color: '#AAABAC',
    fontSize: 15,
    ...fontMaker('bold'),
    paddingTop: '2%',
    marginBottom: '3%',
  },
  textTitleEducation: {
    color: '#AAABAC',
    fontSize: 15,
    ...fontMaker('bold'),
    paddingBottom: '2%',
    marginBottom: '3%',
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
    marginTop: '4%',
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
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    ...fontMaker('bold'),
    color: '#fff',
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
    backgroundColor: '#e28834',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
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
    marginTop: '5%',
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
});
const mapStateToProps = (state) => ({
  userDetailPayload: state.getUserDetail.userDetailPayload,
  matchingMentorPayload: state.typeformMenteeDataReducer.matchingMentorPayload,
  fetching: state.typeformMenteeDataReducer.fetching,
  chooseYourMentor: state.menteeMentorReducer.chooseYourMentor,
});

export default connect(mapStateToProps)(MenteeQuestionScreen);
