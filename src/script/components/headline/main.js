import React from "react"

export default class Headline extends React.Component{

  constructor(props){
    super(props);
    this.imagePrefix = "https://obs.line-scdn.net/";
    this.imagePostfix = "/w1200";
  }

  render(){
    const {category} = this.props;
    if (typeof category == "undefined"){
      return null;
    }
    return(
      <div className="headline">
        <div className="headline__digest">
          <div className="headline__image-swiper">
            <ul>
            {
              category.templates[0].sections.map((section)=>{
                return section.articles.map((article, index)=>{
                  return (
                        <li><a><img src={this.imagePrefix + article.thumbnail.hash + this.imagePostfix}/></a></li>
                  );
                })
              })
            }
            </ul>
          </div>

          <div>
            <h2>hi</h2>
            <p></p>
            <div></div>
          </div>
        </div>
      </div>

    );
  }
}
