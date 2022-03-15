import React, {Component} from 'react';
import {
  Text,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Dialog, {
  DialogContent,
  ScaleAnimation,
  DialogTitle,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
import connect from 'react-redux/es/connect/connect';
import {errorHandler} from '../modules/errorHandler';
import {bytesConverter, fontMaker} from '../utility/helper';
import Color from '../utility/colorConstant';
import Style from '../screens/assignmentScreen/style';

const deviceWidth = Dimensions.get('window').width;

class AlertDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goBack: props.goBack,
    };
  }

  onAlertClose = () => {
    const {dispatch, goBackAction, handleSubmit, route} = this.props;
    const {goBack} = this.state;
    dispatch(errorHandler());
    if (route !== 'splashScreen') {
      handleSubmit();
    }
    if (goBack && typeof goBackAction === 'function') {
      setTimeout(() => {
        goBackAction();
      }, 100);
      this.setState({goBack: null});
    }
  };

  chooseTitle = () => {
    const {route, showAlertSuccessTitle, title, alertTitle} = this.props;
    if (alertTitle) {
      return alertTitle;
    }
    if (title) {
      return title;
    }
    return route === 'LogOut'
      ? 'Sign out'
      : showAlertSuccessTitle
      ? 'Success'
      : 'Error';
  };

  renderTitle = () => (
    <DialogTitle
      title={this.chooseTitle()}
      textStyle={[styles.buttonText, styles.titleText]}
      hasTitleBar={false}
    />
  );

  renderFooter = () => {
    const {
      route,
      handleSubmit,
      handleDismiss,
      secondButtonText,
      firstButtonText,
    } = this.props;
    if (route === 'splashScreen' || route === 'LogOut') {
      return (
        <DialogFooter>
          <TouchableOpacity
            accessible
            accessibilityLabel={firstButtonText || 'Sign Out'}
            accessibilityRole="button"
            style={Style.leftButton}
            onPress={handleSubmit}>
            <Text style={Style.leftButtonStyle}>
              {firstButtonText || 'Sign Out'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessible
            accessibilityLabel={secondButtonText || 'Dismiss'}
            accessibilityRole="button"
            style={Style.rightButton}
            onPress={handleDismiss}>
            <Text style={Style.rightButtonStyle}>
              {secondButtonText || 'Dismiss'}
            </Text>
          </TouchableOpacity>
        </DialogFooter>
      );
    }
    return (
      <DialogFooter>
        <DialogButton
          text={firstButtonText || 'Dismiss'}
          textStyle={styles.buttonText}
          style={styles.dialog}
          onPress={() => {
            this.onAlertClose();
          }}
        />
      </DialogFooter>
    );
  };
  render() {
    const {close, error, content, isVisible} = this.props;
    return (
      <Dialog
        visible={!!error || isVisible}
        useNativeDriver
        onTouchOutside={close}
        hasOverlay
        overlayOpacity={0.6}
        overlayBackgroundColor={Color.OVERLAY}
        width={deviceWidth * 0.85}
        dialogTitle={this.renderTitle()}
        dialogAnimation={
          new ScaleAnimation({
            initialValue: 0,
            useNativeDriver: true,
          })
        }
        footer={this.renderFooter()}>
        <View
          style={styles.dialogContainer}
          accessible
          accessibilityLabel={content || (error && error)}
          accessibilityRole="text">
          <Text style={styles.messageStyle}>{content || (error && error)}</Text>
        </View>
      </Dialog>
    );
  }
}
const mapStateToProps = (state) => ({
  fetching: state.signIn.fetching,
  error: state.errorHandler.error,
  title: state.errorHandler.title,
});

AlertDialog.defaultProps = {
  close: () => {},
  error: null,
  content: null,
  showAlertSuccessTitle: null,
  goBack: false,
  handleSubmit: () => {},
  route: null,
  isVisible: false,
  title: null,
  alertTitle: null,
  firstButtonText: null,
  secondButtonText: null,
};

AlertDialog.propTypes = {
  error: PropTypes.string,
  close: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleDismiss: PropTypes.func,
  route: PropTypes.string,
  isVisible: PropTypes.bool,
  showAlertSuccessTitle: PropTypes.bool,
  goBack: PropTypes.bool,
  content: PropTypes.string,
  goBackAction: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
  title: PropTypes.string,
  alertTitle: PropTypes.string,
  firstButtonText: PropTypes.string,
  secondButtonText: PropTypes.string,
};

export default connect(mapStateToProps)(AlertDialog);

const styles = StyleSheet.create({
  dialogContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  singleButton: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  singleButtonStyle: {
    paddingLeft: 120,
    fontSize: 16,
    color: '#000',
    ...fontMaker('semibold'),
    paddingVertical: 15,
  },
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  safeContainer: {
    width: '100%',
  },
  alertContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingTop: 20,
  },
  messageContainer: {
    justifyContent: 'center',
    width: '80%',
  },
  messageStyle: {
    ...fontMaker('regular'),
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    ...fontMaker('semibold'),
  },
  titleText: {
    ...fontMaker('bold'),
  },
  dialog: {
    alignSelf: 'center',
  },
});
