import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import {Container} from '../../components';
import Icon from '../../utility/icons';
import Config from '../../utility/config';

class FeaturedGuru extends Component {
  render() {
    const {getAskGraduateDetailsPayload} = this.props;
    let expertTitle;
    if (getAskGraduateDetailsPayload && getAskGraduateDetailsPayload.data) {
      expertTitle = getAskGraduateDetailsPayload.data[0].attributes
        .replacement_text_enabled
        ? getAskGraduateDetailsPayload.data[0].attributes.replacement_text
        : 'Graduate';
    }
    const listOfGraduates = getAskGraduateDetailsPayload.included;
    return (
      <Container>
        <View style={styles.container}>
          {listOfGraduates && listOfGraduates.length !== 0 ? (
            <FlatList
              data={listOfGraduates}
              extraData={listOfGraduates.length}
              bounces={false}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  accessible={false}
                  activeOpacity={0.2}
                  onPress={() => {
                    this.props.navigateToAskExpert(item, this.props.route);
                  }}>
                  <View style={styles.flatListContainer}>
                    {item.attributes.image_id ? (
                      <Image
                        accessible
                        accessibilityLabel={`${item.attributes.name} profile Picture`}
                        accessibilityRole="image"
                        style={styles.image}
                        source={{
                          uri: `${Config.IMAGE_SERVER_CDN}${item.attributes.image_id}`,
                        }}
                      />
                    ) : (
                      <Image
                        accessible
                        accessibilityLabel="No Expert"
                        accessibilityRole="image"
                        style={styles.image}
                        source={Icon.NO_EXPERT}
                      />
                    )}
                    <View style={styles.titles}>
                      <Text style={styles.titleText} numberOfLines={1}>
                        {item.attributes.name}
                      </Text>
                      <Text style={styles.subTitleText} numberOfLines={1}>
                        {item.attributes.title}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View style={styles.noFeaturedGraduateContainer}>
              <Text
                style={
                  styles.noFeaturedGraduate
                }>{`No Featured ${expertTitle} Available`}</Text>
            </View>
          )}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '93%',
    marginVertical: 10,
  },
  flatListContainer: {
    flex: 1,
    width: '98%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: {width: 3, height: 3},
    elevation: 5,
    flexDirection: 'row',
  },
  image: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    margin: 10,
  },
  titles: {
    marginLeft: 20,
    width: '70%',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  titleText: {
    width: '80%',
    fontSize: 20,
    flexWrap: 'wrap',
    color: '#1E2121',
    marginBottom: 5,
  },
  subTitleText: {
    width: '80%',
    flexWrap: 'wrap',
    color: '#667A93',
  },
  noFeaturedGraduateContainer: {
    flex: 1,
  },
  noFeaturedGraduate: {
    fontSize: 18,
    alignSelf: 'center',
    marginVertical: 30,
  },
});

FeaturedGuru.propTypes = {
  getAskGraduateDetailsPayload: PropTypes.object.isRequired,
  navigateToAskExpert: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  pushNotificationToken: state.pushNotificationReducer.pushNotificationToken,
  getAskGraduateDetailsPayload:
    state.askGraduateCardReducer.getAskGraduateDetailsPayload,
});
export default connect(mapStateToProps)(FeaturedGuru);
