// Services
import { getData }  from './service.js';

const microserviceCard = document.getElementById('microservice-cards');

const spaList = document.getElementById('banner__links');

const carouselSlide = document.getElementById('carousel-slide');

getData().then(
  (data) => {
    if (microserviceCard !== null) {
      microserviceCard.innerHTML = data.map(card => {
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
      spaList.innerHTML = data.map(spa => 
        {
          if (spa.entityType === 'spa') {
            return `<a href="${spa.link}"><i class="fa ${spa.icon}"></i>${spa.name}</a>`;
          }
        }
      ).join('');
    }
    
    if (carouselSlide !== null) {
      carouselSlide.innerHTML = data.map( carouselItem => {
        if (carouselItem.entityType === 'spa') {
          return `<div class="grid__carousel-slide">
          <div class="grid__carousel-slide__left">
            <h1 class="grid__carousel-slide--title">
              ${carouselItem.name}</h1>
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
);

window.carouselScroll = (direction) => {
  if (direction === 'left') {
    carouselSlide.scrollBy(Math.round(-carouselSlide.getBoundingClientRect().width), 0);
  } else {
    carouselSlide.scrollBy(Math.round(carouselSlide.getBoundingClientRect().width), 0);
  }
};