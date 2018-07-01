import React from "react"
import Hotnews from "./hotnews"

export default class Category extends React.Component{

  constructor(props){
    super(props);

    this.loadSubCategoriesTitle = this.loadSubCategoriesTitle.bind(this);
    this.updateCurrentSubCategory = this.updateCurrentSubCategory.bind(this);
    this.initialize = this.initialize.bind(this);
    this.updateSubCategorySlider = this.updateSubCategorySlider.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.generateList = this.generateList.bind(this);
    this.categoryId = -1;
    this.subCategoryLength = 0;
    this.sliderProgressLimit = 8;

    this.state = {
      currentSubCategory: 1,
      sliderProgress: 0,
      currentPath: 0
    }
  }

  generateList(sections, imageURL){
    let isFirstElement = true;
    let newsList = [];
    for (let i = 0 ; i < sections.length ; i++){
      let articles = sections[i].articles;
      for (let j = 0 ; j < articles.length ; j++){
        let article = articles[j];
        if (typeof article.title == "undefined" || typeof article.thumbnail == "undefined"){
          continue;
        }
        newsList.push(
          <li key={article.id}  className={isFirstElement ? "firstNews" : ""}>
            <a href={article.url.url}>
              <img alt="newsImage" src={imageURL.imagePrefix + article.thumbnail.hash + imageURL.imagePostfix}/>
              <div className="category__newsTitle">
                <p>{article.title}</p>
                <div className="global__publisher">{article.publisher}</div>
              </div>
            </a>
          </li>
        );
        isFirstElement = false;
      }
    }
    return newsList;
  }

  getCategory(categories){
    let category = null;
    for (let i = 0 ; i < categories.length ; i++){
      if (categories[i].id == this.categoryId){
        category = categories[i];
        break;
      }
    }
    return category;
  }

  loadSubCategoriesTitle(category){
    let subCategoryTitles = [];
    for (let i = 0 ; i < this.subCategoryLength ; i++){
      let subCategory = category.templates[i];
      if (typeof subCategory.title != 'undefined'){

        if (this.state.currentSubCategory == 0){
          this.setState({currentSubCategory: i});
        }
        subCategoryTitles.push(<li className={this.state.currentSubCategory == i ? "chosenSubCategory" : ""} key={i} onClick={this.updateCurrentSubCategory.bind(this, i)}>{subCategory.title}</li>)
      }
    }
    return subCategoryTitles;
  }

  updateCurrentSubCategory(id){
    this.setState({currentSubCategory: id})
  }

  initialize(){
    this.setState({currentPath: this.categoryId, currentSubCategory: 1, sliderProgress: 0});
  }

  updateSubCategorySlider(increment){
    this.setState(prevState=>{
      let sliderProgress = prevState.sliderProgress;
      sliderProgress += increment;
      if (sliderProgress < 0){
        sliderProgress = this.sliderProgressLimit;
      }else if (sliderProgress > this.sliderProgressLimit){
        sliderProgress = 0;
      }
      return {sliderProgress};
    });
  }

  render(){
    const {categories, categoryList, imageURL, currentCategory, windowWidth, device} = this.props;
    if (categories.length <= 0) return null;

    this.categoryId = this.props.location.pathname.split("/").pop();
    if (this.state.currentPath != this.categoryId){
      this.initialize();
    }

    let category = this.getCategory(categories);
    this.subCategoryLength = category.templates.length;
    let subCategoryTitle = this.loadSubCategoriesTitle(category);
    let subCategoryContent = this.generateList(category.templates[this.state.currentSubCategory].sections, imageURL);

    let categoryBrief = this.generateList(category.templates[0].sections, imageURL);

    let subCategoryTransform = {
        transform: `translateX(-${50*this.state.sliderProgress}px)`
    };

    return (
        <div className="category">
          <div className="category__container">
            <div className="category__news">
              { device != "phone" ? <h3 className="global__title">{category.name}</h3> : null}
              <ul>{categoryBrief}</ul>
            </div>
            <div className="category__news">
              <div className="global__subTitleContainer">
                <div className="global__subCategoryTitles">
                  <ul style={subCategoryTransform}>
                    {subCategoryTitle}
                  </ul>
                </div>
                <div className="global__sliderController">
                  <button onClick={()=>{this.updateSubCategorySlider(-1)}} className="global__previousCategory"></button>
                  <button onClick={()=>{this.updateSubCategorySlider(1)}} className="global__nextCategory"></button>
                </div>
              </div>
              <ul>
                {subCategoryContent}
              </ul>
            </div>
          </div>
          <div className="category__hotnews">
            <Hotnews
              categories={categories}
              categoryList={categoryList}
              currentCategory = {currentCategory}
              windowWidth = {windowWidth}
              imageURL = {imageURL}
            />
          </div>
        </div>
    );
  }
}
