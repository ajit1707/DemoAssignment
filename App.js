import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {initBugsnag} from './src/utility/bugsnag-utils';
import AppNavigator from './src/navigators/AppNavigator';
import {persistor, store} from './src/createStore';

export default class App extends Component {
  componentDidMount() {
    initBugsnag();
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    );
  }
}
// AppRegistry.registerComponent('Brightside Mentoring', () => App);
