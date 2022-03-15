import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {Button} from '../../components';
import Icon from '../../utility/icons';
import Config from '../../utility/config';
import {fontMaker} from '../../utility/helper';
import LinearGradientBackground from '../../components/LinearGradient';
import {setSideMenuItems} from '../../modules/getProjects';
import Constant from '../../utility/constant';

const deviceWidth = Dimensions.get('window').width;

class ActivitiesCard extends PureComponent {
  capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  render() {
    const {
      item: {
        attributes: {category_ids, cover_text, image_id, title},
      },
      item,
      categories,
      projectUserActivityPayload,
      navigateToQuestionScreen,
      userDetail,
      projectSessionPayload,
      selectedProjectPayload,
      archivedCheck,
    } = this.props;
    const id = parseInt(item.id, 10);
    let state = 'unstarted';
    let completed = false;
    let isProjectArchived = false;
    let archivedMessage = Constant.ARCHIVED_PROJECT;
    if (
      projectSessionPayload &&
      projectSessionPayload.data &&
      projectSessionPayload.data.length &&
      projectSessionPayload.data[0].attributes.is_archived === true
    ) {
      isProjectArchived = projectSessionPayload.data[0].attributes.is_archived;
    }
    if (
      selectedProjectPayload &&
      selectedProjectPayload.data &&
      selectedProjectPayload.data.attributes.is_archived === true
    ) {
      isProjectArchived = selectedProjectPayload.data.attributes.is_archived;
    }
    if (
      userDetail &&
      userDetail.data &&
      userDetail.data.length &&
      userDetail.data[0].attributes &&
      userDetail.data[0].attributes.is_archived === true
    ) {
      isProjectArchived = userDetail.data[0].attributes.is_archived;
      archivedMessage = Constant.USER_ARCHIVED;
    }
    if (
      (userDetail &&
        userDetail.data &&
        userDetail.data.length &&
        userDetail.data[0].attributes &&
        userDetail.data[0].attributes.is_archived === true &&
        selectedProjectPayload &&
        selectedProjectPayload.data &&
        selectedProjectPayload.data.attributes &&
        selectedProjectPayload.data.attributes.is_archived === true) ||
      (projectSessionPayload &&
        projectSessionPayload.data &&
        projectSessionPayload.data.length &&
        projectSessionPayload.data[0].attributes &&
        projectSessionPayload.data[0].attributes.is_archived === true)
    ) {
      archivedMessage = Constant.ARCHIVED_PROJECT;
    }
    if (projectUserActivityPayload[id]) {
      state = projectUserActivityPayload[id].state;
      completed = projectUserActivityPayload[id].completed;
    }
    let imageId = null;
    const showImageCondition =
      image_id && !completed && (state !== 'flagged' || state !== 'completed');
    const showStateCondition =
      projectUserActivityPayload[id] &&
      state !== 'started' &&
      state !== 'unstarted' &&
      state !== 'flagged';
    const buttonText =
      !projectUserActivityPayload[id] || state === 'unstarted'
        ? 'Do activity'
        : state === 'started'
        ? 'Complete activity'
        : state === 'rejected'
        ? 'Review answer'
        : 'See answers';
    if (showImageCondition) {
      imageId = image_id;
    }
    return (
      <View
        style={[
          styles.container,
          state === 'rejected' ? {borderColor: 'red'} : null,
        ]}>
        <LinearGradientBackground
          colors={
            !projectUserActivityPayload[id] || state === 'unstarted'
              ? ['#025b9e', '#28e9d9']
              : state !== 'started'
              ? ['#000046', '#1cb5e0']
              : ['#999', '#000']
          }
          useAngle
          angle={90}
          angleCenter={{x: 0.5, y: 0.5}}>
          <ImageBackground
            source={Icon.WHITE_DIAMOND_IMAGE}
            style={styles.imageBackground}
            resizeMode="cover">
            <ImageBackground
              accessibilityLabel={showImageCondition ? 'Activity' : 'No'}
              accessibilityRole="image"
              accessible
              style={[
                styles.innerImageBackground,
                showImageCondition
                  ? styles.imageBackgroundTrue
                  : styles.imageBackgroundFalse,
              ]}
              imageStyle={[{opacity: 0.4}]}
              source={
                showImageCondition
                  ? {uri: `${Config.IMAGE_SERVER_CDN}/${imageId}`}
                  : imageId
              }>
              <View style={styles.categoryTitleTextView}>
                <Text style={[styles.categoryText, styles.categoryTitle]}>
                  {category_ids.map((catId, index) => {
                    if (index === 2) {
                      const numHiddenGroups = Math.max(
                        category_ids.length - index,
                        0,
                      );
                      return (
                        <Text style={[styles.categoryText]}>
                          and {numHiddenGroups} more.
                        </Text>
                      );
                    }
                    if (index > 2) {
                      return null;
                    }
                    return category_ids.length > 1
                      ? `${categories[catId]}, `
                      : categories[catId];
                  })}
                </Text>
              </View>
              <Text
                numberOfLines={2}
                style={[
                  styles.categoryText,
                  styles.titleText,
                  image_id && styles.inlineImageText,
                  styles.titleWidth,
                ]}>
                {title}
              </Text>
            </ImageBackground>
            {showStateCondition && (
              <Text
                style={[styles.categoryText, styles.showStateConditionView]}>
                {this.capitalizeFirstLetter(state)}
              </Text>
            )}
            <Text
              style={[
                styles.categoryText,
                styles.titleText,
                !showStateCondition
                  ? styles.showStateConditionFalse
                  : styles.showStateConditionTrue,
              ]}
              numberOfLines={4}>
              {cover_text}
            </Text>
            <View style={styles.button_Text}>
              <Button
                accessible
                accessibilityLabel={`${buttonText}`}
                accessibilityRole="button"
                style={[
                  styles.doActivityButton,
                  state === 'rejected' ? styles.rejected : styles.unRejected,
                ]}
                onPress={() =>
                  archivedCheck(
                    id,
                    isProjectArchived,
                    buttonText,
                    archivedMessage,
                  )
                }>
                <Text
                  style={[
                    styles.categoryText_button,
                    state === 'rejected' && styles.rejectedText,
                  ]}>
                  {buttonText}
                </Text>
              </Button>
            </View>
          </ImageBackground>
        </LinearGradientBackground>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  categories: state.menteeActivities.categories,
  projectUserActivityPayload: state.menteeActivities.projectUserActivityPayload,
  userDetail: state.getUserDetail.userDetailPayload,
  projectSessionPayload: state.getProjects.projectSessionPayload,
  selectedProjectPayload:
    state.getSelectedProjectReducer.selectedProjectPayload,
});

const styles = StyleSheet.create({
  container: {
    width: deviceWidth * 0.93,
    backgroundColor: '#ccc',
    marginTop: deviceWidth * 0.035,
    borderWidth: 1,
    borderColor: '#000',
    alignSelf: 'center',
    flexGrow: 1,
    height: 500,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  categoryText: {
    marginVertical: 10,
    fontSize: 18,
    color: '#fff',
    ...fontMaker('semi-bold'),
  },
  categoryText_button: {
    marginVertical: 10,
    fontSize: 18,
    color: '#55801c',
    ...fontMaker('semi-bold'),
  },
  doActivityButton: {
    borderWidth: 1,
    alignSelf: 'center',
    width: '70%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  innerImageBackground: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
  },
  categoryTitleTextView: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#fff',
    width: '100%',
  },
  titleText: {
    paddingLeft: 15,
    alignSelf: 'flex-start',
    flex: 1,
  },
  inlineImageText: {
    height: '15%',
  },
  categoryTitle: {
    paddingLeft: 15,
  },
  button_Text: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  rejected: {
    borderColor: '#f00',
    backgroundColor: '#fff',
  },
  unRejected: {
    borderColor: '#55801c',
  },
  rejectedText: {
    color: '#f00',
  },
  showStateConditionFalse: {
    height: '29%',
  },
  showStateConditionTrue: {
    height: '15%',
  },
  showStateConditionView: {
    height: '10%',
    alignSelf: 'center',
  },
  titleWidth: {
    width: '100%',
  },
  imageBackgroundTrue: {
    height: '45%',
  },
  imageBackgroundFalse: {
    height: '35%',
  },
});
ActivitiesCard.defaultProps = {
  categories: null,
  projectUserActivityPayload: null,
};

ActivitiesCard.propTypes = {
  item: PropTypes.object.isRequired,
  categories: PropTypes.object,
  projectUserActivityPayload: PropTypes.object,
  navigateToQuestionScreen: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(ActivitiesCard);
