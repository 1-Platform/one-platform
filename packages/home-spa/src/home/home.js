import * as microservices from '../res/static/microservices.json';
import * as page from '../res/static/page-text.json';

export const microserviceCards = () => {
    const microservicesCardDetails = microservices.default;
    const microserviceHTMLObject = document.querySelector('#microservices');
    if (microserviceHTMLObject !== null) {
        microserviceHTMLObject.innerHTML = microservicesCardDetails.map(
            (details, index) => {
                if (index % 2 == 0) {
                    return `
                    <div class="services__microservices-card">
                        <div class="text">
                            <h3>${details.name}</h3>
                            <p>${details.description}</p>
                            <a target="_blank" rel="noopener" href="${details.link}">Learn more</a>
                        </div>
                        <div class="img">
                            <img src="${details.icon}" alt="">
                        </div>
                    </div>`;
                }
                return `
                    <div class="services__microservices-card">
                        <div class="img">
                            <img src="${details.icon}" alt="">
                        </div>
                        <div class="text">
                            <h3>${details.name}</h3>
                            <p>${details.description}</p>
                            <a target="_blank" rel="noopener" href="${details.link}">Learn more</a>
                        </div>
                    </div>`; 
            } 
        ).join('');
    }
};

export const applicationCards = (apps) => {
    const spaHTMLObject = document.querySelector("#apps");
    if (spaHTMLObject !== null) {
        spaHTMLObject.innerHTML = apps
        .slice(0, 12)
        .map(
            (spa) => {
                return `
                <a rel="noopener" class="app" href="${spa.path}">
                <div class="app__logo">
                  <img src="../res/img/app-cube-white.svg" alt="cube">
                </div>
                <div class="app__label">
                 <h3>${spa.name.slice(0, 30)}</h3>
                 <span>${spa.applicationType.toLowerCase()}</span>
                </div>
               </a>`;
            }
        ).join('')
    }
}

export const renderSidebar = () => {
    const pageText = page.default;
    const sidebarHTMLObject = document.querySelector('#sidebar-info');
    if (sidebarHTMLObject !== null) {
        sidebarHTMLObject.innerHTML = 
        `<h3>
            ${pageText.sidebar.title}
        </h3>
        <p>
            ${pageText.sidebar.paragraph}
        </p>
        <div class="sidebar__cta">
            <button class="quick-deploy" onclick="toggleDeployModal('block')">Quick Deploy</button>
            <a rel="noopener" href="/get-started/docs/onboarding-guide" class="get-started">Get Started</a>
        </div>
        <a class="sidebar__dev-console" href="/console">Learn more about Developer Console</a>`;
    }
}

export const renderMain = () => {
    const pageText = page.default;
    const heroHTMLObject = document.querySelector('#hero');
    if (heroHTMLObject !== null) {
        heroHTMLObject.innerHTML = 
        `<div class="hero__title">
            <h3>
                ${pageText.main.title}
            </h3>
            <p>
                ${pageText.main.paragraph}
            </p>
        </div>
        <div class="hero__illustration">
            <img src="../res/img/user.svg" alt="">
        </div>`;
    }
}

window.openAppDrawer = () => {
    try {
      document.querySelector('opc-menu-drawer').open();
    } catch(err) {
      return err;
    }
};

