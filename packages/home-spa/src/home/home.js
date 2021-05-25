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

export const applicationCards = (spas, spaType = "BUILTIN") => {
  const appCards = document.querySelector('#applications-cards');
  if (appCards !== null) {
    appCards.innerHTML = spas
    .filter(spa => spa.applicationType === spaType)
    .map(
      (spa) => {
        return `
        <a 
          target="_blank" 
          ${!spa.active ? '': 'href="' + spa.link + '"'} 
          style="${spa.active ? '': 'cursor: no-drop'}" 
          class="section__applications-card">
          <div class="section__applications-card-image">
            <img src="${spa.active ? '../res/img/redcube.svg': '../res/img/cube.svg'}" alt="cube">
          </div>
          <div class="section__applications-card-label">
            <label>${spa.name.length > 20 ? spa.name.slice(0, 20) + '...' : spa.name}</label>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" 
            viewBox="0 0 12 12"><g transform="translate(0.5 0.5)">
            <path d="M11,6.5V9a2.006,2.006,0,0,1-2,2H2A2.006,2.006,0,0,1,0,9V2A2.006,2.006,0,0,1,2,0H4.5" fill="none" 
            stroke="#4d4d4d" stroke-miterlimit="10" stroke-width="1"/><line x1="5.5" y2="5.5" 
            transform="translate(5.5)" fill="none" stroke="#4d4d4d" 
            stroke-miterlimit="10" stroke-width="1"/><path d="M6.5,0H11V4.5" fill="none" 
            stroke="#4d4d4d" stroke-miterlimit="10" stroke-width="1"/></g></svg>
          </div>
        </a>`;
      }
    ).join('');
  }
};

window.selectSideNav = (element) => {
  const sideBarLinks = document.querySelector('#sidebar-links').querySelectorAll('li');
  if (sideBarLinks !== null) {
    for (let listNode of sideBarLinks) {
      listNode.classList.remove('pf-m-current')
    }
  }
  element.classList.add('pf-m-current');
};

window.selectTab = (element) => {
  const tabList = document.querySelector('#app-tabs').querySelectorAll('li');
  if (tabList !== null) {
    for (let listNode of tabList) {
      listNode.classList.remove('pf-m-current')
    }
  }
  element.classList.add('pf-m-current');
  applicationCards(JSON.parse(localStorage.getItem('spaList')), element.attributes.value.value)
};
