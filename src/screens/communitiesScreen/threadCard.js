import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from '../../components';
import Config from '../../utility/config';
import Icons from '../../utility/icons';
import {testID} from '../../utility/helper';

export default function ThreadCard(props) {
  const {
    item: {
      attributes: {
        slug,
        created_at,
        created_by,
        name,
        like_count,
        current_user_like_status,
        is_archived,
        description,
        can_edit,
      },
      id,
    },
    onLikeThread,
    navigateToQuickPost,
    navigateToThreadPost,
    route,
    editOrArchiveThread,
    dataRoute,
  } = props;
  return (
    <View style={styles.container} accessible={false}>
      <TouchableOpacity
        accessible={false}
        activeOpacity={0.2}
        onPress={() => {
          navigateToThreadPost(slug, id, dataRoute);
        }}
        style={{paddingBottom: 4}}>
        <View style={[styles.titleContainer]}>
          <View style={styles.titleView}>
            <View style={styles.iconContainer}>
              <Image
                accessible
                accessibilityLabel={`Profile image of ${created_by.first_name}`}
                accessibilityRole="image"
                source={{
                  uri: created_by.avatar_id.includes('brightside-assets')
                    ? `${Config.IMAGE_SERVER_CDN}${created_by.avatar_id}`
                    : created_by.avatar_id
                    ? created_by.avatar_id
                    : Icons.NO_EXPERT,
                }}
                style={styles.crossIcon}
              />
            </View>
            <View style={styles.titles}>
              <Text style={[styles.titleText, styles.titleStyle]}>{`${
                created_by.first_name
              } ${created_by.last_name.charAt(0)}.`}</Text>
              <Text style={[styles.subTitleText]}>
                {moment(created_at).format('ll')}
              </Text>
            </View>
          </View>
          <View style={styles.editView}>
            {can_edit && (
              <TouchableOpacity
                accessible
                accessibilityLabel="Edit"
                accessibilityRole="button"
                style={styles.editButton}
                onPress={() =>
                  editOrArchiveThread(
                    'edit',
                    'threads',
                    true,
                    is_archived,
                    description,
                    name,
                    id,
                    '',
                    dataRoute,
                  )
                }>
                <FontAwesome name="pencil" size={20} color="#00f" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.threadStyle}>
          <Text style={[styles.threadName]}>{name}</Text>
        </View>
      </TouchableOpacity>
      {!is_archived && (
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            onPress={() => onLikeThread(id, !current_user_like_status, route)}
            {...testID(`${like_count} ${like_count <= 1 ? 'Like' : 'Likes'}`)}
            accessibilityRole="button">
            <View style={styles.likeView}>
              <Text
                style={{
                  marginRight: 3,
                  fontSize: 15,
                  color: current_user_like_status ? '#1A5CB5' : '#000',
                }}>
                {like_count <= 0 ? null : like_count}
              </Text>
              <FontAwesome
                name="thumbs-o-up"
                size={18}
                color={current_user_like_status ? '#1A5CB5' : '#000'}
              />
            </View>
            <Text
              style={{
                marginLeft: 7,
                alignSelf: 'center',
                fontSize: 18,
                color: current_user_like_status ? '#1A5CB5' : '#000',
              }}>
              Like
            </Text>
          </Button>
          <Button
            style={styles.button}
            onPress={() => navigateToQuickPost(id, null, slug, 'post')}
            accessibilityLabel="Add new post"
            accessibilityRole="button">
            <View
              style={{
                alignSelf: 'center',
                flexDirection: 'row',
                paddingTop: 3,
              }}>
              <MaterialCommunityIcons
                name="comment-outline"
                size={18}
                color="#000"
              />
            </View>
            <Text style={styles.postText}>Post</Text>
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 7,
  },
  titleStyle: {
    paddingLeft: 10,
    color: '#1A5CB5',
  },
  postText: {
    marginLeft: 7,
    alignSelf: 'center',
    fontSize: 18,
    color: '#000',
  },
  threadStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  editView: {
    flexDirection: 'row',
    width: '20%',
    justifyContent: 'space-evenly',
  },
  titleView: {
    flexDirection: 'row',
    width: '80%',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: 'transparent',
    width: '45%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    backgroundColor: '#b9b9b9',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    marginTop: 10,
    marginLeft: 15,
    borderColor: '#0078af',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossIcon: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  titles: {
    marginTop: 10,
    width: '70%',
    overflow: 'hidden',
  },
  titleText: {
    fontSize: 18,
    flexWrap: 'wrap',
    color: '#1E2121',
    marginBottom: 5,
  },
  subTitleText: {
    paddingLeft: 10,
    fontSize: 13,
    flexWrap: 'wrap',
    color: '#667A93',
  },
  threadName: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    height: 35,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  likeView: {
    alignSelf: 'center',
    flexDirection: 'row',
    paddingTop: 3,
  },
  editButton: {
    marginLeft: 20,
    width: 35,
    marginTop: 10,
    alignItems: 'center',
    height: 30,
  },
});
ThreadCard.defaultProps = {
  onLikeThread: () => {},
  navigateToQuickPost: () => {},
  navigateToThreadPost: () => {},
  editOrArchiveThread: () => {},
  route: '',
  dataRoute: '',
};

ThreadCard.propTypes = {
  item: PropTypes.object.isRequired,
  onLikeThread: PropTypes.func,
  navigateToQuickPost: PropTypes.func,
  navigateToThreadPost: PropTypes.func,
  route: PropTypes.string,
  editOrArchiveThread: PropTypes.func,
  dataRoute: PropTypes.string,
};
