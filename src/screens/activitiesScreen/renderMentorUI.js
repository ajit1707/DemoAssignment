import React, {PureComponent} from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Style from './style';
import {PaginationSpinner} from '../../components';
import {connect} from 'react-redux';
import MentorActivitiesCard from './mentorActivitiesCard';
import PropTypes from 'prop-types';

class RenderMentorUI extends PureComponent {
  render() {
    const {
      onRefresh,
      onEndReached,
      navigateToQuestionScreen,
      ItemSeparatorComponent,
      activitiesMentor,
      fetching,
      projectUserMentorActivityPayload,
      paginationSpinner,
      refreshing,
    } = this.props;
    return (
      <View style={[Style.container, Style.mentorBackground]}>
        {activitiesMentor &&
        activitiesMentor.length > 0 &&
        projectUserMentorActivityPayload ? (
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={Style.flexStyle}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={ItemSeparatorComponent}
            data={activitiesMentor}
            extraData={this.props}
            renderItem={({item, index}) => (
              <MentorActivitiesCard
                item={item}
                index={index}
                navigateToQuestionScreen={navigateToQuestionScreen}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              <PaginationSpinner animating={paginationSpinner} />
            }
          />
        ) : !fetching && !refreshing && activitiesMentor.length === 0 ? (
          <View style={Style.noActivites}>
            <Text style={Style.noActivitesMessage}>No records found</Text>
          </View>
        ) : null}
      </View>
    );
  }
}
RenderMentorUI.defaultProps = {
  activitiesMentor: null,
  projectUserMentorActivityPayload: null,
  fetching: false,
};

RenderMentorUI.propTypes = {
  fetching: PropTypes.bool,
  activitiesMentor: PropTypes.array,
  projectUserMentorActivityPayload: PropTypes.object,
  navigateToQuestionScreen: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  fetching: state.mentorActivities.fetching,
  activitiesMentor: state.mentorActivities.activitiesMentor,
  projectUserMentorActivityPayload:
    state.mentorActivities.projectUserMentorActivityPayload,
  mentorDataPageNumber: state.mentorActivities.mentorDataPageNumber,
  mentorRecordCount: state.mentorActivities.mentorRecordCount,
});
export default connect(mapStateToProps)(RenderMentorUI);
