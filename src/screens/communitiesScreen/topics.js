import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FlatList, StyleSheet, Text, View, RefreshControl} from 'react-native';
import PropTypes from 'prop-types';
import ActionButton from 'react-native-action-button';
import {Container, PaginationSpinner} from '../../components';
import {
  getTopics,
  getAllTopics,
  clearPayload,
} from '../../modules/communityScreen';
import TopicCard from './topicCard';
import NoDataFound from '../../components/NoDataFound';
import Style from './style';
import {getProjects} from '../../modules/getProjects';
import {getSelectedProject} from '../../modules/getSelectedProject';
import {getUserDetails} from '../../modules/getUserDetail';

class Topics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enableLazyLoading: false,
      paginationSpinner: false,
      refreshing: false,
    };
  }

  onMomentumScrollBegin = () => {
    if (!this.state.enableLazyLoading) {
      this.setState({enableLazyLoading: true});
    }
  };

  onEndReached = () => {
    const {enableLazyLoading, paginationSpinner, refreshing} = this.state;
    const {dispatch, topics, pageNumber} = this.props;
    if (enableLazyLoading && !paginationSpinner && !refreshing) {
      if ((pageNumber - 1) * 10 <= topics.meta.record_count) {
        this.setState(
          {
            paginationSpinner: true,
          },
          () =>
            dispatch(getTopics(pageNumber)).then(() => {
              this.setState({
                paginationSpinner: false,
                enableLazyLoading: false,
              });
            }),
        );
      }
    }
  };
  onRefresh = () => {
    const {dispatch} = this.props;
    this.setState({refreshing: true}, () => {
      dispatch(clearPayload('addTopic'));
      dispatch(getProjects());
      dispatch(getSelectedProject());
      dispatch(getUserDetails());
      dispatch(getTopics(1)).then(() => {
        dispatch(getAllTopics()).then(() => {
          this.setState({refreshing: false});
        });
      });
    });
  };

  render() {
    const {
      navigateToSelectedTopic,
      navigateToAddTopic,
      topics,
      userDetailPayload: {
        included: [
          {
            attributes: {super_admin},
            attributes,
          },
        ],
      },
      fetching,
    } = this.props;
    const {paginationSpinner, refreshing} = this.state;
    return (
      <Container
        fetching={fetching && !paginationSpinner && !refreshing}
        isTabBar
        accessible={false}>
        <View style={styles.container}>
          {topics && topics.data.length > 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              data={topics.data}
              extraData={this.props}
              renderItem={(item) => (
                <TopicCard
                  item={item}
                  navigateToSelectedTopic={navigateToSelectedTopic}
                  navigateToAddTopic={navigateToAddTopic}
                />
              )}
              removeClippedSubviews
              keyExtractor={(data, dataIndex) => dataIndex.toString()}
              ListFooterComponent={
                <PaginationSpinner animating={this.state.paginationSpinner} />
              }
              onScroll={this.onMomentumScrollBegin}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={0.1}
            />
          ) : !fetching && topics ? (
            <Text style={Style.noDataFound}>Sorry, no topics available</Text>
          ) : null}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e5e5',
    // justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
});

Topics.propTypes = {
  navigateToSelectedTopic: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  fetching: state.getCommunityScreenReducer.fetching,
  topics: state.getCommunityScreenReducer.topics,
  pageNumber: state.getCommunityScreenReducer.pageNumber,
  userDetailPayload: state.getUserDetail.userDetailPayload,
});
export default connect(mapStateToProps)(Topics);
