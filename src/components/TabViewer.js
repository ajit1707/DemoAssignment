import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {TabView} from 'react-native-tab-view';

export default class TabViewer extends Component {
  constructor(props) {
    super();
    this.state = {
      index: 0,
      routes: [
        {key: 'first', title: props.title1},
        {key: 'second', title: props.title2},
      ],
    };
  }

  renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return this.props.page1;
      case 'second':
        return this.props.page2;
      default:
        return null;
    }
  };
  render() {
    return (
      <TabView
        swipeEnabled={false}
        navigationState={this.state}
        renderScene={this.renderScene}
        onIndexChange={(index) => this.setState({index})}
        initialLayout={{width: Dimensions.get('window').width}}
      />
    );
  }
}
