import React from "react"
import Hotnews from "./hotnews"
import styleVar from '../../style/utilities/variables.scss'

export default class Headline extends React.Component{

  constructor(props){
    super(props);

    this.loadDigest = this.loadDigest.bind(this);
    this.swipeDigest = this.swipeDigest.bind(this);
    this.createBulletControllers = this.createBulletControllers.bind(this);
    this.loadSubCategoriesContent = this.loadSubCategoriesContent.bind(this);
    this.loadSubCategoriesTitle = this.loadSubCategoriesTitle.bind(this);
    this.updateCurrentSubCategory = this.updateCurrentSubCategory.bind(this);
    this.updateSubCategorySlider = this.updateSubCategorySlider.bind(this);
    this.getDigestTransform = this.getDigestTransform.bind(this);

    this.digestListLength = 0;
    this.subCategoryLength = 0;
    this.sliderProgressLimit = 4;

    this.state = {
      currentDigest: 0,
      intervalId: null,
      currentSubCategory: 1,
      sliderProgress: 0
    };
  }

  componentDidMount(){
    let intervalId = setInterval(()=>{this.swipeDigest(1)}, 3000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
     clearInterval(this.state.intervalId);
  }

  loadDigest(category){
    let digestList = [];
    for (let i = 0 ; i < category.templates[0].sections.length ; i++){
      let section = category.templates[0].sections[i];
      for (let j = 0 ; j < section.articles.length ; j++){
        let article = section.articles[j];
        digestList.push(article);
      }
    }
    return digestList;
  }

  loadSubCategoriesContent(){
    let category = this.props.categories[0], newsList = [];
    let sections = category.templates[this.state.currentSubCategory].sections;
    for (let j = 0 ; j < sections.length ; j++){
      for (let z = 0 ; z < sections[j].articles.length ; z++){
        let article = sections[j].articles[z];
        if (typeof article.title == "undefined") continue;
        newsList.push(
          <li className={j == 0 && z < 4 && this.props.device == "pc" ? "headline__verticalNews" : "headline__horizonNews"} key={article.id}>
            <a href={article.url.url}>
              <img alt="newsImage" src={this.props.imageURL.imagePrefix + article.thumbnail.hash + this.props.imageURL.imagePostfix}/>
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

  loadSubCategoriesTitle(){
    let category = this.props.categories[0];
    let subCategoryTitles = [];
    for (let i = 0 ; i < this.subCategoryLength ; i++){
      let subCategory = category.templates[i];
      if (typeof subCategory.title != 'undefined'){
        let chosenCategoryClass = "";
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
    let intervalId = setInterval(()=>{this.swipeDigest(1)}, 3000);

    let {currentDigest} = this.state;
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
    let bulletControllers = [];
    for (let i = 0 ; i < this.digestListLength ; i++){
      bulletControllers.push(<span key={i} data-index={i} className={this.state.currentDigest == i ? "activeBullet" : "inactiveBullet"}></span>)
    }
    return bulletControllers;
  }

  updateSubCategorySlider(increment){
    this.setState(prevState=>{
      let sliderProgress = prevState.sliderProgress;
      sliderProgress += increment;
      if (sliderProgress < 0){
        sliderProgress = this.sliderProgressLimit;
      }else if (sliderProgress >= this.sliderProgressLimit){
        sliderProgress = 0;
      }
      return {sliderProgress};
    });
  }

  getDigestTransform(){
    let offset = 0;
    if (this.props.device == "phone"){
      offset = styleVar.phone_image_width;
    }else{
      offset = styleVar.pc_image_width;
    }
    offset = offset.split("vw")[0] / 100;

    return {
        transform: `translateX(-${this.props.windowWidth * offset *this.state.currentDigest}px)`
    };

  }

  render(){
    const {categories, windowWidth, categoryList, imageURL, currentCategory} = this.props;
    if (categories.length <= 0) return null;

    let category = categories[0];
    this.subCategoryLength = category.templates.length;
    let digestList = this.loadDigest(category);
    this.digestListLength = digestList.length;

    let bulletControllers = this.createBulletControllers();
    let currentDigest = digestList[this.state.currentDigest];
    let digestTransform = this.getDigestTransform();
    let newsContent = this.loadSubCategoriesContent();
    let newsTitle = this.loadSubCategoriesTitle();

    let subCategoryTransform = {
      transform: `translateX(-${windowWidth/3*this.state.sliderProgress}px)`
    };

    return(
      <div className="headline">
        <div className="headline__digest">
          <div className="headline__image-swiper">
            <button aria-label="previousBtn" onClick={()=>{this.swipeDigest(-1)}} className="headline__swiper-previous" />
            <button aria-label="nextBtn" onClick={()=>{this.swipeDigest(1)}} className="headline__swiper-next" />
            <ul style={digestTransform} >
            {
              digestList.map((article, index)=>{
                return (
                      <li key={index}><a href={article.url.url}><img alt="newsImage" src={imageURL.imagePrefix + article.thumbnail.hash + imageURL.imagePostfix}/></a></li>
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
            <div><span>{currentDigest.categoryName} | </span><span>{currentDigest.publisher}</span></div>
          </a>
        </div>
        <div className="headline__minorContent">
          <div className="headline__otherCategories">
            <div className="global__subTitleContainer">
              <div className="global__subCategoryTitles">
                <ul style={subCategoryTransform}>
                  {newsTitle}
                </ul>
              </div>
              <div className="global__sliderController">
                <button onClick={()=>{this.updateSubCategorySlider(-1)}} className="global__previousCategory"></button>
                <button onClick={()=>{this.updateSubCategorySlider(1)}} className="global__nextCategory"></button>
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
              windowWidth = {windowWidth}
              imageURL = {imageURL}
            />
          </div>
        </div>
      </div>

    );
  }
}
