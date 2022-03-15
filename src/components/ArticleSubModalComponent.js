import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {fontMaker} from '../utility/helper';

export default function ArticleSubModalComponent(props) {
  const {item, index, onRowItemSelect, route} = props;
  return (
    <React.Fragment>
      <TouchableOpacity
        accessible
        accessibilityLabel={`${
          route === 'threads' ? item.attributes.name : item.attributes.title
        }`}
        activeOpacity={0.6}
        style={styles.itemContainer}
        onPress={() =>
          onRowItemSelect(
            item.id,
            index,
            route === 'threads' ? item.attributes.name : item.attributes.title,
            item.isChecked,
          )
        }>
        {!item.isChecked ? (
          <MaterialCommunityIcons
            accessible
            accessibilityLabel={'unchecked '}
            name="checkbox-blank-outline"
            size={24}
            color="#ccc"
          />
        ) : (
          <MaterialCommunityIcons
            accessibilityLabel={'checked '}
            name="checkbox-marked"
            size={24}
            color="#00f"
          />
        )}
        <View style={styles.articleSubModalContainer}>
          <Text style={styles.nameText}>
            {route === 'threads' ? item.attributes.name : item.attributes.title}
          </Text>
        </View>
      </TouchableOpacity>
    </React.Fragment>
  );
}

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
  subModalContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 17,
  },
  subModalnameText: {
    color: '#444444',
    ...fontMaker('regular'),
    fontSize: 17,
  },
  articleSubModalContainer: {
    flexDirection: 'column',
    paddingHorizontal: 15,
  },
});

ArticleSubModalComponent.defaultProps = {
  modalVisible: false,
  showModal: () => {},
};

ArticleSubModalComponent.propTypes = {
  modalVisible: PropTypes.bool,
  showModal: PropTypes.func,
};
