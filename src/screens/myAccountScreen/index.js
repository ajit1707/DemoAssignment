import {View, Text, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Style from './style';
import Form from '../../components/Form';
import {setSideMenuItems} from '../../modules/getProjects';
import Color from '../../utility/colorConstant';

class MyAccount extends Component {
  navigate = () => {
    this.props.navigation.goBack();
  };
  componentDidMount() {
    this.props.navigation.setParams({headerColor: '#000'});
  }

  static navigationOptions = ({navigation}) => ({
    headerStyle: {
      backgroundColor: navigation.state.params
        ? navigation.state.params.headerColor
        : Color.LOGO,
    },
  });

  render() {
    const {fetching} = this.props;
    return (
      <Form fetching={fetching}>
        <View style={Style.container}>
          <TouchableOpacity
            onPress={() => {
              this.navigate;
            }}>
            <Text>My Account</Text>
          </TouchableOpacity>
        </View>
      </Form>
    );
  }
}
const mapStateToProps = (state) => ({
  fetching: state.logOut.fetching,
  sideMenuItems: setSideMenuItems(state),
});

export default connect(mapStateToProps)(MyAccount);
