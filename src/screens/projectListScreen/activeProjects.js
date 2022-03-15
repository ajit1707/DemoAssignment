import React, {PureComponent} from 'react';
import {FlatList, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {uniqBy} from 'lodash';
import {Container, PaginationSpinner} from '../../components';
import ProjectList from './projectList';
import {getProjects, getProjectList} from '../../modules/getProjects';
import Style from './style';
import Constant from '../../utility/constant';

class ActiveScreen extends PureComponent {
  static navigationOptions = ({navigation}) => ({
    header: null,
    tabBarOnPress: ({defaultHandler}) => {
      if (!navigation.isFocused()) {
        navigation.state.params &&
          navigation.state.params.fetchActiveProjects(1);
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
      recordCount: 0,
      enableMomentum: false,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const {pageNumber} = this.state;
    navigation.setParams({fetchActiveProjects: this.fetchActiveProjects});
    this.fetchActiveProjects(pageNumber);
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
    const {activeListData} = this.props;
    const {paginatedData} = this.state;
    if (prevProps.activeListData !== activeListData) {
      const uniquePaginatedData = uniqBy(
        [...paginatedData, ...activeListData],
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
      if (paginatedData.length !== recordCount) {
        if (!paginationSpinner) {
          this.setState(
            {
              pageNumber: pageNumber + 1,
              paginationSpinner: true,
            },
            () => {
              this.fetchActiveProjects(this.state.pageNumber, 'pagination');
            },
          );
        }
      }
    }
  };

  onMomentumScrollBegin = () => {
    this.setState({enableMomentum: true});
  };

  fetchActiveProjects = (pageNumber, pagination) => {
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
          dispatch(getProjects(pageNumber, 'active'));
        },
      );
    } else {
      dispatch(getProjects(pageNumber, 'active'));
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
              onEndReachedThreshold={0.2}
              onEndReached={this.onEndReached}
              keyExtractor={(item, index) => index.toString()}
            />
          )
        ) : null}
      </Container>
    );
  }
}

ActiveScreen.defaultProps = {
  fetching: false,
  activeListData: [],
  projectListData: null,
};

ActiveScreen.propTypes = {
  fetching: PropTypes.bool,
  activeListData: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  projectListData: PropTypes.object,
};

const mapStateToProps = (state) => ({
  fetching: state.getProjects.fetching,
  activeListData: getProjectList(state.getProjects.activeProjectPayload),
  projectListData: state.getProjects.activeProjectPayload,
});

export default connect(mapStateToProps)(ActiveScreen);
