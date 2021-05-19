import * as microservices from '../res/static/microservices.json';

export const microserviceCards = () => {
    const microservicesCardDetails = microservices.default;
    const microserviceHTMLObject = document.querySelector('#microservice-cards');
    if (microserviceHTMLObject !== null) {
        microserviceHTMLObject.innerHTML = microservicesCardDetails.map(
            (details) => {
                return `<div class="section__microservices-card">
                <div class="section__microservices-card-header">
                  <div class="section__microservices-card-header-image" style="background-color: ${details.imgBgColor}">
                    <img src="${details.icon}" alt="">
                  </div>
                  <h3>
                    ${details.name}
                  </h3>
                </div>
                <div class="section__microservices-card-description">
                  ${details.description}
                </div>
                <a target="_blank" href="${details.link}" class="section__microservices-card-cta">
                  Read More
                </a>
              </div>`;
            } 
        ).join('');
    }
};

export const applicationCards = (spas) => {
  const appCards = document.querySelector('#applications-cards');
  if (appCards !== null) {
    appCards.innerHTML = spas.map(
      (spa) => {
        return`<a target="_blank" href="${spa.link}" class="section__applications-card">
          <div class="section__applications-card-image">
            <img src="${spa.active ? '../res/img/redcube.svg': '../res/img/cube.svg'}" alt="cube">
          </div>
          <div class="section__applications-card-label">
            <label>${spa.name}</label>
            <i class="fas fa-external-link-alt"></i>
          </div>
        </a>`;
      }
    ).join('');
  }
};

window.selector = (element) => {
  const sideBarLinks = document.querySelector('#sidebar-links').querySelectorAll('li');
  if (sideBarLinks !== null) {
    for (let listNode of sideBarLinks) {
      listNode.classList.remove('pf-m-current')
    }
  }
  element.classList.add('pf-m-current');
};
