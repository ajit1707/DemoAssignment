import React, {PureComponent} from 'react';
import {FlatList, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {uniqBy} from 'lodash';
import {Container, PaginationSpinner} from '../../components';
import {getProjectList, getProjects} from '../../modules/getProjects';
import ProjectList from './projectList';
import Style from './style';
import Constant from '../../utility/constant';

class ArchivedScreen extends PureComponent {
  static navigationOptions = () => ({
    tabBarOnPress: ({navigation, defaultHandler}) => {
      if (!navigation.isFocused()) {
        navigation.state.params &&
          navigation.state.params.fetchArchivedProjects(1);
      }
      defaultHandler();
    },
  });

  constructor() {
    super();
    this.state = {
      pageNumber: 1,
      paginatedData: [],
      paginationSpinner: false,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setParams({fetchArchivedProjects: this.fetchArchivedProjects});
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.projectListData &&
      state.recordCount !== props.projectListData.meta.record_count
    ) {
      return {
        recordCount: props.projectListData.meta.record_count,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const {archiveListData} = this.props;
    const {paginatedData} = this.state;
    if (prevProps.archiveListData !== archiveListData) {
      const uniquePaginatedData = uniqBy(
        [...paginatedData, ...archiveListData],
        'id',
      );
      this.setState({
        paginatedData: uniquePaginatedData,
        paginationSpinner: false,
      });
    }
  }

  onEndReached = () => {
    const {
      pageNumber,
      enableMomentum,
      paginatedData,
      recordCount,
      paginationSpinner,
    } = this.state;
    if (enableMomentum) {
      if (paginatedData.length !== recordCount && !paginationSpinner) {
        this.setState(
          {
            pageNumber: pageNumber + 1,
            paginationSpinner: true,
          },
          () => {
            this.fetchArchivedProjects(this.state.pageNumber, 'pagination');
          },
        );
      }
    }
  };

  onMomentumScrollBegin = () => {
    this.setState({enableMomentum: true});
  };

  fetchArchivedProjects = (pageNumber, pagination) => {
    const {dispatch} = this.props;
    if (!pagination) {
      this.setState(
        {
          pageNumber: 1,
          paginatedData: [],
          paginationSpinner: false,
          enableMomentum: false,
        },
        () => {
          dispatch(getProjects(pageNumber, 'archived'));
        },
      );
    } else {
      dispatch(getProjects(pageNumber, 'archived'));
    }
  };

  render() {
    const {fetching} = this.props;
    const {paginatedData, paginationSpinner} = this.state;
    return (
      <Container
        fetching={fetching && !paginationSpinner}
        style={Style.container}>
        {!fetching || paginationSpinner ? (
          paginatedData && paginatedData.length === 0 ? (
            <View style={Style.noContentContainer}>
              <Text>{Constant.NO_RECORDS_FOUND}</Text>
            </View>
          ) : (
            <FlatList
              bounces={false}
              showsVerticalScrollIndicator={false}
              extraData={this.props}
              data={paginatedData}
              renderItem={(item) => (
                <ProjectList isActiveList projectListPayload={item} />
              )}
              ListFooterComponent={
                <PaginationSpinner animating={paginationSpinner} />
              }
              onMomentumScrollBegin={this.onMomentumScrollBegin}
              onEndReachedThreshold={0.5}
              onEndReached={this.onEndReached}
              keyExtractor={(item, index) => index.toString()}
            />
          )
        ) : null}
      </Container>
    );
  }
}

ArchivedScreen.defaultProps = {
  fetching: false,
  archiveListData: [],
};

ArchivedScreen.propTypes = {
  fetching: PropTypes.bool,
  archiveListData: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetching: state.getProjects.fetching,
  archiveListData: getProjectList(state.getProjects.archivedProjectPayload),
  projectListData: state.getProjects.archivedProjectPayload,
});

export default connect(mapStateToProps)(ArchivedScreen);
