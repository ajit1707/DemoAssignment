import React, {PureComponent} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Form, TextArea} from '../../components';
import Style from './style';
import Constant from '../../utility/constant';
import {socketReportMessage} from '../../utility/phoenix-utils';
import {reportNavigationOptions} from '../../navigators/Root';
import {errorHandler} from '../../modules/errorHandler';

class ReportMessageScreen extends PureComponent {
  static navigationOptions = ({navigation}) => ({
    ...reportNavigationOptions(
      navigation,
      navigation.state.params && navigation.state.params.handleSubmit,
    ),
  });

  constructor() {
    super();
    this.state = {
      message: '',
    };
  }

  componentDidMount() {
    const {
      navigation: {setParams},
    } = this.props;
    setParams({handleSubmit: this.handleSubmit});
  }

  handleTextChange = (field) => (text) => {
    const newState = {};
    newState[field] = text;
    this.setState(newState);
  };

  handleSubmit = async () => {
    const {
      screenProps: {emitter},
      projects,
      navigation: {
        state: {params},
      },
      dispatch,
      navigation,
    } = this.props;
    const {message} = this.state;
    if (!message.trim()) {
      this.setState({message: ''});
      dispatch(errorHandler(Constant.INVALID_REPORT_MESSAGE));
    } else {
      let projectId;
      const localData = await AsyncStorage.getItem(
        Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
        () => {},
      );
      if (localData) {
        projectId = JSON.parse(localData);
      } else {
        projectId = projects.data[0];
      }
      const payload = {
        project_id: projectId.id,
        message_id: params.messagePayload.id,
        user_id: params.messagePayload.user_id,
        reason: message.trim(),
      };
      socketReportMessage(payload);
      emitter.emit('resetReportModeration');
      navigation.goBack();
    }
  };

  render() {
    const {message} = this.state;
    return (
      <Form
        barStyle={Constant.STATUS_BAR_COLOR.LIGHT_CONTENT}
        style={[Style.container, {marginTop: 50}]}>
        <View style={[Style.textAreaContainer]}>
          <TextArea
            onChangeText={this.handleTextChange('message')}
            value={message}
            placeholder={Constant.REPORT_MESSAGE_SCREEN_PLACEHOLDER}
            maxLength={2000}
            style={Style.textArea}
          />
        </View>
      </Form>
    );
  }
}

ReportMessageScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentChannelData: state.channelMessage.currentChannelData,
  projects: state.getProjects.projectSessionPayload,
});

export default connect(mapStateToProps)(ReportMessageScreen);
