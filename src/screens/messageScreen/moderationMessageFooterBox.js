import React from 'react';
import {Text} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import Constant from '../../utility/constant';

const ModerationMessageFooterBox = (props) => {
  const {item, userId} = props;
  return (
    <React.Fragment>
      {(item.state === 'flagged' &&
        item.reported_user_id &&
        userId === item.reported_user_id.toString()) ||
      (item.state === 'flagged' && !item.reported_user_id) ||
      item.state === 'declined' ? (
        <Text style={styles.moderationText}>
          {item.state === 'flagged' && item.reported_user_id ? (
            userId === item.reported_user_id.toString() ? (
              Constant.SMART_MODERATION_MESSAGE
            ) : (
              ''
            )
          ) : item.state === 'flagged' ? (
            Constant.FlAGGED_MODERATION_MESSAGE
          ) : (
            <Text>
              {Constant.NEW_DECLINED_MODERATION_MESSAGE}
              {item.declined_reason}
            </Text>
          )}
        </Text>
      ) : null}
    </React.Fragment>
  );
};

ModerationMessageFooterBox.defaultProps = {
  item: null,
};

ModerationMessageFooterBox.propTypes = {
  item: PropTypes.object,
  userId: PropTypes.string.isRequired,
};

export default ModerationMessageFooterBox;
