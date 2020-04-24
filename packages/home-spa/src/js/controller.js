// Services
import { getData }  from './service';
import { stub } from '../mocks/stub';
// importing images
import '../img/bell.svg';
import '../img/shield.svg';
import '../img/talk-bubble.svg';
import '../img/login.svg';
import '../img/magnifying-glass.svg';

const microserviceCard = document.getElementById('microservice-cards');
const carouselSlide = document.getElementById('carousel-slide');
const spaList = document.getElementById('banner__links');

microserviceCard.innerHTML = `<div class="loader"></div>`;
carouselSlide.innerHTML = `<div class="loader"></div>`;

getData().then(
  (data) => {
    buildDom(data);
  }
).catch(err => {
  buildDom(stub);
});

window.carouselScroll = (direction) => {
  if (direction === 'left') {
    carouselSlide.scrollBy(Math.round(-carouselSlide.getBoundingClientRect().width), 0);
  } else {
    carouselSlide.scrollBy(Math.round(carouselSlide.getBoundingClientRect().width), 0);
  }
};

function buildDom(apiData) {
  apiData = apiData.map(
    data => {
      data.description = data.description.length > 160 ? data.description.slice(0, 160) + '...' : data.description;
      return data;
    }
  );
  if (microserviceCard !== null) {
    microserviceCard.innerHTML = apiData.map(card => {
      if (card.entityType === 'microservice')  {
        return `<pfe-card pfe-color="lightest">
                  <div class="microservice__header" style="background: ${card.colorScheme};">
                      <img src="${card.icon}" alt="microservice-icon">
                  </div>
                  <div class="microservice__content">
                      <p class="content--text">
                          ${card.name}
                      </p>
                      <p>
                          ${card.description}
                      </p>
                  </div>
                  <pfe-cta slot="pfe-card--footer">
                      <a href="${card.link}">Learn More</a>
                  </pfe-cta>
              </pfe-card>`;
      }
    }).join('');
  }
  
  if (spaList !== null) {
    spaList.innerHTML = apiData.map(spa => 
      {
        if (spa.entityType === 'spa') {
          return `<a href="${spa.link}"><i class="fa ${spa.icon}"></i>${spa.name}</a>`;
        }
      }
    ).join('');
  }
  
  if (carouselSlide !== null) {
    carouselSlide.innerHTML = apiData.map( carouselItem => {
      if (carouselItem.entityType === 'spa') {
        return `<div class="grid__carousel-slide">
        <div class="grid__carousel-slide__left">
          <h1 class="grid__carousel-slide--title">
            <a href="${carouselItem.link}"><i class="fa ${carouselItem.icon}"></i> ${carouselItem.name}</a>
          </h1>
          <p>
            ${carouselItem.description}
          </p>
        </div>
        <div class="grid__carousel-slide__right">
          <iframe width="500" height="280" video" src="https://www.youtube.com/embed/${carouselItem.videoUrl}" frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>
      </div>`;
      }
    }
    ).join('');
  }
}