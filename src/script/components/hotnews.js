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
    this.rankListLimit = 10;

    this.state = {
      currentTab: this.props.currentCategory,
      currentNews: 0,
      intervalId: null,
      prviousCategory: this.props.currentCategory
    }
  }

  componentDidMount(){
    let intervalId = setInterval(()=>{this.updateCurrentNews(1)}, 3000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  updateTab(type, id){
    if (type == "specify"){
      this.setState({currentTab: id})
    }else if (type == "increment"){
      this.setState((prevState)=>{
        let currentTab = prevState.currentTab + id;
        if (currentTab < 0){
          currentTab = this.props.categoryList.length - 1;
        }
        return {currentTab : currentTab % this.props.categoryList.length}
      })
    }
  }

  loadHotNews(){
    let articles = this.props.categories[this.state.currentTab].templates;
    articles = articles[articles.length-1].sections[0].articles;

    let newsList = [];
    for (let i = 0 ; i < articles.length ; i++){
      if ( i >= this.rankListLimit){
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

  loadMostViewNews(){
    let newsList = [];
    for (let x = 0 ; x < this.props.categories.length ; x++){
      let category = this.props.categories[x], maxViewNews = null;
      for (let i = 1 ; i < category.templates.length ; i++){
        let maxViewCounts = 0;
        let sections = category.templates[i].sections;
        for (let j = 0 ; j < sections.length ; j++){
          let articles = category.templates[i].sections[j].articles;
          for (let z = 0 ; z < articles.length ; z++){

            let article = articles[z];
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
    let intervalId = setInterval(()=>{this.updateCurrentNews(1)}, 3000);

    this.setState(prevState=>{
      let currentNews = prevState.currentNews;
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
    if (categories.length == 0) return null;

    if (currentCategory != this.state.previousCategory) this.initialize(currentCategory);
    let hotNewsList = this.loadHotNews();
    let mostViewList = this.loadMostViewNews();
    this.mostViewListLength = mostViewList.length;
    let rankingHeaderTransform = this.state.currentTab == 0 ? null : { transform: `translateX(-${72 + 49*(this.state.currentTab-1)}px)`};
    let mostViewedTransform = { transform: `translateX(-${0.2*windowWidth*this.state.currentNews}px)`};

    return(
      <div className="hotnews">
        <h3 className="global__title">熱門</h3>
        <div className="categoryRanking">
          <div className="categoryRanking__header">
            <ul style={rankingHeaderTransform}>
              {
                categoryList.map((category, index)=>{
                  return <li key={index} className={index == this.state.currentTab ? "currentTab" : null}><a onClick={()=>{this.updateTab('specify', index)}}>{category.name}</a></li>;
                })
              }
            </ul>
          </div>
          <div className="global__sliderController">
            <button aria-label="previousBtn" onClick={()=>{this.updateTab('increment', -1)}} className="global__previousCategory"></button>
            <button aria-label="nextBtn" onClick={()=>{this.updateTab('increment', 1)}} className="global__nextCategory"></button>
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
              <button aria-label="previousBtn" onClick={()=>{this.updateCurrentNews(-1)}} className="global__previousCategory"></button>
              <button aria-label="nextBtn" onClick={()=>{this.updateCurrentNews(1)}} className="global__nextCategory"></button>
            </div>
          </div>
          <div className="mostViewCategory__slider">
            <ul style={mostViewedTransform}>
              {
                mostViewList.map((mostViewed, index)=>{
                  return (<li key={index}>
                      <img alt="newsImage" src={this.props.imageURL.imagePrefix + mostViewed.thumbnail.hash + this.props.imageURL.imagePostfix}/>
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
