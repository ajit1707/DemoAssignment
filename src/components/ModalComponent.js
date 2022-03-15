import React, {PureComponent} from 'react';
import {Modal, View, Dimensions, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const borderRadius = 10;

class ModalComponent extends PureComponent {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const {modalVisible, children} = this.props;
    return (
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {}}>
        <View style={styles.modalViewContainer}>
          <View style={styles.modalSubView}>{children}</View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSubView: {
    height: deviceHeight * 0.7,
    width: deviceWidth * 0.9,
    borderRadius,
    backgroundColor: '#fff',
  },
});

ModalComponent.defaultProps = {
  modalVisible: false,
  children: null,
};

ModalComponent.propTypes = {
  modalVisible: PropTypes.bool,
  children: PropTypes.node,
};

export default ModalComponent;
