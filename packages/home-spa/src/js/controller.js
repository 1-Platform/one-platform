// @ts-nocheck
// Services
import { getData }  from './service';
import { microserviceDetailsMock, teamMembers } from '../mocks/stub';

const microserviceCard = document.querySelector('#microservice-cards');
const apps = document.querySelector("#apps > ul")
const spaList = document.querySelector('#banner-links');
const microserviceDetails = document.querySelector('#microservice-details');
const teamBlock = document.querySelector('#team-block');

const ASSETS_URL = '/assets/';

if (microserviceCard !== null && apps !== null) {
  microserviceCard.innerHTML = `<div class="loader"></div>`;
  apps.innerHTML = `<div class="loader"></div>`;
}

const errorFetchingInformation = `
<div style="grid-column: 2; margin: auto;">
  <em class="fa fa-info" style="margin-right: .5rem;"></em>
  There was an error while fetching information.
</div>
`;

window.OpAuthHelper.onLogin( () => {
  getData()
    .then((result) => {
      buildDom(result.data.listHomeType);
    })
    .catch( err => {
      console.error(err);
      microserviceCard.innerHTML = errorFetchingInformation;
      apps.innerHTML = errorFetchingInformation;
    });
})

window.carouselScroll = (direction) => {
  if (direction === 'left') {
    apps.scrollBy(Math.round(-apps.getBoundingClientRect().width), 0);
  } else {
    apps.scrollBy(Math.round(apps.getBoundingClientRect().width), 0);
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
                  <div class="card__header">
                      <img src="${card.icon}" alt="microservice-icon">
                      <h3>
                          ${card.name}
                      </h3>
                  </div>
                  <div class="card__content">
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

  if (apps !== null) {
    apps.innerHTML = apiData.map( app => {
      return `
      <li class="op-menu-drawer__app-list-item ${ app.active ? '' : 'inactive' }">
        <a href="${ app.link }">
          <div>
            <img src="${ app.icon || ASSETS_URL + 'assets/rh-hat-logo.svg' }"/>
          </div>
          <span>
            ${ app.name }
          </span>
        </a>
      </li>
      `}
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
          <img src="/img/${member.gender === 'male' ? 'user-male.svg': 'user-female.svg'}" alt="">
          <span class="name">${member.name}</span>
          <span class="title">${member.title}</span>
      </div>`;
    })
    .join('');
  }
}
