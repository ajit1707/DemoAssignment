import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {connectHighlight} from 'react-instantsearch-native';
import {fontMaker} from '../../../utility/helper';

export const Highlight = connectHighlight(({highlight, attribute, hit}) => {
  const parsedHit = highlight({
    attribute,
    hit,
    highlightProperty: '_highlightResult',
  });
  const highlightedHit = parsedHit.map((part, index) => {
    if (part.isHighlighted) {
      return (
        <Text
          key={index.toString()}
          style={[styles.searchBoxTextInput, styles.searchTextBold]}>
          {part.value}
        </Text>
      );
    }
    return part.value;
  });

  return <Text style={styles.searchBoxTextInput}>{highlightedHit}</Text>;
});

const styles = StyleSheet.create({
  searchBoxTextInput: {
    fontSize: 16,
    color: '#000',
    transform: [{scaleX: 1.0086}],
    ...fontMaker('regular'),
    width: '70%',
    paddingRight: 9,
  },
  searchTextBold: {
    ...fontMaker('bold'),
  },
});
