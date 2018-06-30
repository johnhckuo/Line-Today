import React from "react"
import Hotnews from "./hotnews"

export default class Category extends React.Component{

  constructor(props){
    super(props);
    this.loadSubCategoryContent = this.loadSubCategoryContent.bind(this);
    this.loadSubCategoriesTitle = this.loadSubCategoriesTitle.bind(this);
    this.updateCurrentSubCategory = this.updateCurrentSubCategory.bind(this);
    this.slider = this.slider.bind(this);
    this.loadFirstContent = this.loadFirstContent.bind(this);

    this.getCategory = this.getCategory.bind(this);
    this.categoryId = -1;
    this.subCategoryLength = 0;
    this.state = {currentSubCategory: 0, sliderProgress: 0}
  }

  loadFirstContent(category, imageURL){
    var newsList = [];
    var template = category.templates[0];
      var sections = template.sections;
      for (var j = 0 ; j < sections.length ; j++){
        var articles = template.sections[j].articles;
        for (var z = 0 ; z < articles.length ; z++){
          var article = articles[z];
          if (typeof article.title == "undefined" || typeof article.thumbnail == "undefined"){
            continue;
          }
          newsList.push(
            <li key={article.id}>
              <a href={article.url.url}>
                <img src={imageURL.imagePrefix + article.thumbnail.hash + imageURL.imagePostfix}/>
                <div className="category__newsTitle">
                  <p>{article.title}</p>
                  <div className="global__publisher">{article.publisher}</div>
                </div>
              </a>
            </li>
          );
        }
      }
    return newsList;
  }

  loadSubCategoryContent(category, imageURL){
    var newsList = [];
    var template = category.templates[this.state.currentSubCategory];
    for (var j = 0 ; j < template.sections.length ; j++){
      var articles = template.sections[j].articles;
      for (var z = 0 ; z < articles.length ; z++){
        var article = articles[z];
        if (typeof article.title == "undefined" || typeof article.thumbnail == "undefined"){
          continue;
        }
        newsList.push(
          <li key={article.id}>
            <a href={article.url.url}>
              <img src={imageURL.imagePrefix + article.thumbnail.hash + imageURL.imagePostfix}/>
              <div className="category__newsTitle">
                <p>{article.title}</p>
                <div className="global__publisher">{article.publisher}</div>
              </div>
            </a>
          </li>
        );
      }
    }
    return newsList;
  }

  getCategory(categories){
    var category = null;
    for (var i = 0 ; i < categories.length ; i++){
      if (categories[i].id == this.categoryId){
        category = categories[i];

        break;
      }
    }
    return category;
  }

  loadSubCategoriesTitle(category){
    var subCategoryTitles = [];
    for (var i = 0 ; i < this.subCategoryLength ; i++){
      var subCategory = category.templates[i];
      if (typeof subCategory.title != 'undefined'){
        var chosenCategoryClass = "";
        if (this.state.currentSubCategory == i){
          chosenCategoryClass = "chosenSubCategory";
        }
        subCategoryTitles.push(<li className={chosenCategoryClass} key={i} onClick={this.updateCurrentSubCategory.bind(this, i)}>{subCategory.title}</li>)
      }
    }
    return subCategoryTitles;
  }

  updateCurrentSubCategory(id){
    this.setState({currentSubCategory: id})
  }

  slider(increment){
    this.setState(prevState=>{
      var sliderProgress = prevState.sliderProgress;
      sliderProgress += increment;
      if (sliderProgress < 0){
        sliderProgress = this.subCategoryLength - 1;
      }
      return {
        sliderProgress : sliderProgress % this.subCategoryLength,
      };
    });
  }

  render(){
    const {categories, categoryList, imageURL, currentCategory} = this.props;
    this.categoryId = this.props.location.pathname.split("/").pop();
    if (categories.length > 0){
      var category = this.getCategory(categories);
    }else{
      return null;
    }
    this.subCategoryLength = category.templates.length;
    var subCategoryContent = this.loadSubCategoryContent(category, imageURL);
    var subCategoryTitle = this.loadSubCategoriesTitle(category);

    var firstContent = this.loadFirstContent(category, imageURL);

    var subCategoryTransform = {
        transform: `translateX(-${49*this.state.sliderProgress}px)`
    };

    return (
        <div className="category">
          <div className="category__container">
            <div className="category__news">
              <h3 className="global__title">{category.name}</h3>
              <ul>{firstContent}</ul>
            </div>
            <div className="category__news">
              <div className="global__subTitleContainer">
                <div className="global__subCategoryTitles">
                  <ul style={subCategoryTransform}>
                    {subCategoryTitle}
                  </ul>
                </div>
                <div className="global__sliderController">
                  <button onClick={()=>{this.slider(-1)}} className="global__previousCategory"></button>
                  <button onClick={()=>{this.slider(1)}} className="global__nextCategory"></button>
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
            />
          </div>
        </div>
    );
  }
}
