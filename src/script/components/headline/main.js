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
    console.log()
    return(
      <div className="headline__container">
        Head line
        <div className="digest">
        {
          category.templates[0].sections.map((section)=>{
            section.articles.map((article, index)=>{

              console.log(article.title)
            })


          })
        }
          <div className="image-swiper">
            <ul>
              <li><a><img /></a></li>
            </ul>
          </div>
          <div>
            <h2></h2>
            <p></p>
            <div></div>
          </div>
        </div>
      </div>

    );
  }
}
