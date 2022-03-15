import React, {Component} from 'react';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';
import CookieManager from 'react-native-cookies';
import {connect} from 'react-redux';
import {Container} from '../components';
import Config from '../utility/config';
import Constant from '../utility/constant';
import {updateState} from '../modules/getUserDetail';
import {errorHandler} from '../modules/errorHandler';

class PolicyScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title') || null,
  });

  constructor() {
    super();
    this.state = {
      spinner: false,
      loading: false,
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
      navigation: {dispatch},
    } = this.props;
    if (evt.url.includes('survey-thanks')) {
      dispatch(updateState());
      // setTimeout(() => { dispatch(errorHandler(Constant.SURVEY_SUCCESS)); }, 1000);
      dispatch(errorHandler(Constant.SURVEY_SUCCESS));
    }
  };

  render() {
    const {
      navigation,
      navigation: {
        state: {params},
      },
    } = this.props;
    const {spinner, loading} = this.state;
    let link = '';
    if (params.screenKey === 'survey') {
      if (params.surveyUrl.includes('.pdf')) {
        link = `${Constant.GOOGLE_PDF_VIEWER_URL}${params.surveyUrl}`;
      } else {
        link = params.surveyUrl;
      }
    } else if (params.url.includes('http')) {
      link = params.url;
    } else {
      link = `${Config.POLICY_URL}${params.url}`;
    }

    return (
      <Container
        fetching={spinner || loading}
        goBack={params.screenKey === 'survey'}
        goBackAction={
          params.screenKey === 'survey' ? () => navigation.goBack() : null
        }
        showAlertSuccessTitle={params.screenKey === 'survey'}>
        <WebView
          bounces={false}
          onLoadEnd={() => this.onLoad(false)}
          source={{uri: link}}
          javaScriptEnabledAndroid
          javaScriptEnabled
          useWebkit
          allowsInlineMediaPlayback
          onNavigationStateChange={this.onNavigationStateChange}
          thirdPartyCookiesEnabled={false}
        />
      </Container>
    );
  }
}

PolicyScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isConnected: state.checkNetwork.isConnected,
  userDetailPayload: state.getUserDetail.userDetailPayload,
});

export default connect(mapStateToProps)(PolicyScreen);
