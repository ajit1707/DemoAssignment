import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import ModerationMessageHeaderBox from './moderationMessageHeaderBox';
import ModerationMessageFooterBox from './moderationMessageFooterBox';

const ModerationBox = (props) => {
  const {
    item,
    renderMessages,
    isSender,
    userId,
    showModerationType,
    index,
  } = props;
  return (
    <View
      style={[
        styles.moderationBoxLeftContainer,
        isSender && index > 0 && {marginLeft: 52},
        !isSender && styles.moderationBoxRightContainer,
      ]}>
      {showModerationType ? (
        <ModerationMessageHeaderBox
          item={item}
          userId={userId}
          renderMessages={renderMessages}
        />
      ) : null}
      <ModerationMessageFooterBox item={item} userId={userId} />
    </View>
  );
};

ModerationBox.defaultProps = {
  item: null,
  renderMessages: () => {},
  isSender: false,
  showModerationType: false,
  index: 0,
};

ModerationBox.propTypes = {
  item: PropTypes.object,
  renderMessages: PropTypes.func,
  isSender: PropTypes.bool,
  userId: PropTypes.string.isRequired,
  showModerationType: PropTypes.bool,
  index: PropTypes.number,
};

export default ModerationBox;
