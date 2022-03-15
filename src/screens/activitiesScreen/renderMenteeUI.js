import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Style from './style';
import ActivitiesCard from './activitiesCard';
import {PaginationSpinner} from '../../components';
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class RenderMenteeUI extends PureComponent {
  render() {
    const {
      refreshing,
      onEndReached,
      paginationSpinner,
      fetching,
      activities,
      projectUserActivityPayload,
      categories,
      onRefresh,
      ItemSeparatorComponent,
      navigateToQuestionScreen,
    } = this.props;
    return (
      <View style={[Style.container, Style.viewMarginBottom]}>
        {activities &&
        activities.length > 0 &&
        projectUserActivityPayload &&
        categories ? (
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={Style.flexStyle}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={ItemSeparatorComponent}
            data={activities}
            extraData={this.props}
            renderItem={({item, index}) => (
              <ActivitiesCard
                item={item}
                index={index}
                navigateToQuestionScreen={navigateToQuestionScreen}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              <PaginationSpinner animating={paginationSpinner} />
            }
          />
        ) : !fetching &&
          !refreshing &&
          (!activities || activities.length === 0) ? (
          <View style={Style.noActivites}>
            <Text style={Style.noActivitesMessage}>
              No Activities Assigned Yet..
            </Text>
            <Text style={Style.message}>
              Assigned activities will be displayed here.
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}
RenderMenteeUI.defaultProps = {
  activities: null,
  categories: null,
  projectUserActivityPayload: null,
  fetching: false,
};

RenderMenteeUI.propTypes = {
  fetching: PropTypes.bool,
  categories: PropTypes.object,
  activities: PropTypes.array,
  projectUserActivityPayload: PropTypes.object,
};
const mapStateToProps = (state) => ({
  fetching: state.menteeActivities.fetching,
  activities: state.menteeActivities.activities,
  menteeDataPageNumber: state.menteeActivities.menteeDataPageNumber,
  categories: state.menteeActivities.categories,
  projectUserActivityPayload: state.menteeActivities.projectUserActivityPayload,
});
export default connect(mapStateToProps)(RenderMenteeUI);
