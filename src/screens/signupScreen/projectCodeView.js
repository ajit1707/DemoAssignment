import React, {Component} from 'react';
import {View, Text, Image, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {AuthTextInput, AuthButton, BackButton, Form} from '../../components';
import Icon from '../../utility/icons';
import {projectCode} from '../../modules/projectCode';
import {errorHandler} from '../../modules/errorHandler';
import styles from './Styles';
import Constant from '../../utility/constant';
import {validate} from '../../utility/validator';
import {logEventForAnalytics} from '../../utility/firebase-utils';

class ProjectCodeScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor() {
    super();
    this.state = {
      projectCodeData: '',
    };
  }

  componentDidUpdate(prevProps) {
    const {
      projectCodeData,
      navigation: {navigate},
    } = this.props;
    if (prevProps.projectCodeData !== projectCodeData) {
      logEventForAnalytics('projectCode', {});
      navigate('SignUpScreen');
      this.resetForm();
    }
  }

  handleTextChange = (field) => (text) => {
    const newState = {};
    newState[field] = text.trim();
    this.setState(newState);
  };

  handleButtonDisability = () => {
    const {projectCodeData} = this.state;
    return !projectCodeData;
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  handleSubmit = () => {
    const {projectCodeData} = this.state;
    const {dispatch} = this.props;
    Keyboard.dismiss();
    const validationError = validate('projectCode', projectCodeData);
    if (validationError) {
      dispatch(errorHandler(validationError));
    } else {
      dispatch(projectCode(projectCodeData));
    }
  };

  resetForm = () => {
    this.setState({projectCodeData: ''});
  };

  render() {
    const {fetching} = this.props;
    const {projectCodeData} = this.state;
    return (
      <Form fetching={fetching}>
        <BackButton goBack={this.goBack} />
        <View style={styles.container}>
          <View style={styles.screenContainer}>
            <Image
              source={Icon.FOOTER_LOGO}
              style={styles.logoImage}
              accessible
              accessibilityLabel={
                Constant.ACCESSIBILITY.BRIGHTSIDE_LOGO.accessibilityLabel
              }
              accessibilityRole={
                Constant.ACCESSIBILITY.BRIGHTSIDE_LOGO.accessibilityRole
              }
            />
            <Text style={styles.forgotPasswordText}>
              Enter your project code
            </Text>
            <AuthTextInput
              accessibilityLabel={Constant.PLACEHOLDER.PROJECT_CODE}
              onChangeText={this.handleTextChange('projectCodeData')}
              placeholder={Constant.PLACEHOLDER.PROJECT_CODE}
              value={projectCodeData}
              maxLength={6}
              returnKeyType="go"
              onSubmitEditing={this.handleSubmit}
            />
            <AuthButton
              accessibilityLabel={`${
                this.handleButtonDisability() ? 'Disabled' : 'Enabled'
              } Join project`}
              accessibilityRole="button"
              disabled={this.handleButtonDisability()}
              onPress={this.handleSubmit}>
              <Text style={styles.authButtonText}>Join project</Text>
            </AuthButton>
          </View>
        </View>
      </Form>
    );
  }
}

ProjectCodeScreen.defaultProps = {
  projectCodeData: null,
};

ProjectCodeScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  projectCodeData: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetching: state.projectCode.fetching,
  projectCodeData: state.projectCode.projectCodePayload,
});

export default connect(mapStateToProps)(ProjectCodeScreen);
