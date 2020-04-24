// Services
import { getData }  from './service';
import { stub } from '../mocks/stub';
// importing images
import '../img/bell.svg';
import '../img/shield.svg';
import '../img/talk-bubble.svg';
import '../img/login.svg';
import '../img/magnifying-glass.svg';

const microserviceCard = document.querySelector('#microservice-cards');
const carouselSlide = document.querySelector('#carousel-slide');
const spaList = document.querySelector('#banner-links');
const footer = document.querySelector('footer');
const band = document.querySelector('#band');

if (microserviceCard !== null && carouselSlide !== null) {
  microserviceCard.innerHTML = `<div class="loader"></div>`;
  carouselSlide.innerHTML = `<div class="loader"></div>`;
}

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

  if (footer !== null) {
    footer.innerHTML = `
    <div class="container footer">
    <div class="footer__links-col">
      <div class="footer__links-header">
        Quick links
      </div>
      <div class="footer__links">
        <a href="#">One Portal in Mojo</a>
        <a href="#">Weekly Blog</a>
        <a href="#">Contact Us</a>
        <a href="#">Changelog</a>
        <a href="#">Subscribe to One Portal List</a>
      </div>
    </div>
    <div class="footer__links-col">
      <div class="footer__links-header">
        Related sites
      </div>
      <div class="footer__links">
        <a href="#">PnT Help</a>
        <a href="#">PnT DevOps (Mojo)</a>
        <a href="#">PnT Stats</a>
        <a href="#">Projects Engineering</a>
      </div>
    </div>
    <div class="footer__links-col">
      <div class="footer__links-header">
        Help
      </div>
      <div class="footer__links">
        <a href="#">One Portal FAQs</a>
        <a href="#">File an Issue</a>
        <a href="mailto:one-portal-devel@redhat.com">one-portal-devel@redhat.com</a>
      </div>
    </div>
  </div>
  <div class="footer__copyright">
    Copyright &copy; 2020 Red Hat Inc. Internal Use Only
  </div>`;
  }

  if (band !== null) {
    band.innerHTML = `
    <div class="band__header">
			Join the One Platform Digital Experience!
		</div>
		<button class="band__button--primary-border">Get Started</button>`;
  }
}