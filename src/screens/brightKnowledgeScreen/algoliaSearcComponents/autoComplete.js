import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {connectAutoComplete} from 'react-instantsearch-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {fontMaker} from '../../../utility/helper';
import Constant from '../../../utility/colorConstant';
import {Highlight} from './Highlight';
import Config from '../../../utility/config';
import Icon from '../../../utility/icons';

class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFlatList: false,
    };
  }

  onChange = (changedText) => {
    const {refine, checkSearchArticle} = this.props;
    let showFlatList = false;
    if (changedText) {
      showFlatList = true;
    }
    this.setState({showFlatList}, () => {
      refine(changedText);
      checkSearchArticle(changedText);
    });
  };

  noItemDisplay = () => (
    <View style={styles.displayStyle}>
      <Text style={styles.noResultFound}>No result found</Text>
    </View>
  );

  render() {
    const {hits, searchBarRef, onItemPress} = this.props;
    return (
      <React.Fragment>
        <View style={styles.searchBoxContainer}>
          <MaterialIcons
            accessibilityLabel="Search icon"
            name="search"
            size={24}
            color="#ccc"
          />
          <TextInput
            ref={searchBarRef}
            spellCheck
            autoCorrect
            onChangeText={(changedText) => this.onChange(changedText)}
            placeholder="Search"
            placeholderTextColor={Constant.PLACEHOLDER}
            style={styles.searchBoxTextInput}
          />
        </View>
        {this.state.showFlatList && (
          <View
            style={[
              styles.flatListContainer,
              hits.length === 0 && {
                paddingVertical: 10,
                backgroundColor: Constant.BK_BACKGROUND,
              },
            ]}>
            <FlatList
              data={hits}
              extraData={this.props}
              renderItem={({item}) => (
                <View style={styles.item}>
                  <TouchableOpacity
                    style={styles.touchableStyle}
                    onPress={() => onItemPress(item)}>
                    <View style={styles.viewStyle}>
                      <Image
                        style={styles.imageStyle}
                        source={
                          item.image_id || item.icon_id
                            ? {
                                uri: `${Config.IMAGE_SERVER_CDN}/${
                                  item.image_id ? item.image_id : item.icon_id
                                }`,
                              }
                            : Icon.NO_IMAGE_AVAILABLE
                        }
                      />
                    </View>
                    <Highlight
                      attribute="title"
                      hit={item}
                      highlightProperty="_highlightResult"
                    />
                  </TouchableOpacity>
                </View>
              )}
              bounces={false}
              scrollEnabled
              scrollsToTop
              ListEmptyComponent={this.noItemDisplay}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
      </React.Fragment>
    );
  }
}
AutoComplete.defaultProps = {
  hits: null,
  searchBarRef: () => {},
  onItemPress: () => {},
};
AutoComplete.propTypes = {
  hits: PropTypes.array,
  checkSearchArticle: PropTypes.func.isRequired,
  refine: PropTypes.func.isRequired,
  searchBarRef: PropTypes.func,
  onItemPress: PropTypes.func,
};

const styles = StyleSheet.create({
  containerStyles: {
    width: '100%',
    backgroundColor: 'white',
  },
  touchableStyle: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  displayStyle: {
    alignItems: 'center',
  },
  viewStyle: {
    width: '25%',
  },
  imageStyle: {
    height: 50,
    width: 75,
    backgroundColor: '#ccc',
  },
  searchBoxContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50,
    borderRadius: 0.5,
    borderTopWidth: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    width: '100%',
    paddingLeft: '4%',
    flexDirection: 'row',
  },
  searchBoxTextInput: {
    fontSize: 16,
    color: '#000',
    paddingLeft: '3%',
    transform: [{scaleX: 1.0086}],
    ...fontMaker('regular'),
    width: '90%',
  },
  noResultFound: {
    fontSize: 15,
    color: '#000',
    transform: [{scaleX: 1.0086}],
    ...fontMaker('regular'),
  },
  flatListContainer: {
    backgroundColor: '#fff',
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  item: {
    padding: 10,
    flexDirection: 'column',
  },
  titleText: {
    fontWeight: 'bold',
  },
});

export default connectAutoComplete(AutoComplete);
