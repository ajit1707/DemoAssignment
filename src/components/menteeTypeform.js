import React, {Component} from 'react';
import {Platform} from 'react-native';
import WebView from 'react-native-webview';
import CookieManager from 'react-native-cookies';
import {connect} from 'react-redux';
import {Container} from '../components';
import {postMentorFile} from '../modules/typeformMentee';
import Toast from 'react-native-simple-toast';
import {mentorData} from '../modules/chosseAsMentor';

class MenteeTypeform extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Mentee Typeform',
  });

  constructor() {
    super();
    this.state = {
      spinner: true,
    };
  }

  componentDidMount() {
    CookieManager.clearAll()
      .then((res) => {
        console.log('CookieManager.clearAll =>', res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  onLoad = (spinner) => {
    this.setState({
      spinner,
    });
  };
  onNavigationStateChange = (evt) => {
    const {
      navigation: {dispatch, navigate},
      userDetailPayload,
      screenProps: {emitter},
    } = this.props;
    const project = userDetailPayload.data[0].attributes.project_id;
    let id;
    const data = true;
    const questionSplit = evt.url.split('?');
    const questionId = questionSplit.find((item) =>
      item.includes('menteeResponseId'),
    );
    if (questionId) {
      id = questionId.replace('menteeResponseId=', '');
      const payload = {
        data: {
          type: 'matching_users',
          attributes: {
            respondent_id: id,
            project_id: String(project),
          },
        },
      };
      if (evt.url.includes('matches?menteeResponseId')) {
        dispatch(mentorData(data));
        navigate('MenteeQuestionScreen', {mentorData: payload});
      }
    }
  };

  render() {
    const {
      navigation: {
        state: {params},
      },
      userDetailPayload,
    } = this.props;
    const url = userDetailPayload.data[0].attributes.typeform_link;
    return (
      <Container>
        <WebView
          bounces={false}
          onLoadEnd={() => this.onLoad(false)}
          source={{uri: url}}
          javaScriptEnabledAndroid
          javaScriptEnabled
          startInLoadingState
          useWebkit
          allowsInlineMediaPlayback
          onNavigationStateChange={this.onNavigationStateChange}
          thirdPartyCookiesEnabled={false}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  isConnected: state.checkNetwork.isConnected,
  userDetailPayload: state.getUserDetail.userDetailPayload,
  fetching: state.typeformMenteeDataReducer.fetching,
});

export default connect(mapStateToProps)(MenteeTypeform);
