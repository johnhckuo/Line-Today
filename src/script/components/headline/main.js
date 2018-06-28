import React from "react"

export default class Headline extends React.Component{

  constructor(props){
    super(props);
    this.imagePrefix = "https://obs.line-scdn.net/";
    this.imagePostfix = "/w1200";
    this.loadDigest = this.loadDigest.bind(this);
    this.loadCategoryList = this.loadCategoryList.bind(this);
    this.swipeDigest = this.swipeDigest.bind(this);
    this.state = {currentDigest: 0}
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


  loadCategoryList(category){
    var categoryList = [];

    for (var i = 1 ; i < category.templates.length ; i++){
      var subCategoryList = [];
      var sections = category.templates[i].sections;
      for (var j = 0 ; j < sections.length ; j++){
        var articles = category.templates[i].sections[j].articles;
        for (var z = 0 ; z < articles.length ; z++){
          var article = articles[z];
          if (typeof article.title == "undefined"){
            continue;
          }
          var newsType = "horizon_news";
          if (j == 0 && z < 4){
            newsType = "vertical_news";
          }

          subCategoryList.push(
            <li className={newsType}>
              <a href={article.url.url}>
                <img src={this.imagePrefix + article.thumbnail.hash + this.imagePostfix}/>
                <div className="newsTitle">
                  <div>{article.title}</div>
                  <div className="publisher">{article.publisher}</div>
                </div>
              </a>
            </li>
          );
        }
      }
      categoryList.push({title: category.templates[i].title, subCategory: subCategoryList});
    }
    return categoryList;
  }

  swipeDigest(offset, digestLength){
    var {currentDigest} = this.state;
    currentDigest += offset;
    if (currentDigest < 0){
      currentDigest = digestLength - 1;
    }
    this.setState({
      currentDigest : currentDigest % digestLength
    });
  }

  render(){
    const {category, windowWidth} = this.props;
    if (typeof category == "undefined"){
      return null;
    }
    var digestList = this.loadDigest(category);
    var categoryList = this.loadCategoryList(category);

    var currentDigest = digestList[this.state.currentDigest];
    var digestTransform = { 
        transform: `translateX(-${windowWidth * 0.55*this.state.currentDigest}px)` 
    };


    return(
      <div className="headline">
        <div className="headline__digest">
          <div className="headline__image-swiper">
            <button onClick={()=>{this.swipeDigest(-1, digestList.length)}} className="headline__swiper-previous" />
            <button onClick={()=>{this.swipeDigest(1, digestList.length)}} className="headline__swiper-next" />
            <ul style={digestTransform} >
            {
              digestList.map((article, index)=>{
                return (
                      <li><a><img src={this.imagePrefix + article.thumbnail.hash + this.imagePostfix}/></a></li>
                );
              })
            }
            </ul>
          </div>

          <div className="headline__digestContent">
            <h2>{currentDigest.title}</h2>
            <div><span>{currentDigest.categoryName}</span> | <span>{currentDigest.publisher}</span></div>
          </div>
        </div>
        <div className="headline__otherCategories">
          
            {
              categoryList.map(category=>{
                return <div className="headline__sub-category"><h3 className="title">{category.title}</h3><ul>{category.subCategory}</ul></div>;
              })
            }
          
          <div></div>
        </div>
      </div>

    );
  }
}
