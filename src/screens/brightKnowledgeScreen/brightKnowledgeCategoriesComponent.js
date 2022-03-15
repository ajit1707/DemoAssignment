import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import {TabView, TabBar} from 'react-native-tab-view';
import Config from '../../utility/config';
import Color from '../../utility/colorConstant';
import {fontMaker} from '../../utility/helper';
import {Container, HtmlRenderer} from '../../components';
import {setSideMenuItems} from '../../modules/getProjects';
import {logEventForAnalytics} from '../../utility/firebase-utils';

class BrightKnowledgeCategoriesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {key: 'first', title: 'Essentials'},
        {key: 'second', title: 'Subject'},
      ],
    };
  }

  navigateToCategoryScreen = (data) => {
    logEventForAnalytics('open_category', {});
    const {
      navigation: {navigate},
    } = this.props;
    const {id} = data;
    const {
      attributes: {slug},
    } = data;
    navigate('CategoryScreen', {
      id,
      slug,
    });
  };

  renderComponent = ({item, index}) => (
    <TouchableOpacity
      accessible={false}
      key={index.toString()}
      onPress={() => this.navigateToCategoryScreen(item)}>
      <View style={styles.componentStyle} key={index.toString()}>
        <View style={styles.ComponentViewStyle}>
          <View
            accessible
            accessibilityLabel={item.attributes.title}
            accessibilityRole="image"
            style={[
              styles.leftImageContainer,
              {backgroundColor: `#${item.attributes.color}`.toString()},
            ]}>
            <View style={styles.imageViewStyle}>
              <Image
                source={{
                  uri: `${Config.IMAGE_SERVER_CDN}${item.attributes.icon_id}`,
                }}
                style={styles.image}
              />
            </View>
          </View>
        </View>

        <View style={styles.rightContainer}>
          <Text style={styles.boldTextTitle} numberOfLines={1}>
            {item.attributes.title}
          </Text>
          <HtmlRenderer
            baseFontStyle={{...fontMaker('regular'), fontSize: 13}}
            numberOfWords={90}
            html={item.attributes.description
              .replace(/<\/p>/gim, '</div>')
              .replace(/(<p)/gim, '<div')}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  renderHeader = (props) => {
    const {sideMenuItems} = this.props;

    return (
      <TabBar
        style={{backgroundColor: '#fff'}}
        indicatorStyle={{
          backgroundColor: sideMenuItems && sideMenuItems.sideMenuColor,
        }}
        renderLabel={this.renderLabel}
        // onTabPress={this.getLabelText}
        {...props}
      />
    );
  };

  renderLabel = ({route, focused}) => {
    const {sideMenuItems} = this.props;
    return (
      <Text
        style={[
          styles.boldTextTitle,
          focused
            ? {color: sideMenuItems && sideMenuItems.sideMenuColor}
            : {opacity: 0.5, color: '#ccc'},
        ]}>
        {route.title}
      </Text>
    );
  };

  renderScene = ({route}) => {
    const {categoryPayload} = this.props;
    switch (route.key) {
      case 'first':
        return this.renderFlatList(
          categoryPayload.data && categoryPayload.data[0].data,
        );
      case 'second':
        return this.renderFlatList(
          categoryPayload.data && categoryPayload.data[1].data,
        );
      default:
        return null;
    }
  };

  renderFlatList = (categoryPayload) => (
    <FlatList
      data={categoryPayload}
      extraData={this.props}
      renderItem={this.renderComponent}
      scrollEnabled
      scrollsToTop
      keyExtractor={(item, index) => index.toString()}
    />
  );

  render() {
    return (
      <Container>
        <TabView
          swipeEnabled={false}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderHeader}
          onIndexChange={(index) => this.setState({index})}
          initialLayout={{width: Dimensions.get('window').width}}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Color.SEPARATOR_COLOR,
  },
  imageViewStyle: {
    width: 37,
    height: 37,
    borderRadius: 18.5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  ComponentViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
  },
  componentStyle: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Color.SEPARATOR_COLOR,
    paddingVertical: 10,
  },
  leftImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  rightContainer: {
    width: '70%',
    justifyContent: 'center',
    paddingTop: 3,
  },
  boldTextTitle: {
    color: '#000',
    fontSize: 14,
    marginVertical: 2,
    ...fontMaker('bold'),
  },
  titleDescription: {
    color: '#4d3a3a',
    fontSize: 11,
    ...fontMaker('regular'),
  },
});

BrightKnowledgeCategoriesComponent.defaultProps = {
  categoryPayload: null,
  sideMenuItems: null,
};

BrightKnowledgeCategoriesComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  categoryPayload: PropTypes.object,
  sideMenuItems: PropTypes.object,
};

const mapStateToProps = (state) => ({
  sideMenuItems: setSideMenuItems(state),
});

export default connect(mapStateToProps)(BrightKnowledgeCategoriesComponent);
