import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {testID} from '../../utility/helper';

export default function TopicCard(props) {
  const {
    navigateToSelectedTopic,
    navigateToAddTopic,
    item: {
      item,
      item: {
        attributes: {can_edit, is_active, description, name},
        id,
      },
    },
  } = props;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        accessible={false}
        activeOpacity={0.7}
        onPress={() => {
          navigateToSelectedTopic(item);
        }}>
        <View style={styles.cardView}>
          <View style={styles.topicView}>
            <Text
              accessibilityRole="link"
              style={styles.topicName}
              numberOfLines={1}>
              {item.attributes.name}
            </Text>
            <View style={styles.descriptionView} />
            <Text style={styles.topicDescription} numberOfLines={1}>
              {item.attributes.description}
            </Text>
          </View>
          {can_edit ? (
            <TouchableOpacity
              {...testID('Edit topic')}
              accessibilityRole="button"
              style={styles.editButton}
              onPress={() => {
                navigateToAddTopic(
                  'topics',
                  true,
                  is_active,
                  description,
                  name,
                  id,
                  null,
                );
              }}>
              <FontAwesome name="pencil" size={17} color="#00f" />
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 5,
    alignSelf: 'center',
  },
  descriptionView: {
    marginVertical: 5,
  },
  topicView: {
    width: '85%',
  },
  cardView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  topicName: {
    color: '#1A5CB5',
    marginTop: 10,
    fontSize: 20,
    flexWrap: 'wrap',
    textAlign: 'left',
  },
  topicDescription: {
    color: '#000',
    marginBottom: 10,
    fontSize: 17,
    flexWrap: 'wrap',
    textAlign: 'left',
  },
  editButton: {
    alignSelf: 'flex-start',
    height: 50,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

TopicCard.propTypes = {
  item: PropTypes.object,
};
