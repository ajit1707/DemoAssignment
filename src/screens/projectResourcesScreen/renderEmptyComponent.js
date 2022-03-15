import React, {PureComponent} from 'react';
import {RefreshControl, ScrollView, Text} from 'react-native';
import Style from './style';
import Constant from '../../utility/constant';
import {getProjectMaterials} from '../../modules/getProjectMaterial';
import PropTypes from 'prop-types';

class RenderEmptyComponent extends PureComponent {
  constructor() {
    super();
    this.state = {
      pageNumber: 1,
      paginationSpinner: false,
      enableMomentum: false,
      recordCount: 0,
      paginatedData: [],
      refreshing: false,
    };
  }

  onRefresh = () => {
    const isOnRefreshEnabled = true;
    this.setState(
      {
        pageNumber: 1,
        paginationSpinner: false,
        enableMomentum: false,
        recordCount: 0,
        paginatedData: [],
        refreshing: false,
      },
      () => {
        this.fetchProjectMaterial(this.state.pageNumber, isOnRefreshEnabled);
      },
    );
  };

  fetchProjectMaterial = (pageNumber, isOnRefreshEnabled) => {
    const {dispatch} = this.props;
    const isPaginationEnabled = true;
    dispatch(
      getProjectMaterials(pageNumber, isPaginationEnabled, isOnRefreshEnabled),
    )
      .then(() => {
        this.resetPaginationAttributes();
      })
      .catch(() => {
        this.resetPaginationAttributes();
      });
  };
  render() {
    const {refreshing} = this.state;
    return (
      <ScrollView
        contentContainerStyle={[Style.container, {marginHorizontal: 10}]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => this.onRefresh()}
          />
        }>
        <Text style={Style.noDataFoundTitleText}>
          {Constant.NO_DATA_PROJECT_MATERIAL_TITLE}
        </Text>
        <Text style={Style.noDataFoundDescriptionText}>
          {Constant.NO_DATA_PROJECT_MATERIAL_DESCRIPTION}
        </Text>
      </ScrollView>
    );
  }
}
// RenderEmptyComponent.defaultProps = {
//     filteredProjectMaterialData: [],
// };

RenderEmptyComponent.propTypes = {
  // fetching: PropTypes.bool.isRequired,
  // navigation: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  // filteredProjectMaterialData: PropTypes.array,
};

export default RenderEmptyComponent;
