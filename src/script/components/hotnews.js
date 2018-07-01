import React from "react"

export default class Hotnews extends React.Component{

  constructor(props){
    super(props);

    this.loadHotNews = this.loadHotNews.bind(this);
    this.updateTab = this.updateTab.bind(this);
    this.loadMostViewNews = this.loadMostViewNews.bind(this);
    this.updateCurrentNews = this.updateCurrentNews.bind(this);
    this.initialize = this.initialize.bind(this);

    this.mostViewListLength = 0;
    this.imagePrefix = "https://obs.line-scdn.net/";
    this.imagePostfix = "/w1200";

    this.state = {
      currentTab: this.props.currentCategory, 
      currentNews: 0, 
      intervalId: null, 
      prviousCategory: this.props.currentCategory
    }
  }

  componentDidMount(){
    var intervalId = setInterval(()=>{this.updateCurrentNews(1)}, 3000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  updateTab(type, id, categoryLength){
    if (type == "specify"){
      this.setState({currentTab: id})
    }else if (type == "increment"){
      this.setState((prevState)=>{
        var currentTab = prevState.currentTab + id;
        if (currentTab < 0){
          currentTab = categoryLength - 1;
        }
        return {currentTab : currentTab % categoryLength}
      })
    }
  }

  loadHotNews(categories){
    var articles = categories[this.state.currentTab].templates;
    articles = articles[articles.length-1].sections[0].articles;

    var newsList = [];
    for (var i = 0 ; i < articles.length ; i++){
      if ( i >= 10){
        break;
      }
      newsList.push(<li key={i}>
                      <a href={articles[i].url.url}>
                        <div>{`${i+1} ${articles[i].title}`}</div>
                        <div className="global__publisher">{articles[i].publisher}</div>
                      </a>
                    </li>);
    }
    return newsList;
  }

  loadMostViewNews(categories){
    var newsList = [];
    for (var x = 0 ; x < categories.length ; x++){
      var category = categories[x];
      for (var i = 1 ; i < category.templates.length ; i++){
        var maxViewCounts = 0, maxViewNews = null;
        var sections = category.templates[i].sections;
        for (var j = 0 ; j < sections.length ; j++){
          var articles = category.templates[i].sections[j].articles;
          for (var z = 0 ; z < articles.length ; z++){

            var article = articles[z];
            if (typeof article.title == "undefined"){
              continue;
            }
            if (maxViewCounts < parseInt(article.viewCount)){
              maxViewCounts = article.viewCount;
              maxViewNews = article;
            }
          }
        }
      }
      if (maxViewNews!= null){
        newsList.push(maxViewNews);
      }

    }

    return newsList;
  }

  initialize(currentCategory){
    this.setState({currentTab: currentCategory, previousCategory: currentCategory})
  }

  updateCurrentNews(increment){

    if (this.state.intervalId != null){
      clearInterval(this.state.intervalId);
    }
    var intervalId = setInterval(()=>{this.updateCurrentNews(1)}, 3000);

    this.setState(prevState=>{
      var currentNews = prevState.currentNews;
      currentNews += increment;
      if (currentNews < 0){
        currentNews = this.mostViewListLength - 1;
      }
      return {
        currentNews : currentNews % this.mostViewListLength,
        intervalId : intervalId
      };
    });
  }

  render(){
    const {categories, categoryList, currentCategory, windowWidth} = this.props;
    if (currentCategory != this.state.previousCategory){
      this.initialize(currentCategory);
    }
    if (categories.length == 0){
      return null;
    }
    var hotNewsList = this.loadHotNews(categories);
    var categoryLength = categoryList.length;
    var mostViewList = this.loadMostViewNews(categories);
    this.mostViewListLength = mostViewList.length;
    var rankingHeaderTransform = this.state.currentTab == 0 ? null : { transform: `translateX(-${72 + 49*(this.state.currentTab-1)}px)`};

    var mostViewedTransform = { transform: `translateX(-${0.2*windowWidth*this.state.currentNews}px)`};
    return(
      <div className="hotnews">
        <h3 className="global__title">熱門</h3>
        <div className="categoryRanking">
          <div className="categoryRanking__header">
            <ul style={rankingHeaderTransform}>
              {
                categoryList.map((category, index)=>{
                  return <li key={index} className={index == this.state.currentTab ? "currentTab" : null}><a onClick={()=>{this.updateTab('specify', index, categoryLength)}}>{category.name}</a></li>;
                })

              }
            </ul>
          </div>
          <div className="global__sliderController">
            <button onClick={()=>{this.updateTab('increment', -1, categoryLength)}} className="global__previousCategory"></button>
            <button onClick={()=>{this.updateTab('increment', 1, categoryLength)}} className="global__nextCategory"></button>
          </div>
        </div>
        <div className="categoryRanking__content">
          <ol>
            {hotNewsList}
          </ol>
        </div>
        <div className="mostViewCategory">
          <div className="mostViewCategory__header">
            <h3 className="global__title">熱門消息</h3>
            <div className="global__sliderController">
              <button onClick={()=>{this.updateCurrentNews(-1)}} className="global__previousCategory"></button>
              <button onClick={()=>{this.updateCurrentNews(1)}} className="global__nextCategory"></button>
            </div>
          </div>
          <div className="mostViewCategory__slider">
            <ul style={mostViewedTransform}>
              {
                mostViewList.map((mostViewed, index)=>{
                  return (<li key={index}>
                      <img alt="newsImage" src={this.imagePrefix + mostViewed.thumbnail.hash + this.imagePostfix}/>
                      <div>{mostViewed.title}</div>
                      <div className="global__publisher">{mostViewed.publisher}</div>
                    </li>);
                })
              }
            </ul>
          </div>

        </div>
      </div>
    );
  }
}
