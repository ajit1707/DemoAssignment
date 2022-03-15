import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {projectSwitcher} from '../../modules/getProjects';
import Style from './style';
import Constant from '../../utility/constant';
import {socketLeaveChannel} from '../../utility/phoenix-utils';

class ProjectList extends Component {
  switchProject = (item) => {
    const {
      dispatch,
      networkState: {isConnected},
    } = this.props;
    if (isConnected) {
      AsyncStorage.setItem(
        Constant.ASYNC_KEYS.PROJECT_SWITCHER_DATA,
        JSON.stringify(item.item),
      );
      socketLeaveChannel();
      return dispatch(projectSwitcher());
    }
    return Toast.showWithGravity('You are offline', Toast.SHORT, Toast.BOTTOM);
  };

  render() {
    const {isActiveList, projectListPayload} = this.props;
    return (
      <React.Fragment>
        {projectListPayload.length !== 0 && (
          <TouchableOpacity
            onPress={() => {
              this.switchProject(projectListPayload);
            }}
            activeOpacity={0.7}
            disabled={!isActiveList}
            accessible={false}
            style={Style.flatListContainer}>
            <View
              style={[
                Style.circleContainer,
                {
                  backgroundColor:
                    projectListPayload.item.attributes.primary_color,
                },
              ]}
              accessible
              accessibilityLabel={`${projectListPayload.item.attributes.display_name} icon`}>
              <Text style={Style.innerCircleText}>
                {projectListPayload.item.attributes.display_name.charAt(0)}{' '}
              </Text>
            </View>
            <Text numberOfLines={2} style={Style.projectListText}>
              {`${projectListPayload.item.attributes.name}: ${projectListPayload.item.attributes.display_name}`}
            </Text>
          </TouchableOpacity>
        )}
      </React.Fragment>
    );
  }
}

ProjectList.defaultProps = {
  projectListPayload: null,
};

ProjectList.propTypes = {
  projectListPayload: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  isActiveList: PropTypes.bool.isRequired,
  networkState: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  networkState: state.checkNetwork.isConnected,
});

export default connect(mapStateToProps)(ProjectList);
