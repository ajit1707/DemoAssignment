import React, {Component} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import Icon from '../utility/icons';
import Color from '../utility/colorConstant';
import ArticleSubModal from './ArticleSubModalComponent';
import styles from './Styles';

class ArticleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }
  onChange = (changedText) => {
    const {data} = this.props;
    const filteredSuggestions = [];
    data.forEach((suggestion) => {
      if (this.findMatch(suggestion.attributes.title, changedText)) {
        filteredSuggestions.push(suggestion);
      }
    });
    if (changedText.length > 0) {
      this.setState({data: filteredSuggestions});
    } else {
      this.setState({data});
    }
  };
  headerComponent = () => {
    const {
      onRowItemSelect,
      submitArticleCategories: {selectAll},
      route,
    } = this.props;
    return (
      <View style={styles.subCategoriesView}>
        {route === 'subCategories' ? (
          <View>
            <ArticleSubModal
              item={selectAll}
              onRowItemSelect={onRowItemSelect}
            />
            <View style={styles.articleSubModalView} />
          </View>
        ) : null}
        <View style={styles.searchBoxContainer}>
          <MaterialIcons name="search" size={24} color="#ccc" />
          <TextInput
            ref={(input) => {
              this.textInput = input;
            }}
            onChangeText={(changedText) => this.onChange(changedText)}
            placeholder="Search"
            spellCheck
            autoCorrect
            placeholderTextColor={Color.PLACEHOLDER}
            style={styles.searchBoxTextInput}
          />
        </View>
      </View>
    );
  };

  itemSeparator = () => <View style={styles.itemSeparatorView} />;

  findMatch = (text1, text2) =>
    text1.toLowerCase().indexOf(text2.toLowerCase()) > -1;

  render() {
    const {
      modalVisible,
      showModal,
      headerText,
      onRowItemSelect,
      route,
    } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {}}>
        <View style={styles.modalViewContainer}>
          <KeyboardAvoidingView>
            <View style={styles.modalSubView}>
              <View style={styles.header}>
                <Text numberOfLines={1} style={styles.headerText}>
                  {headerText}
                </Text>
                <TouchableOpacity
                  onPress={showModal}
                  style={styles.crossButtonContainer}>
                  <Image source={Icon.CROSS_ICON} style={styles.crossIcon} />
                </TouchableOpacity>
              </View>
              <FlatList
                style={styles.flatListContainerView}
                ref={(ref) => {
                  this.flatListRef = ref;
                }}
                ItemSeparatorComponent={this.itemSeparator}
                data={this.state.data}
                stickyHeaderIndices={[0]}
                ListHeaderComponent={this.headerComponent}
                extraData={this.props}
                renderItem={({item, index}) => (
                  <ArticleSubModal
                    item={item}
                    index={index}
                    showModal={showModal}
                    onRowItemSelect={onRowItemSelect}
                    route={route}
                  />
                )}
                bounces={false}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }
}

ArticleModal.defaultProps = {
  modalVisible: false,
  showModal: () => {},
  data: null,
};

ArticleModal.propTypes = {
  modalVisible: PropTypes.bool,
  showModal: PropTypes.func,
  data: PropTypes.array,
};

const mapStateToProps = (state) => ({
  currentChannelData: state.channelMessage.currentChannelData,
  channelsPayload: state.getchannels.channelsPayload,
  userDetail: state.getUserDetail.userDetailPayload,
  submitArticleCategories:
    state.getDataForSubmitArticleReducer.submitArticleCategories,
});

export default connect(mapStateToProps)(ArticleModal);
