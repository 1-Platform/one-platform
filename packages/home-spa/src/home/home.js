import * as microservices from '../res/static/microservices.json';
import { deploySPA, addApp } from '../service/service';

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
                <a target="_blank" rel="noopener" href="${details.link}" class="section__microservices-card-cta">
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
    .slice(0, 12)
    .map(
      (spa) => {
        const icon = ((spa.icon === "") || (spa.icon === null)) ?  '../res/img/redcube.svg' : spa.icon;
        const addStyle = ((spa.icon === "") || (spa.icon === null)) ?  '' 
        : 'style="filter:invert(21%) sepia(54%) saturate(5781%) hue-rotate(322deg) brightness(74%) contrast(126%)"';
        return `
        <a 
          target="_blank" 
          ${!spa.isActive ? '': 'href="' + spa.path + '"'} 
          style="${spa.isActive ? '': 'cursor: no-drop'}" 
          class="section__applications-card">
          <div class="section__applications-card-image">
            <img src="${spa.isActive ? icon : '../res/img/cube.svg'}" ${addStyle} alt="cube">
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
    sideBarLinks.forEach((listNode )=> listNode.classList.remove('pf-m-current'))
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

window.openAppDrawer = () => {
  try {
    document.querySelector("body > op-nav").toggleDrawer('app');
  } catch(err) {
    return err;
  }
};

window.toggleDeployModal = (state) => {
  const modal = document.querySelector('#deploy-spa-modal');
  modal.style.display = state;
  document.querySelector( 'body' ).style.overflow = state === 'block' ? 'hidden' : 'visible';
  document.querySelector('#deploy-form').reset();

};

window.onload = () => {
  const main = document.querySelector('#sidebar-links').querySelectorAll('li');
  const sections = document.querySelectorAll("#section-main > div");
  sections.forEach( (section, index) => {
    const observer = new IntersectionObserver( (entry) => {
      if (entry[0].isIntersecting) {
        main.forEach((listNode) => listNode.classList.remove('pf-m-current'))
        main[index].classList.add('pf-m-current');
      }
    }, {
      rootMargin: "-50% 0px",
    });
    observer.observe(section);
  })
}

// Form Validations
const spaList = JSON.parse(localStorage.getItem('spaList'));
document.addEventListener( 'DOMContentLoaded', () => {
  document.querySelector('#deploy-form').addEventListener('change', validate);
} );

window.validate = () => {
  const submitBtn = document.querySelector('#deploy-submit');
  const validateForm = checkAppName() && checkAppPath();
  submitBtn.disabled = !validateForm;
  return validateForm;
}

window.checkAppName = () => {
  const appNameInput = document.querySelector('#app-name');
  const appNames = spaList.map(spa => spa.name.toLowerCase());
  const helper = document.querySelector('#app-name-helper');
  const value = appNameInput.value.toLowerCase().trim();
  if (!appNames.includes(value) && value !== '') {
    helper.classList.remove('pf-m-error')
    helper.classList.add('pf-m-success');
    helper.innerHTML = 'SPA name available.'
    appNameInput.classList.add('pf-m-success');
    appNameInput.setAttribute('aria-invalid', 'false');
    return true;
  }
  helper.innerHTML = 
  helper.classList.remove('pf-m-success')
  helper.classList.add('pf-m-error');
  helper.innerHTML = 'SPA name invalid or already in use.'
  appNameInput.classList.remove('pf-m-success');
  appNameInput.setAttribute('aria-invalid', 'true');
  return false;
};

window.checkAppPath = () => {
  const appPathInput = document.querySelector('#app-path');
  const appPath = spaList.map(spa => spa.path.toLowerCase());
  const helper = document.querySelector('#app-path-helper');
  const regex = /^\/[-a-z]+$/;
  const value = appPathInput.value;
  if (!appPath.includes(value) && regex.test(value)) {
    helper.classList.remove('pf-m-error')
    helper.classList.add('pf-m-success');
    helper.innerHTML = 'Path available.'
    appPathInput.classList.add('pf-m-success');
    appPathInput.setAttribute('aria-invalid', 'false');
    return true;
  }
  helper.innerHTML = 
  helper.classList.remove('pf-m-success')
  helper.classList.add('pf-m-error');
  helper.innerHTML = 'App path url invalid or already in use, please check the guide.'
  appPathInput.classList.remove('pf-m-success');
  appPathInput.setAttribute('aria-invalid', 'true');
  return false;
};

window.submitForm = () => {
  if (!validate()) {
    return;
  }
  const appData = {
    name: document.querySelector('#app-name').value,
    path: document.querySelector('#app-path').value,
    description: document.querySelector('#app-description').value,
    upload: document.querySelector('#app-file').files[0],
    ref: document.querySelector('#app-ref').value,
  };
  const formData = new FormData()
  Object.keys(appData).forEach(key => formData.append(key, appData[key]));
  document.querySelector('#deploy-submit').innerHTML = ` 
  <span class="pf-c-spinner pf-m-md" style="--pf-c-spinner--Color: #C9190B;" role="progressbar" aria-valuetext="Loading...">
    <span class="pf-c-spinner__clipper"></span>
    <span class="pf-c-spinner__lead-ball"></span>
    <span class="pf-c-spinner__tail-ball"></span>
  </span>
  Deploying Now`;
  document.querySelector('#deploy-submit').disabled = true;
  addApp(appData).then( () => {
    deploySPA(formData).then( (response) => {
      window.OpNotification.success({ 
        subject: 'App Deployed Successfully',
        body: 'You will be redirected to the dev console page shortly',
        link: response.data.path
      })
      setTimeout(() => window.location.href = `/console/${response.data.path}`, 3000)
    })
  } )
  .catch(err => {
    console.error(err);
    window.OpNotification.danger({ 
      subject: 'There was an error deploying the app, please try again from the Developer Console',
      body: 'err',
    })
    setTimeout(() => window.location.href = `/console`, 3000)
    toggleDeployModal('none');
  })
};
