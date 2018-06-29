import React from "react"
import Hotnews from "./hotnews"

export default class Headline extends React.Component{

  constructor(props){
    super(props);
    this.loadDigest = this.loadDigest.bind(this);
    this.swipeDigest = this.swipeDigest.bind(this);
    this.createBulletControllers = this.createBulletControllers.bind(this);
    this.loadSubCategoriesContent = this.loadSubCategoriesContent.bind(this);
    this.loadSubCategoriesTitle = this.loadSubCategoriesTitle.bind(this);
    this.updateCurrentSubCategory = this.updateCurrentSubCategory.bind(this);
    this.slider = this.slider.bind(this);
    this.digestListLength = 0;
    this.subCategoryLength = 0;
    this.state = {
      currentDigest: 0, 
      intervalId: null, 
      currentSubCategory: 0, 
      sliderProgress: 0
    };
  }

  componentDidMount(){
    var intervalId = setInterval(()=>{this.swipeDigest(1)}, 3000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
     clearInterval(this.state.intervalId);
  }

  loadDigest(category){
    var digestList = [];
    for (var i = 0 ; i < category.templates[0].sections.length ; i++){
      var section = category.templates[0].sections[i];
      for (var j = 0 ; j < section.articles.length ; j++){
        var article = section.articles[j];
        digestList.push(article);
      }
    }
    return digestList;
  }

  loadSubCategoriesContent(index, category, imageURL){
    var newsList = [];
    var sections = category.templates[index].sections;
    for (var j = 0 ; j < sections.length ; j++){
      var articles = category.templates[index].sections[j].articles;
      for (var z = 0 ; z < articles.length ; z++){
        var article = articles[z];
        if (typeof article.title == "undefined"){
          continue;
        }
        var newsType = "headline__horizonNews";
        if (j == 0 && z < 4){
          newsType = "headline__verticalNews";
        }

        newsList.push(
          <li className={newsType} key={article.id}>
            <a href={article.url.url}>
              <img src={imageURL.imagePrefix + article.thumbnail.hash + imageURL.imagePostfix}/>
              <div className="headline__newsTitle">
                <div>{article.title}</div>
                <div className="global__publisher">{article.publisher}</div>
              </div>
            </a>
          </li>
        );
      }
    }
    return newsList;
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

  swipeDigest(offset, jumpto){

    if (this.state.intervalId != null){
      clearInterval(this.state.intervalId);
    }
    var intervalId = setInterval(()=>{this.swipeDigest(1)}, 3000);

    var {currentDigest} = this.state;
    if (offset == 0 && jumpto != "undefined"){
      currentDigest = jumpto;
    }else{
      currentDigest += offset;
      if (currentDigest < 0){
        currentDigest = this.digestListLength - 1;
      }
    }

    this.setState({
      intervalId: intervalId,
      currentDigest : currentDigest % this.digestListLength
    });
  }

  createBulletControllers(){
    var bulletControllers = [];
    for (var i = 0 ; i < this.digestListLength ; i++){
      bulletControllers.push(<span key={i} data-index={i} className={this.state.currentDigest == i ? "activeBullet" : "inactiveBullet"}></span>)
    }
    return bulletControllers;
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
    const {categories, windowWidth, categoryList, imageURL, currentCategory} = this.props;
    if (categories.length == 0){
      return null;
    }
    var category = categories[0];
    var digestList = this.loadDigest(category);
    this.digestListLength = digestList.length;
    var bulletControllers = this.createBulletControllers();
    var currentDigest = digestList[this.state.currentDigest];
    var digestTransform = {
        transform: `translateX(-${windowWidth * 0.565*this.state.currentDigest}px)`
    };

    this.subCategoryLength = category.templates.length;
    var newsContent = this.loadSubCategoriesContent(this.state.currentSubCategory, category, imageURL);
    var newsTitle = this.loadSubCategoriesTitle(category);
    var subCategoryTransform = {
        transform: `translateX(-${49*this.state.sliderProgress}px)`
    };

    return(
      <div className="headline">
        <div className="headline__digest">
          <div className="headline__image-swiper">
            <button onClick={()=>{this.swipeDigest(-1)}} className="headline__swiper-previous" />
            <button onClick={()=>{this.swipeDigest(1)}} className="headline__swiper-next" />
            <ul style={digestTransform} >
            {
              digestList.map((article, index)=>{
                return (
                      <li key={index}><a href={article.url.url}><img src={imageURL.imagePrefix + article.thumbnail.hash + imageURL.imagePostfix}/></a></li>
                );
              })
            }
            </ul>
            <div className="headline__bulletControllers" onClick={(e)=>{this.swipeDigest(0, e.target.dataset.index)}}>
            {bulletControllers}
            </div>
          </div>

          <a href={currentDigest.url.url} className="headline__digestContent">
            <h2>{currentDigest.title}</h2>
            <div><span>{currentDigest.categoryName}</span> | <span>{currentDigest.publisher}</span></div>
          </a>
        </div>
        <div className="headline__minorContent">
          <div className="headline__otherCategories">
            <div className="headline__subTitleContainer">
              <div className="headline__subCategoryTitles">
                <ul style={subCategoryTransform}>
                  {newsTitle}
                </ul>
              </div>
              <div className="global__sliderController">
                <button onClick={()=>{this.slider(-1)}} className="global__previousCategory"></button>
                <button onClick={()=>{this.slider(1)}} className="global__nextCategory"></button>
              </div>
            </div>
            <div className="headline__subCategoryContents">
              <ul>
                {newsContent}
              </ul>
            </div>
          </div>
          <div className="headline__hotNews">
            <Hotnews 
              categories={categories} 
              categoryList={categoryList} 
              currentCategory = {currentCategory}
            />
          </div>
        </div>
      </div>

    );
  }
}
