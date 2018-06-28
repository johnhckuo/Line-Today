import React from "react"

export default class Headline extends React.Component{

  constructor(props){
    super(props);
    this.imagePrefix = "https://obs.line-scdn.net/";
    this.imagePostfix = "/w1200";
    this.loadDigest = this.loadDigest.bind(this);
    this.loadCategoryList = this.loadCategoryList.bind(this);
    this.swipeDigest = this.swipeDigest.bind(this);
    this.loadHotNews = this.loadHotNews.bind(this);
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
    var newsList = [];

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
      newsList.push({title: category.templates[i].title, subCategory: subCategoryList});
    }
    return newsList;
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

  loadHotNews(category){
    var newsList = [];

    for (var i = 1 ; i < category.templates.length ; i++){
      var subCategoryList = [];
      if (category.templates[i].type != 6){
        continue;
      }
      var sections = category.templates[i].sections;
      for (var j = 0 ; j < sections.length ; j++){
        var articles = category.templates[i].sections[j].articles;
        for (var z = 0 ; z < articles.length ; z++){
          var article = articles[z];
          console.log(article.categoryName)
          if (typeof article.title == "undefined"){
            continue;
          }
          subCategoryList.push(
            <li>
              <a href={article.url.url}>
                <div>{article.title}</div>
              </a>
            </li>
          );
        }
      }
      newsList.push(subCategoryList);
    }
    return newsList;


  }

  render(){
    const {category, windowWidth, categoryList} = this.props;
    if (typeof category == "undefined"){
      return null;
    }
    var digestList = this.loadDigest(category);
    var newsList = this.loadCategoryList(category);
    var hotNewsList = this.loadHotNews(category);
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
        <div className="headline__minorContent"> 
          <div className="headline__otherCategories">
              {
                newsList.map(category=>{
                  return <div className="headline__sub-category"><h3 className="title">{category.title}</h3><ul>{category.subCategory}</ul></div>;
                })
              }
          </div>
          <div className="headline__hotNews">
            <h3>熱門</h3>
            <div className="category_slider">
              <ul>
                {
                  categoryList.map(category=>{
                    return <li>{category.name}</li>;
                  })

                }
              </ul>
            </div>
            <div className="category_rank">
              {
                hotNewsList.map(hotnews=>{
                  return <div><ul>{hotnews}</ul></div>
                })
              }
            </div>
          </div>
        </div>
      </div>

    );
  }
}
