import {DialogTitle} from 'react-native-popup-dialog';
import Style from './style';
import React from 'react';

const RenderTitle = () => (
  <DialogTitle
    title="Do you want upload the assignment?"
    textStyle={[Style.buttonText, Style.titleText]}
    hasTitleBar={false}
  />
);
export default RenderTitle;
