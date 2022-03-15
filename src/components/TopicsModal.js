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

class TopicsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      searching: false,
    };
  }
  onChange = (changedText) => {
    const {
      data: {data},
    } = this.props;
    const filteredSuggestions = [];
    data.forEach((suggestion) => {
      if (this.findMatch(suggestion.attributes.name, changedText)) {
        filteredSuggestions.push(suggestion);
      }
    });
    if (changedText.length > 0) {
      this.setState({searchResults: filteredSuggestions, searching: true});
    } else {
      this.setState({searchResults: [], searching: false});
    }
  };

  headerComponent = () => {
    const {onRowItemSelect, data, route} = this.props;
    return (
      <View style={styles.headerView}>
        {route === 'threads' ? (
          <View>
            <ArticleSubModal
              item={data.selectAll}
              onRowItemSelect={onRowItemSelect}
              route={route}
            />
            <View style={styles.routeView} />
          </View>
        ) : null}
        <View style={styles.searchBoxContainer}>
          <MaterialIcons name="search" size={24} color="#ccc" />
          <TextInput
            onChangeText={(changedText) => this.onChange(changedText)}
            autoCorrect
            spellCheck
            placeholder="Search"
            placeholderTextColor={Color.PLACEHOLDER}
            style={styles.searchBoxTextInput}
          />
        </View>
      </View>
    );
  };

  itemSeparator = () => <View style={styles.itemView} />;

  findMatch = (text1, text2) =>
    text1.toLowerCase().indexOf(text2.toLowerCase()) > -1;

  render() {
    const {modalVisible, showModal, headerText, onRowItemSelect} = this.props;
    const {searchResults, searching} = this.state;
    const {
      data: {data},
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
                  accessible
                  accessibilityLabel="Close select topic modal"
                  onPress={showModal}
                  style={styles.crossButtonContainer}>
                  <Image source={Icon.CROSS_ICON} style={styles.crossIcon} />
                </TouchableOpacity>
              </View>
              <FlatList
                style={styles.flatView}
                ItemSeparatorComponent={this.itemSeparator}
                data={searching ? searchResults : data}
                stickyHeaderIndices={[0]}
                ListHeaderComponent={this.headerComponent}
                extraData={this.state}
                renderItem={({item, index}) => (
                  <ArticleSubModal
                    item={item}
                    index={index}
                    showModal={showModal}
                    onRowItemSelect={onRowItemSelect}
                    route="threads"
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

TopicsModal.defaultProps = {
  modalVisible: false,
  showModal: () => {},
  onRowItemSelect: () => {},
  data: null,
  headerText: null,
  route: null,
};

TopicsModal.propTypes = {
  modalVisible: PropTypes.bool,
  showModal: PropTypes.func,
  onRowItemSelect: PropTypes.func,
  data: PropTypes.object,
  headerText: PropTypes.string,
  route: PropTypes.string,
};

const mapStateToProps = (state) => ({
  currentChannelData: state.channelMessage.currentChannelData,
  channelsPayload: state.getchannels.channelsPayload,
  userDetail: state.getUserDetail.userDetailPayload,
  allTopicsData: state.getCommunityScreenReducer.allTopicsData,
});

export default connect(mapStateToProps)(TopicsModal);
