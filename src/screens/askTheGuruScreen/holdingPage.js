import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {connect} from 'react-redux';
import HtmlRenderer from '../../components/HtmlRenderer';
import Config from '../../utility/config';
import {Container} from '../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

class HoldingPage extends Component {
  render() {
    const {
      getAskGraduateDetailsPayload: {
        data: [
          {
            attributes: {
              holding_title: holdingTitle,
              holding_text: holdingText,
              holding_image_id,
            },
          },
        ],
      },
    } = this.props;
    const holdingImage = holding_image_id
      ? {uri: `${Config.IMAGE_SERVER_CDN}resize/2000x2000/${holding_image_id}`}
      : null;
    return (
      <Container>
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <Text style={styles.holdingTitle}>{holdingTitle}</Text>
            {holdingImage ? (
              <Image
                style={styles.image}
                source={holdingImage}
                resizeMode="contain"
              />
            ) : null}
            <View style={styles.viewStyle}>
              <HtmlRenderer
                baseFontStyle={styles.holdingDetail}
                html={holdingText
                  .replace(/<\/p>/gim, '</div>')
                  .replace(/(<p)/gim, '<div')}
                textAlign="center"
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 250,
    alignSelf: 'center',
    marginBottom: 30,
  },
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '90%',
  },
  holdingTitle: {
    fontSize: 25,
    alignSelf: 'center',
    marginVertical: 20,
  },
  viewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  holdingDetail: {
    fontSize: 16,
    alignItems: 'center',
  },
});
const mapStateToProps = (state) => ({
  pushNotificationToken: state.pushNotificationReducer.pushNotificationToken,
  getAskGraduateDetailsPayload:
    state.askGraduateCardReducer.getAskGraduateDetailsPayload,
});

export default connect(mapStateToProps)(HoldingPage);
