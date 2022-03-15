import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {InstantSearch, Configure} from 'react-instantsearch-native';
import algoliasearch from 'algoliasearch/reactnative';
import Config from '../../../utility/config';
import AutoComplete from './autoComplete';

const searchClient = algoliasearch(
  '8758NK3Q5J',
  '42de53ec239658462a11a8a4cb2684ff',
);
class AlgoliaSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchState: {},
    };
  }

  onSearchStateChange = (searchState) =>
    this.setState(() => ({
      searchState,
    }));

  render() {
    const {
      value,
      checkSearchArticle,
      isArticleSearched,
      searchBarRef,
      onItemPress,
    } = this.props;

    return (
      <View style={[!isArticleSearched ? {height: 50} : styles.mainContainer]}>
        <InstantSearch
          searchClient={searchClient}
          indexName={
            value === 'Featured Articles'
              ? Config.ALGOLIA_FEATURED_ARTICLE_OPTION.INDEX_NAME
              : Config.ALGOLIA_CATEGORY_OPTION.INDEX_NAME
          }
          onSearchStateChange={this.onSearchStateChange}
          searchState={this.state.searchState}>
          <Configure hitsPerPage={10} />
          <AutoComplete
            searchBarRef={searchBarRef}
            checkSearchArticle={(text) => checkSearchArticle(text)}
            onItemPress={(item) => onItemPress(item)}
            {...this.props}
          />
        </InstantSearch>
      </View>
    );
  }
}
AlgoliaSearchBar.defaultProps = {
  value: '',
  searchBarRef: () => {},
  onItemPress: () => {},
};

AlgoliaSearchBar.propTypes = {
  checkSearchArticle: PropTypes.func.isRequired,
  value: PropTypes.string,
  isArticleSearched: PropTypes.bool.isRequired,
  searchBarRef: PropTypes.func,
  onItemPress: PropTypes.func,
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginBottom: 100,
  },
});
const mapStateToProps = (state) => ({
  fetching:
    state.logOut.fetching ||
    state.brightKnowledgeReducer.fetching ||
    state.brightKnowledgeCategoryReducer.fetching,
  brightKnowledgePayload: state.brightKnowledgeReducer.brightKnowledgePayload,
  searchPayload: state.algoliaSearch.searchPayload,
  categorySearchPayload: state.algoliaSearch.categorySearchPayload,
});

export default connect(mapStateToProps)(AlgoliaSearchBar);
