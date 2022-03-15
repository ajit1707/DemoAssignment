import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import PropTypes from 'prop-types';
import Style from './styles';
import {
  getCategoriesPayload,
  selectCategory,
  selectSubCategory,
  postArticle,
  postSectionArticle,
  getMyPostedArticle,
  patchArticle,
  patchSectionArticle,
} from '../../modules/getDataForSubmitArticle';
import {Container, ArticleModal, AuthTextInput, Button} from '../../components';
import {setSideMenuItems} from '../../modules/getProjects';
import {uploadAttachments} from '../../modules/uploadAttachments';
import SectionComponent from './sectionComponent';
import {withImageUploader} from '../../components/withImageUploader';
import {validate} from '../../utility/validator';
import {articleNavigationOptions} from '../../navigators/Root';
import Config from '../../utility/config';

const deviceWidth = Dimensions.get('window').width;

const actionSheetOptions = {
  options: ['Take Photo', 'Photo Library', 'Cancel'],
  fileType: ['camera', 'gallery', 'cancel'],
};
const cancelIndex = {buttonIndex: 2};

export const navigationOptions = ({navigation, screenProps}) => ({
  ...articleNavigationOptions(
    {navigation, screenProps},
    navigation.state.params && navigation.state.params.resetArticleState,
    navigation.state.params && navigation.state.params.editArticle,
  ),
});

