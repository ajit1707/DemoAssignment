import React, {PureComponent} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Style from './style';
import {openLink} from '../../utility/helper';
import Constant from '../../utility/constant';

class RenderItem extends PureComponent {
  navigate = (item) => {
    const {
      navigation: {navigate},
    } = this.props;
    item.url.includes('.pdf') || item.url.includes('drive.google.com')
      ? openLink(`${Constant.GOOGLE_PDF_VIEWER_URL}${item.url}`, this.props)
      : navigate('PolicyScreen', {screenKey: 'survey', surveyUrl: item.url});
  };
  render() {
    const {item} = this.props;
    return (
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.8}
        onPress={() => this.navigate(item)}
        style={[Style.projectButton]}>
        <Text style={Style.titleText}>{item.title}</Text>
        <Text style={Style.introText}>{item.intro}</Text>
      </TouchableOpacity>
    );
  }
}
RenderItem.propTypes = {
  // fetching: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  // dispatch: PropTypes.func.isRequired,
  // filteredProjectMaterialData: PropTypes.array,
};
export default RenderItem;
