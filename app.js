// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.response);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();


//  init selects
document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
  loadNews();
});


const newsService = (function(){
  const apiKey = "13b38029fda04af48825047097963478"
  const apiUrl = 'https://news-api-v2.herokuapp.com'

  return{
    topHeadLines(country,callback){
    http.get(`${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`,callback)
    },
    everything(query,callback){
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`,callback)
    }
  }
})();

// elements

const form = document.forms["newsControls"];
const countrySearch = form.elements["country"];
const searchInput = form.elements["search"];

// loadNews
form.addEventListener("submit",(e)=>{
  e.preventDefault();
  loadNews();
});

function loadNews(){
startPreloader();
const country = countrySearch.value;
const searh = searchInput.value;
if(!searh){
newsService.topHeadLines(country,getResponce);
}
else{
  newsService.topHeadLines(searh,getResponce);
}
}

function getResponce(err,res){
  finishPreloader();
  if(err){
    showAlert(err,"error-msg")
    return;
  }
  renderNews(res.articles)
}

function renderNews(news){
  const container = document.querySelector(".news-container .row");
  if(container.children.length){
    clearContainer(container);
  }
  let fragment = "";
  news.forEach(newsEl=>{
    const el = newsTemplate(newsEl);
    fragment+=el;
  });
  container.insertAdjacentHTML("afterbegin",fragment)
}

function newsTemplate({urlToImage,title,url,description}){
  return `
   <div class = "col s12">
     <div class = "card">
    <div class ="card-image">
    <img src = "${urlToImage}">
    <span class = "card-title">${title|| " "}</span>
    </div>
    <div class ="card-content">
    <p>${description|| " "}</p>
    </div>

    <div class = "card-action">
    <a href = "${url}">Read more </a>
    </div>
     </div>
   </div>
  
  `
}

function showAlert(msg,type){
  M.toast({html:msg, classes:type})
}

function clearContainer(container){
  let child = container.lastElementChild;
  while(child){
  container.removeChild(child);
  child = container.lastElementChild
  }
}

function startPreloader(){
  document.body.insertAdjacentHTML("afterbegin",`
  
  <div class="progress">
  <div class="determinate" style="width: 70%"></div>
</div>
    `);
}

function finishPreloader(){
  const preloader = document.querySelector(".progress");
  if(preloader){
    preloader.remove();
  }
}