class SubmitArticle extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    ...navigationOptions(navigation, screenProps),
  });
  constructor(props) {
    super(props);
    this.state = {
      header: 'Select Category',
      modalVisible: false,
      subCategoriesModalVisible: false,
      categorySelected: 'Select Category',
      subCategories: [],
      sectionArray: [{title: '', imageUrl: {}, bodyText: ''}],
      title: '',
      intro: '',
      categoryId: null,
      subCategoriesId: [],
      edit: false,
      articleId: null,
      imageData: null,
      imageToBeDeleted: [],
    };
    this.offset = 1;
  }
  componentDidMount() {
    const {
      navigation: {dispatch, setParams},
      navigation,
    } = this.props;
    dispatch(getCategoriesPayload());
    setParams({
      resetArticleState: this.resetArticleState,
      editArticle: this.editArticle,
    });
  }
  componentDidUpdate(prevProps) {
    const {imagePayload} = this.props;
    if (prevProps.imagePayload !== imagePayload) {
      this.setState({imageData: imagePayload});
    }
  }

  onRowItemSelect = (id, index, title, isChecked) => {
    const {dispatch, submitArticleCategories, filteredCategories} = this.props;
    if (!isChecked) {
      this.setState({categorySelected: title, categoryId: id});
    } else {
      this.setState({categorySelected: 'Select Category'});
    }
    dispatch(selectCategory(id));
    const subCat = submitArticleCategories.included.filter(
      (data) =>
        data.attributes.parent_category_id ===
        parseInt(filteredCategories[index].id, 10),
    );
    this.setState({subCategories: subCat});
  };
  onChangeText = (text, component) => {
    if (component === 'title') {
      this.setState({title: text});
    } else {
      this.setState({intro: text});
    }
  };
  onSubCategoryRowItemSelect = (id, index, title, isChecked) => {
    const {dispatch} = this.props;
    const {subCategories, subCategoriesId} = this.state;
    const subId = subCategoriesId.findIndex((catId) => catId === id);
    if (title === 'Select All') {
      if (!isChecked) {
        const subCategoriesId = subCategories.map((item) => item.id);
        this.setState({subCategoriesId});
      } else {
        this.setState({subCategoriesId: []});
      }
    } else if (subCategoriesId.findIndex((catId) => catId === id) === -1) {
      const subData = subCategoriesId;
      subData.push(id);
      this.setState({subCategoriesId: subData});
    } else {
      const subData = subCategoriesId;
      subData.splice(subId, 1);
      this.setState({subCategoriesId: subData});
    }
    dispatch(selectSubCategory(id, title, this.state.subCategories));
  };
  showModal = () => {
    const {modalVisible} = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };
  showSubCategoryModal = () => {
    const {subCategoriesModalVisible} = this.state;
    this.setState({
      subCategoriesModalVisible: !subCategoriesModalVisible,
    });
  };
  selectSubCategory = () => {
    this.setState({
      subCategoriesModalVisible: true,
      header: 'Select Sub-Categories',
    });
  };
  selectCategory = () => {
    this.setState({modalVisible: true, header: 'Select Categories'});
  };
  navigate = () => {
    this.props.navigation.goBack();
  };
  addNewSection = () => {
    const {sectionArray} = this.state;
    const newArray = sectionArray;
    newArray.push({title: '', imageUrl: {}, bodyText: ''});
    this.setState({sectionArray: newArray});
  };
  removeSection = (index) => {
    const {sectionArray} = this.state;
    const dataIndex = sectionArray.indexOf(index);
    if (dataIndex === -1) {
      sectionArray.splice(index, 1);
    }
    this.setState({sectionArray});
  };
  onSectionChange = (attribute, data, index) => {
    const updated = this.state.sectionArray;
    updated[index][`${attribute}`] = data;
    this.setState({sectionArray: updated});
  };
  submitArticle = () => {
    const {dispatch} = this.props;
    const {
      title,
      intro,
      subCategories,
      categorySelected,
      categoryId,
      subCategoriesId,
      imageData,
    } = this.state;
    // const validateError = validate('textRequired', title, 'Please enter title') || validate('textRequired', intro, 'Please enter intro text');
    const payload = {
      data: {
        attributes: {
          category_id: categoryId,
          category_ids: subCategoriesId,
          featured: 0,
          intro,
          is_draft: 'true',
          project_id: null,
          title,
        },
        type: 'articles',
      },
    };
    if (imageData) {
      const {
        data: {attributes},
      } = payload;
      const {
        fileData: {filename, format, url, size},
      } = imageData;
      const fileData = new FormData();
      fileData.append('file', {
        uri: url,
        type: format,
        name: filename,
      });
      dispatch(uploadAttachments(fileData)).then((res) => {
        const {
          data: {filename, format, id, size},
        } = res;
        attributes.image_content_type = format;
        attributes.image_filename = filename;
        attributes.image_id = id;
        attributes.image_size = parseInt(size, 10);
        dispatch(postArticle(payload)).then((data) => {
          this.postSectionArticles(data.id);
        });
      });
    } else {
      dispatch(postArticle(payload)).then((data) => {
        this.postSectionArticles(data.data.id);
      });
    }
    // || validate('selectCategory', categorySelected, 'Please select one category') || validate('textRequired', subCategories.length(), 'Select at least one sub category');
    // if (validateError) {
    //     dispatch(errorHandler(validateError));
    // } else {
    //     dispatch(postArticle(payload));
    // }
  };
  postSectionArticles = async (articleId) => {
    const {sectionArray} = this.state;
    const {
      dispatch,
      navigation: {navigate},
    } = this.props;
    if (sectionArray.length > 0) {
      for await (const item of sectionArray) {
        if (!('id' in item)) {
          const payload = {
            data: {
              type: 'article_sections',
              attributes: {
                title: '',
                // language=HTML
                body: '<p>Default section text</p>',
                article_id: articleId,
              },
            },
          };
          const {title, body} = item;
          const {
            data: {attributes},
          } = payload;
          if (Object.keys(item.imageUrl).length > 0) {
            const {
              imageUrl: {url},
              imageUrl,
            } = item;
            const fileData = new FormData();
            fileData.append('file', {
              uri: url,
              type: imageUrl.format,
              name: imageUrl.filename,
            });
            await dispatch(uploadAttachments(fileData)).then((res) => {
              const {
                data: {filename, format, id, size},
              } = res;
              attributes.image_content_type = format;
              attributes.image_filename = filename;
              attributes.image_id = id;
              attributes.image_size = parseInt(size, 10);
              attributes.title = title;
            });
          } else {
            attributes.title = title;
          }
          await dispatch(postSectionArticle(payload));
        }
        const {title, body, id} = item;
        const payload = {
          data: {
            type: 'article_sections',
            id,
            attributes: {
              title,
              // language=HTML
              body: '<p>Default section text</p>',
              article_id: articleId,
            },
          },
          id,
        };
        const {
          data: {attributes},
        } = payload;
        if (Object.keys(item.imageUrl).length > 0) {
          const {
            imageUrl: {url},
            imageUrl,
          } = item;
          if (item.imageUrl.image_id !== url) {
            const fileData = new FormData();
            fileData.append('file', {
              uri: url,
              type: imageUrl.format,
              name: imageUrl.filename,
            });
            await dispatch(uploadAttachments(fileData))
              .then((res) => {
                const {
                  data: {filename, format, id, size},
                } = res;
                attributes.image_content_type = format;
                attributes.image_filename = filename;
                attributes.image_id = id;
                attributes.image_size = parseInt(size, 10);
              })
              .catch((err) => console.log('err', err));
            attributes.image_content_type = imageUrl.image_content_type;
            attributes.image_filename = imageUrl.image_filename;
            attributes.image_id = imageUrl.image_id;
          }
          attributes.title = title;
        } else {
          attributes.title = title;
        }
        await dispatch(patchSectionArticle(id, payload));
      }
    }
    navigate('ViewMyArticle', {
      resetArticleState: this.resetArticleState,
      editArticle: this.editArticle,
    });
  };
  updateArticle = () => {
    const {
      dispatch,
      imagePayload: {
        fileData: {filename, format, url, size},
        eventType,
      },
    } = this.props;
    const {
      title,
      intro,
      subCategories,
      categorySelected,
      categoryId,
      subCategoriesId,
      articleId,
    } = this.state;
    // const validateError = validate('textRequired', title, 'Please enter title') || validate('textRequired', intro, 'Please enter intro text');
    const payload = {
      data: {
        attributes: {
          category_id: categoryId,
          category_ids: subCategoriesId,
          featured: 0,
          intro,
          is_draft: 'true',
          project_id: null,
          title,
        },
        id: articleId,
        type: 'articles',
      },
      id: articleId,
    };
    if (eventType.length > 1) {
      const {
        data: {attributes},
      } = payload;
      const fileData = new FormData();
      fileData.append('file', {
        uri: url,
        type: format,
        name: filename,
      });
      dispatch(uploadAttachments(fileData)).then((res) => {
        const {
          data: {filename, format, id, size},
        } = res;
        attributes.image_content_type = format;
        attributes.image_filename = filename;
        attributes.image_id = id;
        attributes.image_size = parseInt(size, 10);
        dispatch(patchArticle(articleId, payload)).then((response) =>
          console.log('res====>>>>', response),
        );
      });
    } else {
      dispatch(patchArticle(articleId, payload))
        .then((res) => {
          const {
            data: {id},
          } = res;
          this.postSectionArticles(id);
        })
        .catch((err) => console.log('err', err));
    }
  };
  resetArticleState = () => {
    this.setState({
      header: 'Select Category',
      modalVisible: false,
      subCategoriesModalVisible: false,
      categorySelected: 'Select Category',
      subCategories: [],
      sectionArray: [{title: '', imageUrl: {}, bodyText: ''}],
      title: '',
      intro: '',
      categoryId: null,
      subCategoriesId: [],
      imageData: null,
    });
  };
  editArticle = (articleId) => {
    const {dispatch, filteredCategories, submitArticleCategories} = this.props;
    dispatch(getMyPostedArticle(articleId))
      .then((res) => {
        const {
          data: {
            attributes: {category_id, category_ids, intro, title, image_id},
            id,
          },
          included,
        } = res;
        this.setState({
          edit: true,
          articleId: id,
          imageData: {imageId: image_id},
        });
        dispatch(selectCategory(category_id));
        const catData = filteredCategories.filter(
          (item) => item.id === String(category_id),
        );
        const categorySelected = catData[0].attributes.title;
        const subCat = submitArticleCategories.included.filter(
          (data) => data.attributes.parent_category_id === category_id,
        );
        category_ids.forEach((item) =>
          dispatch(selectSubCategory(String(item), '', subCat)),
        );
        const sectionArrays = included.filter(
          (item) => item.type === 'article_sections',
        );
        const assignArray = sectionArrays.map((item) => {
          if (item.attributes.image_id !== null) {
            return {
              title: item.attributes.title,
              imageUrl: {
                image_content_type: item.attributes.image_content_type,
                image_filename: item.attributes.image_filename,
                image_id: item.attributes.image_id,
              },
              body: item.attributes.body,
              id: item.id,
            };
          }
          return {
            title: item.attributes.title,
            imageUrl: {},
            body: item.attributes.body,
            id: item.id,
          };
        });
        this.setState({
          categorySelected,
          subCategories: subCat,
          title,
          intro,
          categoryId: category_id,
          subCategoriesId: category_ids,
          sectionArray: assignArray,
        });
      })
      .catch((error) => console.log('err', error));
  };
  clearImage = () => {
    this.setState({
      imageData: null,
    });
  };
  clearSectionImage = (id, index) => {
    const {sectionArray} = this.state;
  };
  // onSelect = (index, value) => {
  //     const { categoryPayload, filterCategoryData } = this.props;
  //     this.setState({ defaultValue: value });
  //     const categorySelected = filterCategoryData.hasSubCategories[index];
  //     const subCategoriesOfData = categoryPayload.included.filter((item) => item.attributes.parent_category_id === parseInt(categorySelected.id, 10));
  // };
  onRowItemSelect = (item, index) => {
    const {modalVisible} = this.state;
    const {subCategories, categoryPayload} = this.props;
    this.setState({categorySelected: item, modalVisible: !modalVisible});
    const subCat = categoryPayload.included.filter(
      (data) =>
        data.attributes.parent_category_id ===
        parseInt(subCategories[index].id, 10),
    );
    this.setState({data: subCat});
  };
  render() {
    const {
      sideMenuItems: {sideMenuColor},
      submitArticleCategories,
      fetching,
      filteredCategories,
      getMyPostedArticle,
    } = this.props;
    const {
      modalVisible,
      header,
      subCategoriesModalVisible,
      subCategories,
      sectionArray,
      edit,
      imageData,
    } = this.state;
    let notSelected = 0;
    return (
      <Container fetching={fetching}>
        <ScrollView>
          {submitArticleCategories && (
            <View style={Style.container}>
              <Button
                style={[Style.touchableStyle, {borderColor: sideMenuColor}]}
                onPress={() => this.selectCategory()}>
                <Text style={Style.addSectionButtonText}>
                  {this.state.categorySelected}
                </Text>
              </Button>
              {this.state.categorySelected !== 'Select Category' && (
                <Button
                  style={[Style.touchableStyle, {borderColor: sideMenuColor}]}
                  onPress={() => this.selectSubCategory()}>
                  <ScrollView horizontal>
                    {subCategories.map((item, index) => {
                      if (item.isChecked) {
                        return (
                          <View
                            key={String(index)}
                            style={{flexDirection: 'row'}}>
                            <Text style={Style.buttonText} numberOfLines={1}>
                              {item.attributes.title}
                            </Text>
                            <TouchableOpacity
                              style={{alignSelf: 'center'}}
                              onPress={() =>
                                this.onSubCategoryRowItemSelect(
                                  item.id,
                                  item.attributes.title,
                                  subCategories,
                                  item.isChecked,
                                )
                              }>
                              <Entypo name="cross" size={18} color="#000" />
                            </TouchableOpacity>
                          </View>
                        );
                      }
                      notSelected += 1;
                      return null;
                    })}
                    {notSelected === subCategories.length && (
                      <Text
                        style={[
                          Style.addSectionButtonText,
                          {alignSelf: 'center'},
                        ]}>
                        Select Sub-Categories
                      </Text>
                    )}
                  </ScrollView>
                </Button>
              )}
              <View>
                <AuthTextInput
                  placeholder="Enter the article title"
                  value={this.state.title}
                  onChangeText={(text) => this.onChangeText(text, 'title')}
                  textStyle={{width: deviceWidth * 0.9}}
                  multiline
                />
              </View>
              <View>
                {imageData && (
                  <ImageBackground
                    source={{
                      url:
                        imageData && imageData.fileData
                          ? `${imageData.fileData.url}`
                          : `${Config.IMAGE_SERVER_CDN}${imageData.imageId}`,
                    }}
                    resizeMode="contain"
                    style={{height: 250, width: '95%'}}>
                    <TouchableOpacity
                      style={{justifyContent: 'flex-end'}}
                      onPress={() => this.clearImage()}>
                      <Text>X</Text>
                    </TouchableOpacity>
                  </ImageBackground>
                )}
              </View>
              <Button
                style={[
                  Style.touchableStyle,
                  {
                    borderColor: sideMenuColor,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  },
                ]}
                onPress={this.props.showActionSheet}>
                <View style={{alignSelf: 'center'}}>
                  <Entypo name="camera" size={18} color="#000" />
                </View>
                <Text style={[Style.addSectionButtonText, {paddingLeft: 10}]}>
                  Click here to upload image
                </Text>
              </Button>
              <View>
                <AuthTextInput
                  placeholder="Enter the intro"
                  value={this.state.intro}
                  onChangeText={(text) => this.onChangeText(text, 'intro')}
                  textStyle={{
                    height: 75,
                    width: deviceWidth * 0.9,
                    textAlignVertical: 'top',
                  }}
                  multiline
                />
              </View>
              <FlatList
                style={{alignSelf: 'center', paddingTop: 10}}
                ref={(ref) => {
                  this.sectionFlatlist = ref;
                }}
                ItemSeparatorComponent={this.itemSeparator}
                data={this.state.sectionArray}
                extraData={this.props}
                renderItem={({item, index}) => (
                  <SectionComponent
                    item={item}
                    index={index}
                    sectionArray={sectionArray}
                    onSectionChange={(attribute, data) =>
                      this.onSectionChange(attribute, data, index)
                    }
                    addNewSection={this.addNewSection}
                    removeSection={() => this.removeSection(index)}
                  />
                )}
                bounces={false}
                keyExtractor={(item, index) => index.toString()}
              />
              {this.state.sectionArray.length < 1 && (
                <Button
                  style={[
                    Style.touchableStyle,
                    {
                      borderColor: sideMenuColor,
                      width: '40%',
                      alignSelf: 'center',
                    },
                  ]}
                  onPress={() => this.addNewSection()}>
                  <Text style={Style.addSectionButtonText}>Add Section</Text>
                </Button>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-around',
                }}>
                <Button
                  style={[
                    Style.touchableStyle,
                    {borderColor: sideMenuColor, width: '40%'},
                  ]}>
                  <Text style={Style.addSectionButtonText}>Cancel</Text>
                </Button>
                <Button
                  style={[
                    Style.touchableStyle,
                    {borderColor: sideMenuColor, width: '40%'},
                  ]}
                  onPress={() =>
                    edit ? this.updateArticle() : this.submitArticle()
                  }>
                  <Text style={Style.addSectionButtonText}>
                    {edit ? 'Update' : 'Submit'}
                  </Text>
                </Button>
              </View>
            </View>
          )}
          {modalVisible && (
            <ArticleModal
              data={filteredCategories}
              headerText={header}
              modalVisible={modalVisible}
              showModal={this.showModal}
              onRowItemSelect={this.onRowItemSelect}
              route="categories"
            />
          )}
          {subCategoriesModalVisible && (
            <ArticleModal
              data={subCategories}
              headerText={header}
              modalVisible={subCategoriesModalVisible}
              showModal={this.showSubCategoryModal}
              onRowItemSelect={this.onSubCategoryRowItemSelect}
              route="subCategories"
            />
          )}
        </ScrollView>
      </Container>
    );
  }
}
SubmitArticle.defaultProps = {
  submitArticleCategories: null,
  filteredCategories: null,
  sideMenuItems: null,
  showActionSheet: null,
  fetching: false,
};

SubmitArticle.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetching: PropTypes.bool,
  submitArticleCategories: PropTypes.object,
  navigation: PropTypes.object.isRequired,
  sideMenuItems: PropTypes.object,
  filteredCategories: PropTypes.array,
  showActionSheet: PropTypes.func,
};

const mapStateToProps = (state) => ({
  fetching: state.getDataForSubmitArticleReducer.fetching,
  sideMenuItems: setSideMenuItems(state),
  submitArticleCategories:
    state.getDataForSubmitArticleReducer.submitArticleCategories,
  filteredCategories: state.getDataForSubmitArticleReducer.filteredCategories,
  getMyArticles: state.getDataForSubmitArticleReducer.getMyArticles,
  getMyPostedArticle: state.getDataForSubmitArticleReducer.getMyPostedArticle,
});

export default connect(mapStateToProps)(
  withImageUploader(
    SubmitArticle,
    navigationOptions,
    actionSheetOptions,
    cancelIndex,
  ),
);
