// Services
import { spas, microservices, carouselList } from './service.js';

const microserviceCard = document.getElementById('microservice-cards');

const spaList = document.getElementById('banner__links');

const carouselSlide = document.getElementById('carousel-slide');
const carouselRightBtn = document.getElementById('fab-right');
const carouselLeftBtn = document.getElementById('fab-left');

if (microserviceCard !== null) {
  microserviceCard.innerHTML = microservices.map(card => `
  <pfe-card pfe-color="lightest">
      <div class="microservice__header" style="background: ${card.boxColor};">
          <img src="${card.imageSrc}" alt="microservice-icon">
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
          <a href="#">${card.action}</a>
      </pfe-cta>
  </pfe-card>
  `)
  .join('');
}

if (spaList !== null) {
  spaList.innerHTML = spas.map(spa => `
    <a href="${spa.link}"><i class="fa ${spa.icon}"></i>${spa.name}</a>`
  )
  .join('');
}

if (carouselSlide !== null) {
  carouselSlide.innerHTML = carouselList.map( carouselItem => `
  <div class="grid__carousel-slide">
    <div class="grid__carousel-slide__left">
      <h1 class="grid__carousel-slide--title">
        ${carouselItem.title}</h1>
      <p>
        ${carouselItem.description}
      </p>
    </div>
    <div class="grid__carousel-slide__right">
      <iframe width="500" height="280" video" src="https://www.youtube.com/embed/${carouselItem.url}" frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    </div>
  </div>
  `)
  .join('');
}

window.carouselScroll = (direction) => {
  if (direction === 'left') {
    carouselSlide.scrollBy(Math.round(-carouselSlide.getBoundingClientRect().width), 0);
  } else {
    carouselSlide.scrollBy(Math.round(carouselSlide.getBoundingClientRect().width), 0);
  }
};