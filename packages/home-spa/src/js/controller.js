// @ts-nocheck
// Services
import { getData }  from './service';
import { microserviceDetailsMock, teamMembers } from '../mocks/stub';
// importing images
import '../img/illustration.svg';
import '../img/404.svg';
import '../img/co-working.svg';
import '../img/bell.svg';
import '../img/shield.svg';
import '../img/talk-bubble.svg';
import '../img/login.svg';
import '../img/magnifying-glass.svg';
import '../img/Auth-illustration.svg';
import '../img/Notification-illustration.svg';
import '../img/User-profile-illustration.svg';
import '../img/Feedback-illustration.svg';
import '../img/user-female.svg';
import '../img/user-male.svg';

const microserviceCard = document.querySelector('#microservice-cards');
const carouselSlide = document.querySelector('#carousel-slide');
const spaList = document.querySelector('#banner-links');
const microserviceDetails = document.querySelector('#microservice-details');
const teamBlock = document.querySelector('#team-block');

if (microserviceCard !== null && carouselSlide !== null) {
  microserviceCard.innerHTML = `<div class="loader"></div>`;
  carouselSlide.innerHTML = `<div class="loader"></div>`;
}

const errorFetchingInformation = `
<div style="grid-column: 2; margin: auto;">
  <em class="fa fa-info" style="margin-right: .5rem;"></em>
  There was an error while fetching information.
</div>
`;

document.addEventListener('DOMContentLoaded', () => {
  window.OpAuthHelper.onLogin( () => {
    getData(window?.OpAuthHelper?.jwtToken).then(
      (result) => {
        buildDom(result.data.listHomeType);
      }
    ).catch(err => {
      console.error(err);
      microserviceCard.innerHTML = errorFetchingInformation;
      carouselSlide.innerHTML = errorFetchingInformation;
    });
  }); 
});

window.carouselScroll = (direction) => {
  if (direction === 'left') {
    carouselSlide.scrollBy(Math.round(-carouselSlide.getBoundingClientRect().width), 0);
  } else {
    carouselSlide.scrollBy(Math.round(carouselSlide.getBoundingClientRect().width), 0);
  }
};

window.openAppDrawer = () => {
  try {
    document.querySelector("body > op-nav").toggleDrawer('app');
  } catch(err) {
    return err;
  }
};

function buildDom(apiData) {
  apiData = apiData.map(
    data => {
      if (data.entityType === 'spa') {
        data.description = data.description.length > 300 ? data.description.slice(0, 300) + '. . .' : data.description;
      } else {
        data.description = data.description.length > 160 ? data.description.slice(0, 160) + '. . .' : data.description;
      }
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
          return `<a href="${spa.link}"><em class="fa ${spa.icon}"></em>${spa.name}</a>`;
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
            <a target="_blank" rel="noopener noreferrer" href="${carouselItem.link}">
              <em class="fa fa-external-link-alt" style="font-size: 1.5rem;"></em>
              ${carouselItem.name}
            </a>
          </h1>
          <p>
            ${carouselItem.description}
          </p>
        </div>
        <div class="grid__carousel-slide__right">
          <iframe width="500" height="280" video" src="${carouselItem.videoUrl}" frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>
      </div>`;
      }
    }
    ).join('');
  }

  if (microserviceDetails !== null) {
    microserviceDetails.innerHTML = microserviceDetailsMock.map(microservice => {
    return `<div class="microservice__details">
    <div class="microservice__details--header" id="${microservice.title.replace(/\s+/g, '-').toLowerCase()}">${microservice.title}</div>
    <div class="microservice__information">
        <div class="microservice__section">
            <div class="microservice__section--paragraph">
                ${microservice.info}
            </div>
            <div class="microservice__section--supported-features">Supported features:</div>
            <ul>
            ${microservice.features.map(feature => {
                return `<li>
                          <em class="fa fa-check-circle"></em>
                          <span>${feature}</span>
                      </li>`}).join('')}
            </ul>
        </div>
      <div class="microservice__image">
        <img src="${microservice.illustration}" 
      </div>
      </div>
      </div>`
    }).join('');
  }

  if (teamBlock !== null) {
    teamBlock.innerHTML = teamMembers.map(member => {
      return `
      <div class="team-block__list--item">
          <img src="img/${member.gender === 'male' ? 'user-male.svg': 'user-female.svg'}" alt="">
          <span class="name">${member.name}</span>
          <span class="title">${member.title}</span>
      </div>`;
    })
    .join('');
  }
}
