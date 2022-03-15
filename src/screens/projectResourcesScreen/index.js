import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Style from './style';
import Constant from '../../utility/constant';
import Container from '../../components/Container';
import {
  getProjectMaterialData,
  getProjectMaterials,
} from '../../modules/getProjectMaterial';
import {profileNavigationOptions} from '../../navigators/Root';
import {PaginationSpinner} from '../../components';
import CommonStyle from '../../styles/commonStyle';
import {openLink} from '../../utility/helper';
import RenderItem from './renderItem';
import RenderEmptyComponent from './renderEmptyComponent';
import RenderHeader from './renderHeader';
import {logEventForAnalytics} from '../../utility/firebase-utils';
import {getProjects} from '../../modules/getProjects';
import {getSelectedProject} from '../../modules/getSelectedProject';
import {getUserDetails} from '../../modules/getUserDetail';

class ProjectResourcesScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    ...profileNavigationOptions(
      {navigation, screenProps},
      'My Project Resources',
    ),
  });

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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.projectMaterialPayload &&
      nextProps.projectMaterialPayload.length === 0 &&
      prevState.paginatedData.length > 0
    ) {
      return {
        pageNumber: 1,
        paginationSpinner: false,
        enableMomentum: false,
        recordCount: 0,
        paginatedData: [],
        refreshing: false,
      };
    }

    if (
      nextProps.projectMaterialPayload &&
      nextProps.projectMaterialPayload.meta &&
      !prevState.refreshing
    ) {
      return {
        recordCount: nextProps.projectMaterialPayload.meta.record_count,
        paginatedData: nextProps.filteredProjectMaterialData,
      };
    }
    return null;
  }

  onEndReached = () => {
    const {
      pageNumber,
      enableMomentum,
      paginationSpinner,
      recordCount,
      paginatedData,
    } = this.state;
    if (enableMomentum) {
      if (paginatedData.length !== recordCount) {
        if (!paginationSpinner) {
          this.setState(
            {
              pageNumber: pageNumber + 1,
              paginationSpinner: true,
            },
            () => {
              this.fetchProjectMaterial(this.state.pageNumber);
            },
          );
        }
      }
    }
  };

  onMomentumScrollBegin = () => {
    this.setState({enableMomentum: true});
  };

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

  resetPaginationAttributes = () => {
    this.setState({
      paginationSpinner: false,
      enableMomentum: false,
      refreshing: false,
    });
  };

  fetchProjectMaterial = (pageNumber, isOnRefreshEnabled) => {
    const {dispatch} = this.props;
    const isPaginationEnabled = true;
    dispatch(getProjects());
    dispatch(getSelectedProject());
    dispatch(getUserDetails());
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

  keyExtractor = (item, index) => index.toString();

  navigate = (item) => {
    const {
      navigation: {navigate},
    } = this.props;
    item.url.includes('.pdf')
      ? openLink(`${Constant.GOOGLE_PDF_VIEWER_URL}${item.url}`, this.props)
      : item.url.includes('drive.google.com')
      ? openLink(`${item.url}`, this.props)
      : navigate('PolicyScreen', {screenKey: 'survey', surveyUrl: item.url});
  };

  // renderItem = (item) => (
  //     <TouchableOpacity
  //         accessibilityRole="button"
  //         activeOpacity={0.8}
  //         onPress={() => this.navigate(item)}
  //         style={[Style.projectButton]}
  //     >
  //         <Text style={Style.titleText}>{item.title}</Text>
  //         <Text style={Style.introText}>{item.intro}</Text>
  //     </TouchableOpacity>);

  // renderHeader = () => (
  //     <View style={{ paddingVertical: 20 }}>
  //         <Text style={Style.flatListHeader}>
  //             Here is a list of hand-picked resources for your mentoring programme
  //         </Text>
  //     </View>
  // );

  // renderEmptyComponent = () => {
  //     const { refreshing } = this.state;
  //     return (
  //         <ScrollView
  //             contentContainerStyle={[Style.container, { marginHorizontal: 10 }]}
  //             refreshControl={
  //                 <RefreshControl
  //                     refreshing={refreshing}
  //                     onRefresh={() => this.onRefresh()}
  //                 />
  //             }
  //         >
  //             <Text style={Style.noDataFoundTitleText}>{Constant.NO_DATA_PROJECT_MATERIAL_TITLE}</Text>
  //             <Text style={Style.noDataFoundDescriptionText}>
  //                 {Constant.NO_DATA_PROJECT_MATERIAL_DESCRIPTION}
  //             </Text>
  //         </ScrollView>
  //     );
  // };

  renderItemSeparatorComponent = () => <View style={CommonStyle.separator} />;

  render() {
    const {fetching} = this.props;
    const {paginationSpinner, paginatedData, refreshing} = this.state;
    return (
      <Container fetching={fetching && !paginationSpinner}>
        {!fetching ? (
          paginatedData.length ? (
            <View style={Style.container}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => this.onRefresh()}
                  />
                }
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={this.renderItemSeparatorComponent}
                ListHeaderComponent={<RenderHeader />}
                data={paginatedData}
                extraData={this.props}
                keyExtractor={this.keyExtractor}
                onMomentumScrollBegin={this.onMomentumScrollBegin}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                  <PaginationSpinner animating={paginationSpinner} />
                }
                renderItem={({item}) => (
                  <RenderItem item={item} navigation={this.props.navigation} />
                )}
              />
            </View>
          ) : (
            <RenderEmptyComponent />
          )
        ) : null}
      </Container>
    );
  }
}

ProjectResourcesScreen.defaultProps = {
  filteredProjectMaterialData: [],
};

ProjectResourcesScreen.propTypes = {
  fetching: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  filteredProjectMaterialData: PropTypes.array,
  projectMaterialPayload: PropTypes.array,
};
const mapStateToProps = (state) => ({
  fetching: state.getProjectMaterial.fetching,
  filteredProjectMaterialData: getProjectMaterialData(state),
  projectMaterialPayload: state.getProjectMaterial.projectMaterialPayload,
});

export default connect(mapStateToProps)(ProjectResourcesScreen);
