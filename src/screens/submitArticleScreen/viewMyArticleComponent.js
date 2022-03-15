import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import Config from '../../utility/config';
import Icon from '../../utility/icons';
import Color from '../../utility/colorConstant';
import {fontMaker} from '../../utility/helper';

class ViewMyArticleList extends Component {
  navigateToArticle = () => {
    const {
      navigation: {navigate},
    } = this.props;
    navigate('ArticleList');
  };
  categoryFinder = () => {
    const {item, filteredCategories} = this.props;
    const categoryData = filteredCategories.filter(
      (data) => item.attributes.category_id === parseInt(data.id, 10),
    );
    const {title} = categoryData[0].attributes;
    return title;
  };
  render() {
    const {
      item: {
        attributes,
        attributes: {image_id, title, state},
        id,
      },
      onEditArticle,
    } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        disabled
        style={[Style.container, Style.shadow]}>
        <TouchableOpacity
          style={[Style.leftImageContainer]}
          activeOpacity={0.7}>
          <Image
            source={
              attributes
                ? image_id
                  ? {
                      uri: `${Config.IMAGE_SERVER_CDN}resize/1280x1280/${image_id}`,
                    }
                  : Icon.NO_IMAGE_AVAILABLE
                : null
            }
            style={Style.image}
          />
        </TouchableOpacity>
        <View style={Style.rightContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={[
                Style.titleText,
                {...fontMaker('semibold'), width: '90%'},
              ]}>
              {this.categoryFinder()}
            </Text>
            {state === 'flagged' && (
              <TouchableOpacity
                style={{width: '10%', alignItems: 'flex-end'}}
                onPress={() => onEditArticle(id)}>
                <MaterialIcons name="mode-edit" size={24} color="#000" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={[Style.titleText]}>{title}</Text>
          <Text
            style={[
              Style.titleText,
              {
                color:
                  state === 'rejected'
                    ? '#f76969'
                    : state === 'flagged'
                    ? '#ff8d00'
                    : '#8cc63f',
                ...fontMaker('regular'),
              },
            ]}>
            {state === 'rejected'
              ? 'Declined'
              : state === 'flagged'
              ? 'Pending'
              : 'Published'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const Style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    marginVertical: 4,
    backgroundColor: '#fff',
    width: '95%',
    alignSelf: 'center',
  },
  shadow: {
    shadowColor: Color.CHANNEL_SEPARATOR_COLOR,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  leftImageContainer: {
    width: '30%',
    paddingHorizontal: 5,
  },
  image: {
    width: '100%',
    height: 80,
    maxHeight: 80,
  },
  rightContainer: {
    width: '70%',
    paddingHorizontal: 5,
    justifyContent: 'space-evenly',
  },
  titleText: {
    color: '#000',
    fontSize: 15,
    ...fontMaker('bold'),
  },
});

ViewMyArticleList.defaultProps = {
  filteredCategories: null,
  item: {},
  navigation: null,
};

ViewMyArticleList.propTypes = {
  navigation: PropTypes.object,
  item: PropTypes.object,
  filteredCategories: PropTypes.array,
};

const mapStateToProps = (state) => ({
  fetching:
    state.logOut.fetching ||
    state.brightKnowledgeReducer.fetching ||
    state.brightKnowledgeCategoryReducer.fetching,
  getMyArticles: state.getDataForSubmitArticleReducer.getMyArticles,
  filteredCategories: state.getDataForSubmitArticleReducer.filteredCategories,
});

export default connect(mapStateToProps)(ViewMyArticleList);
