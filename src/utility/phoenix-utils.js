import AsyncStorage from '@react-native-async-storage/async-storage';
import {Socket} from './phoenix';
import {channelMessage} from '../modules/channelMessage';
import Constant from '../utility/constant';
import {displayChannelItems} from '../modules/displayChannelItems';
import {socketNotification} from '../modules/socketNotification';
import Config from '../utility/config';
import {logEventForAnalytics} from './firebase-utils';

let socket;
let channel;

export function socketConnect(projectId) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('USER_DATA', (error, result) => {
      const token = JSON.parse(result).data.id;
      socket = new Socket(Config.SOCKET_BASE_URL, {
        params: {session_token: token, project_id: projectId},
      });
      socket.onOpen(() => resolve('Connectd.'));
      socket.onError(() => reject('Cannot connect.'));
      socket.onClose(() => console.log('Goodbye.'));
      socket.connect();
    });
  });
}

export function joinChannel(
  item,
  dispatch,
  pageNumber,
  screenKey,
  userId,
  isPagination,
) {
  let messages = [];
  return new Promise((resolve, reject) => {
    if (screenKey === 'sideMenu') {
      messages = [];
      if (channel && channel.state === 'joined') {
        socketLeaveChannel();
      }
    }
    const topic = `channels:${item.channelId}`;
    const {userRole} = item;
    const {channelType} = item;
    const channelPayload = {type: channelType, user_role: userRole};
    channel = socket.channel(topic, channelPayload);
    // join the channel and listen for admittance
    channel
      .join()
      .receive('ignore', () => console.log('Access denied.'))
      .receive('ok', () => {
        if (screenKey !== 'messageScreen') {
          dispatch(channelMessage([], item));
        }
        // resolve(item);
      })
      .receive('timeout', () => console.log('Must be MongoDB.'));
    channel.push('get_messages', {page_number: pageNumber, page_size: 15});

    // channel-level event handlers
    channel.onError(() => console.log('Channel blew up.'));
    // channel.onClose(event => console.log('Channel closed.', event));
    // channel.on('user:entered', msg => console.log({ aWildUserAppears: msg }));
    channel.on('shout', (msg) => {
      msg.date = msg.inserted_at.substring(0, 10);
      msg.channel_id = item.channelId;
      if (!msg.new_message) {
        messages.push(msg);
      }
      if (msg.last_message || msg.new_message) {
        if (msg.new_message && msg.user_id !== parseInt(userId, 10)) {
          logEventForAnalytics('message_received', {});
        }
        resolve(messages);
        dispatch(
          channelMessage(
            msg.new_message ? msg : messages,
            item,
            null,
            null,
            isPagination,
          ),
        );
      }
    });

    channel.on('update', (moderationMessage) => {
      moderationMessage.date = moderationMessage.inserted_at.substring(0, 10);
      moderationMessage.channel_id = item.channelId;
      dispatch(channelMessage(moderationMessage, item, 'moderation'));
    });
  });
}

export function socketReportMessage(payload) {
  channel.push('add_to_moderation', payload);
}

export function socketChannelNotification(channelItems, dispatch) {
  const channelsPayloadCopy = channelItems;
  AsyncStorage.getItem(Constant.ASYNC_KEYS.USER_DATA, (error, result) => {
    if (socket && socket.channel && socket.channel.length && result) {
      const channelNotification = socket.channel(
        `notification:${JSON.parse(result).data.id}`,
        {},
      );
      const presences = {};

      channelNotification.on('presence_state', () => {
        // Phoenix.Presence.syncState(presences, state);
        console.log('[NotificationClient] presence_state:', presences);
      });

      channelNotification.on('presence_diff', () => {
        // Phoenix.Presence.syncDiff(presences, diff);
        console.log('[NotificationClient] presence_diff:', presences);
      });

      if (
        !(
          channelNotification.state === 'joined' ||
          channelNotification.state === 'joining'
        )
      ) {
        channelNotification
          .join()
          .receive('error', () => console.log('Access denied.'))
          .receive('ok', (res) => {
            console.log('[NotificationClient] Joined successfully', res);
          });
      }
      channelNotification.on('update', (payload) => {
        logEventForAnalytics('message_received', {});
        Object.keys(payload).forEach((key) => {
          if (channelItems && channelItems.length) {
            channelItems.forEach((channels, index) => {
              if (Number(channels.channelId) === Number(key)) {
                channelsPayloadCopy[index].notificationCount = payload[key];
              }
            });
          }
        });
        dispatch(socketNotification('add', channelsPayloadCopy));
        dispatch(displayChannelItems(channelsPayloadCopy));
      });
    }
  });
}

export function socketLeaveChannel() {
  if (channel) {
    channel
      .leave()
      .receive('ok', () => {
        console.log('Channel leaved');
      })
      .receive('error', () => {
        console.log('Channel error');
      });
  }
}

export function socketPushMessage(message) {
  const messageBody = message.body.length ? message.body : ' ';
  if (channel && message) {
    channel.push('shout', {
      body: messageBody,
      project_id: message.project_id,
      attachment: message.attachment,
    });
  }
}

// disconnect socket

export function socketDisconnect() {
  if (socket) {
    socket.disconnect();
    socket = undefined;
  }
}
