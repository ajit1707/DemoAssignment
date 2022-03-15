import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {fontMaker} from '../../utility/helper';

const CheckBoxMcq = (props) => {
  const {
    onRowItemSelect,
    text,
    check,
    id,
    questionDetails,
    index,
    mainIndex,
  } = props;
  const questionId = questionDetails.id;
  const type = questionDetails.type;
  const ref = questionDetails.ref;
  const options = questionDetails.properties.choices;
  const length = questionDetails.properties.choices.length;
  const multipleSelection = questionDetails.properties.allow_multiple_selection;
  return (
    <React.Fragment>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.itemContainer}
        onPress={() =>
          onRowItemSelect(
            id,
            questionId,
            multipleSelection,
            length,
            ref,
            index,
            type,
            options,
            mainIndex,
            text,
            check,
          )
        }
        {...props}>
        {!check ? (
          <MaterialCommunityIcons
            name="checkbox-blank-outline"
            size={24}
            color="#ccc"
          />
        ) : (
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={24}
            color="#00f"
          />
        )}
        <View
          style={{flexDirection: 'column', paddingHorizontal: 15}}
          accessibilityLabel={`${text} checkbox ${
            check ? 'checked' : 'unchecked'
          }`}>
          <Text style={[styles.nameText, props.labelTextStyle]}>{text}</Text>
        </View>
      </TouchableOpacity>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 17,
  },
  nameText: {
    color: '#444444',
    ...fontMaker('regular'),
    fontSize: 17,
  },
});

export default CheckBoxMcq;
