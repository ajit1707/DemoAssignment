import {DialogButton, DialogFooter} from 'react-native-popup-dialog';
import Style from './style';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableOpacity} from 'react-native';

class RenderFooter extends PureComponent {
  render() {
    const {backPress, uploadDocument} = this.props;
    return (
      <DialogFooter>
        <TouchableOpacity
          accessible
          accessibilityLabel="Cancel assignment uploading"
          accessibilityRole="button"
          style={Style.leftButton}
          onPress={() => this.backPress('cancel')}>
          <Text style={Style.leftButtonStyle}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel="Upload assignment"
          accessibilityRole="button"
          style={Style.rightButton}
          onPress={() => this.uploadDocument()}>
          <Text style={Style.rightButtonStyle}>Upload</Text>
        </TouchableOpacity>
      </DialogFooter>
    );
  }
}
RenderFooter.defaultProps = {
  imagePayload: null,
};

RenderFooter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  imagePayload: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};
export default RenderFooter;
