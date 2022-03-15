import React from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import {formatChannelDate} from '../../utility/helper';

const ModerationMessageHeaderBox = (props) => {
  const {item, userId, renderMessages} = props;
  return (
    <React.Fragment>
      <Text style={[styles.textModeration]}>
        {item.state === 'declined' &&
        item.reported_user_id &&
        userId === item.reported_user_id.toString()
          ? 'Could not be received - failed moderation'
          : item.state === 'flagged'
          ? `Pending Moderation - ${formatChannelDate(item.inserted_at)}`
          : 'Could not be sent - failed moderation'}
      </Text>
      {!(
        item.state === 'declined' &&
        item.reported_user_id &&
        userId === item.reported_user_id.toString()
      ) &&
      !(
        item.state === 'flagged' &&
        item.reported_user_id &&
        userId === item.reported_user_id.toString()
      ) ? (
        <View style={{paddingTop: 5}}>{renderMessages(item)}</View>
      ) : null}
    </React.Fragment>
  );
};

ModerationMessageHeaderBox.defaultProps = {
  item: null,
  renderMessages: () => {},
};

ModerationMessageHeaderBox.propTypes = {
  item: PropTypes.object,
  userId: PropTypes.string.isRequired,
  renderMessages: PropTypes.func,
};

export default ModerationMessageHeaderBox;
