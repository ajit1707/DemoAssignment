import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {fontMaker} from '../../utility/helper';

export default function McqAnswerComponent(props) {
  const {item, onRowItemSelect, answerIdArray, condition} = props;
  return (
    <TouchableOpacity
      accessible
      activeOpacity={0.7}
      disabled={!condition}
      onPress={() => {
        onRowItemSelect(item.id);
      }}>
      <View style={styles.rememberBox}>
        <View style={styles.leftImageContainer}>
          {!answerIdArray.includes(item.id) ? (
            <MaterialCommunityIcons
              accessible
              accessibilityLabel="unchecked checkbox"
              name="checkbox-blank-outline"
              size={24}
              color="#AAABAC"
              style={styles.vectorIcons}
            />
          ) : (
            <MaterialCommunityIcons
              accessibilityLabel="checked checkbox"
              name="checkbox-marked"
              size={24}
              color="#00f"
              style={styles.vectorIcons}
            />
          )}
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.boldTextTitle}>{item.attributes.text} </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: 17,
    paddingVertical: 4,
  },
  nameTextContainer: {
    flexDirection: 'column',
  },
  checkbox: {
    marginHorizontal: '20%',
  },
  nameText: {
    color: '#444444',
    ...fontMaker('regular'),
    fontSize: 17,
    marginLeft: 5,
  },
  vectorIcons: {
    marginTop: 2,
  },
  rememberBox: {
    width: '80%',
    flexDirection: 'row',
    marginHorizontal: 8,
    paddingVertical: 5,
  },
  leftImageContainer: {
    width: '10%',
    alignContent: 'flex-start',
  },
  rightContainer: {
    width: '90%',
    alignContent: 'flex-start',
    justifyContent: 'center',
  },
  boldTextTitle: {
    color: '#444F53',
    ...fontMaker('regular'),
    fontSize: 16,
    marginLeft: 5,
  },
});

McqAnswerComponent.defaultProps = {
  item: null,
  answerIdArray: null,
  condition: false,
};

McqAnswerComponent.propTypes = {
  item: PropTypes.object,
  answerIdArray: PropTypes.array,
  condition: PropTypes.bool,
  onRowItemSelect: PropTypes.func,
};
