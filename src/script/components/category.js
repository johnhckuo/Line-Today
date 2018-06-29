import React from "react"
import Hotnews from "./hotnews"

export default class Category extends React.Component{

  constructor(props){
    super(props);
    this.loadCategory = this.loadCategory.bind(this);
    this.categoryId = -1;
  }

  loadCategory(categories, imageURL){
    var newsList = [];
    var category = null;
    for (var i = 0 ; i < categories.length ; i++){
      if (categories[i].id == this.categoryId){
        category = categories[i];
        break;
      }
    }
    for (var i = 0 ; i < category.templates.length ; i++){
      var subCategoryList = [];
      var sections = category.templates[i].sections;
      for (var j = 0 ; j < sections.length ; j++){
        var articles = category.templates[i].sections[j].articles;
        for (var z = 0 ; z < articles.length ; z++){
          var article = articles[z];
          if (typeof article.title == "undefined"){
            continue;
          }
          subCategoryList.push(
            <li key={article.id}>
              <a href={article.url.url}>
                <img src={imageURL.imagePrefix + article.thumbnail.hash + imageURL.imagePostfix}/>
                <div className="category__newsTitle">
                  <p>{article.title}</p>
                  <div className="publisher">{article.publisher}</div>
                </div>
              </a>
            </li>
          );
        }
      }
      newsList.push({title: category.templates[i].title, subCategory: subCategoryList});
    }
    return {categoryTitle: category.name, newsList};
  }

  render(){
    const {categories, categoryList, imageURL} = this.props;
    this.categoryId = this.props.location.pathname.split("/").pop();
    if (categories.length > 0){
      var category = this.loadCategory(categories, imageURL);
    }else{
      return null;
    }
    return (
        <div className="category">
          <div className="category__news">
            <h2>{category.categoryTitle}</h2>
            <ul>
              {
                category.newsList.map((category, index)=>{
                  return <div key={index} className="category__sub-category"><h3 className="title">{category.title}</h3><ul>{category.subCategory}</ul></div>;
                })
              }
            </ul>
          </div>
          <div className="category__hotnews">
            <Hotnews categories={categories} categoryList={categoryList}/>
          </div>
        </div>
    );
  }
}
