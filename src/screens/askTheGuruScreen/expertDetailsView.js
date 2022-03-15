import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {Container} from '../../components';
import AskTheGuru from './askTheGuru';

class ExpertDetailsScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.title && navigation.state.params.title,
  });
  componentDidMount() {
    const {
      navigation: {
        state: {
          params: {expertTitle},
        },
        setParams,
      },
    } = this.props;
    setParams({title: `Featured ${expertTitle}`});
  }
  render() {
    const {
      navigation: {
        state: {
          params: {item, route},
        },
      },
      getAskGraduateDetailsPayload: {
        data: [
          {
            attributes: {responsible_mail: responsibleMail},
          },
        ],
      },
    } = this.props;
    return (
      <Container>
        <View style={{flex: 1}}>
          <AskTheGuru
            guru={item}
            responsibleMail={responsibleMail}
            featuredOn
          />
        </View>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
  },
});

ExpertDetailsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  getAskGraduateDetailsPayload: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  getAskGraduateDetailsPayload:
    state.askGraduateCardReducer.getAskGraduateDetailsPayload,
});

export default connect(mapStateToProps)(ExpertDetailsScreen);