// #region quick deploy modal functions
window.onload = () => {
    const modalHTMLObject = document.querySelector('#quick-deploy-modal');
    if (modalHTMLObject !== null) {
        modalHTMLObject.innerHTML = `
        <div class="pf-c-backdrop" id="deploy-spa-modal">
        <div class="pf-l-bullseye">
          <div class="pf-c-modal-box pf-m-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
            <button class="pf-c-button pf-m-plain" onclick="toggleDeployModal('none')" type="button" aria-label="Close dialog">
              <i class="fas fa-times" aria-hidden="true"></i>
            </button>
            <header class="pf-c-modal-box__header">
              <h1 class="pf-c-modal-box__title" id="modal-title">Deploy to One Platform</h1>
            </header>
            <div class="pf-c-modal-box__body" id="modal-description">
              <form class="pf-c-form" id="deploy-form" onsubmit="submitForm(); return false;">
                <div class="pf-c-form__group">
                  <div class="pf-c-form__group-label">
                    <label class="pf-c-form__label" for="app-name">
                      <span class="pf-c-form__label-text">Application Name</span>
                      <span class="pf-c-form__label-required" aria-hidden="true">&#42;</span>
                    </label>
                  </div>
                  <div class="pf-c-form__group-control">
                    <input
                      class="pf-c-form-control"
                      type="text"
                      id="app-name"
                      name="app-name"
                      aria-invalid="false"
                      oninput="checkAppName()"
                      aria-describedby="app-name-helper"
                      placeholder="app-name"
                      required="true"
                    />
                    <p
                      class="pf-c-form__helper-text"
                      id="app-name-helper"
                      aria-live="polite"
                    >Enter the Application/SPA name</p>
                  </div>
                </div>
                <div class="pf-l-grid pf-m-gutter">
                  <div class="pf-c-form__group pf-m-9-col">
                    <div class="pf-c-form__group-label">
                      <label class="pf-c-form__label" id="app-path-label" for="app-path">
                        <span class="pf-c-form__label-text">Application Path</span>
                        <span class="pf-c-form__label-required" aria-hidden="true">&#42;</span>
                        <i 
                          title="App name should be lowercase, without space starting with a forward slash(/). Example -  /app-path"
                          class="pficon pf-icon-help" 
                          aria-hidden="true">
                        </i>
                      </label>
                    </div>
                    <div class="pf-c-form__group-control">
                      <div class="pf-c-input-group">
                        <input
                          class="pf-c-form-control"
                          type="text"
                          id="app-path"
                          name="app-path"
                          oninput="checkAppPath()"
                          pattern="^\/[-a-z]+$"
                          aria-describedby="app-path-helper"
                          placeholder="/app-path"
                          required="true"
                        />
                      </div>
                      <p
                        class="pf-c-form__helper-text"
                        id="app-path-helper"
                        aria-live="polite"
                      >Enter the path on which you would to deploy your SPA.</p>
                    </div>
                  </div>
                  <div class="pf-c-form__group pf-m-3-col">
                    <div class="pf-c-form__group-label">
                      <label class="pf-c-form__label" for="app-ref">
                        <span class="pf-c-form__label-text">Version</span>
                      </label>
                    </div>
                    <div class="pf-c-form__group-control">
                      <div class="pf-c-input-group">
                        <input
                          class="pf-c-form-control"
                          type="text"
                          id="app-ref"
                          name="app-ref"
                          aria-describedby="app-ref-helper"
                          placeholder="1.0.0"
                        />
                      </div>
                      <p
                        class="pf-c-form__helper-text"
                        id="app-ref-helper"
                        aria-live="polite"
                      >Version number.</p>
                    </div>
                  </div>
                </div>
                <div class="pf-c-form__group">
                  <div class="pf-c-form__group-label">
                    <label class="pf-c-form__label" for="app-description">
                      <span class="pf-c-form__label-text">Application Description</span>
                    </label>
                  </div>
                  <div class="pf-c-form__group-control">
                    <textarea
                    class="pf-c-form-control"
                    type="text"
                    id="app-description"
                    name="description"
                    aria-label="description"
                    placeholder="description"
                  ></textarea>
                  </div>
                </div>
                <div class="pf-c-form__group">
                  <div class="pf-c-form__group-label">
                    <label class="pf-c-form__label" for="app-file">
                      <span class="pf-c-form__label-text">Archive file</span>
                      <span class="pf-c-form__label-required" aria-hidden="true">&#42;</span>
                    </label>
                  </div>
                  <div class="pf-c-form__group-control">
                    <input
                      type="file"
                      class="pf-c-form-control"
                      id="app-file"
                      name="app-file"
                      aria-invalid="false"
                      accept=".gz,.tar,.zip"
                      aria-describedby="app-file-helper"
                      placeholder="app-file"
                      required
                    />
                    <p
                      class="pf-c-form__helper-text"
                      id="app-file-helper"
                      aria-live="polite"
                    >Select the archive file you wish to upload</p>
                  </div>
                </div>
                <div class="pf-c-form__group pf-m-action">
                  <div class="pf-c-form__actions">
                    <button class="pf-c-button" type="submit" id="deploy-submit">
                      Deploy
                    </button>
                    <button class="pf-c-button" onclick="toggleDeployModal('none')" type="reset">
                      Close
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>`;
    }
}
window.toggleDeployModal = (state) => {
    const modal = document.querySelector('#deploy-spa-modal');
    modal.style.display = state;
    document.querySelector( 'body' ).style.overflow = state === 'block' ? 'hidden' : 'visible';
    document.querySelector('#deploy-form').reset();
};

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

// #endregion quick deploy modal functions

