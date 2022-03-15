import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {fontMaker} from '../../utility/helper';
import Color from '../../utility/colorConstant';
import Icon from '../../utility/icons';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const borderRadius = 10;

const AgreementModal = (props) => {
  const {
    modalVisible,
    agreementPayload,
    handleLinkPress,
    onAgreementModalPress,
  } = props;
  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => {}}>
      <View
        onStartShouldSetResponder={() => {
          onAgreementModalPress();
        }}
        style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            accessible
            accessibilityLabel="Close"
            accessibilityRole="button"
            onPress={onAgreementModalPress}
            style={styles.crossButtonContainer}>
            <Image source={Icon.CROSS_ICON} style={styles.crossIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalSubContainer}>
          <FlatList
            data={agreementPayload}
            renderItem={({item}) => (
              <TouchableOpacity
                key={item.agreementName}
                accessibilityLabel={item.agreementName}
                accessibilityRole="button"
                activeOpacity={0.9}
                style={styles.buttonContainer}
                onPress={() => {
                  handleLinkPress(item.key);
                }}>
                <Text style={styles.agreementText}>{item.agreementName}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.agreementName}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  crossButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    paddingLeft: 163,
  },
  crossIcon: {
    height: 13,
    width: 13,
  },
  header: {
    height: 30,
    width: deviceWidth * 0.6,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //flexDirection: 'row',
    //borderBottomColor: Color.CHANNEL_SEPARATOR_COLOR,
    //borderBottomWidth: 0.5,
    backgroundColor: '#fff',
  },
  modalSubContainer: {
    paddingVertical: 10,
    width: '60%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
  },
  buttonContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    height: 25,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  agreementText: {
    fontSize: 16,
    color: '#000',
    ...fontMaker('semibold'),
  },
});

AgreementModal.defaultProps = {
  modalVisible: false,
  agreementPayload: [],
  handleLinkPress: () => {},
  onAgreementModalPress: () => {},
};

AgreementModal.propTypes = {
  modalVisible: PropTypes.bool,
  agreementPayload: PropTypes.array,
  handleLinkPress: PropTypes.func,
  onAgreementModalPress: PropTypes.func,
};

export default AgreementModal;
