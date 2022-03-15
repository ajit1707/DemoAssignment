import React, {Component} from 'react';
import {View, Text, Image, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {AuthTextInput, AuthButton, BackButton, Form} from '../../components';
import Icon from '../../utility/icons';
import {deepLinkHandler} from '../../modules/deepLinkHandler';
import {errorHandler} from '../../modules/errorHandler';
import {resetPassword} from '../../modules/resetPassword';
import styles from './Styles';
import {validate} from '../../utility/validator';
import Constant from '../../utility/constant';
import {NavigationActions} from 'react-navigation';

class ResetPasswordScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super();
    this.state = {
      newPassword: '',
      id: props.deepLinkPayload ? props.deepLinkPayload.params.isDeepLink : '',
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(
      deepLinkHandler({
        routeName: null,
        params: {isDeepLink: false, token: null},
      }),
    );
  }

  componentDidUpdate(prevProps) {
    const {
      navigation: {navigate},
      resetPasswordPayload,
    } = this.props;
    if (prevProps.resetPasswordPayload !== resetPasswordPayload) {
      navigate('LoginScreen');
    }
  }

  handleTextChange = (field) => (text) => {
    const newState = {};
    newState[field] = text.trim();
    this.setState(newState);
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  handleSubmit = () => {
    const {newPassword, id} = this.state;
    const {
      navigation: {setParams, state, navigate},
    } = this.props;
    const {
      dispatch,
      forgotPasswordPayload,
      resetPasswordLinkPayload,
    } = this.props;
    Keyboard.dismiss();
    const validationError = validate('password', newPassword);
    let resetPasswordId = get(forgotPasswordPayload, 'data.id', null);
    if (validationError) {
      dispatch(errorHandler(validationError));
    } else {
      if (id) {
        resetPasswordId = resetPasswordLinkPayload.data[0].id;
      }
      if (state && state.params !== undefined) {
        if (state.params.hasOwnProperty('resetPasswordInfo')) {
          resetPasswordId = get(state.params, 'resetPasswordInfo.0.id', null);
          if (!resetPasswordId) {
            resetPasswordId = get(forgotPasswordPayload, 'data.id', null);
          }
        }
      }
      const userData = {
        data: {
          attributes: {
            password: newPassword,
          },
          id: resetPasswordId,
          type: 'password_resets',
        },
      };
      dispatch(resetPassword(userData, resetPasswordId));
    }
  };

  render() {
    const {
      fetching,
      navigation: {setParams, state, navigate},
      forgotPasswordPayload,
    } = this.props;
    const {newPassword} = this.state;
    return (
      <Form fetching={fetching}>
        <BackButton goBack={this.goBack} />
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
          <View style={styles.linkContainer}>
            <Text style={styles.forgotPasswordText}>Reset your password</Text>
          </View>
          <AuthTextInput
            accessibilityLabel={Constant.PLACEHOLDER.RESET_PASSWORD}
            onChangeText={this.handleTextChange('newPassword')}
            placeholder={Constant.PLACEHOLDER.RESET_PASSWORD}
            secureTextEntry
            value={newPassword}
            onSubmitEditing={this.handleSubmit}
          />
          <AuthButton
            accessibilityLabel={`${!newPassword ? 'Disabled' : 'Enabled'} Send`}
            accessibilityRole="button"
            disabled={!newPassword}
            onPress={this.handleSubmit}>
            <Text style={styles.authButtonText}>Send</Text>
          </AuthButton>
        </View>
      </Form>
    );
  }
}

ResetPasswordScreen.defaultProps = {
  resetPasswordPayload: null,
  forgotPasswordPayload: null,
  resetPasswordLinkPayload: null,
  deepLinkPayload: null,
};

ResetPasswordScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  forgotPasswordPayload: PropTypes.object,
  resetPasswordPayload: PropTypes.object,
  deepLinkPayload: PropTypes.object,
  resetPasswordLinkPayload: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetching: state.resetPassword.fetching,
  forgotPasswordPayload: state.forgotPassword.forgotPasswordPayload,
  resetPasswordPayload: state.resetPassword.resetPasswordPayload,
  resetPasswordLinkPayload: state.checkResetPasswordLink.passwordLinkPayload,
});

export default connect(mapStateToProps)(ResetPasswordScreen);
