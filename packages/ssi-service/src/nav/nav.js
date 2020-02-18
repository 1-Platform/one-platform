import html from 'html-template-tag';
import styles from './nav.css';

window.customElements.define('op-nav', class extends HTMLElement {
  connectedCallback () {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this.__template.content.cloneNode(true));

      const styleTag = document.createElement('style');
      styleTag.innerText = styles;
      this.shadowRoot.prepend(styleTag);
    }
  }

  get __template () {
    const template = document.createElement('template');
    template.innerHTML = this.__html;

    return template;
  }

  get __html () {
    return html`
      <header class="op-nav">
        <div class="op-nav-wrapper">
          <!-- QSTN: Customizable menu here?? -->
          <a class="op-logo" href="/">
            <img class="op-logo__img" src="/templates/assets/rh-op-logo.svg" alt="Red Hat One Portal">
          </a>

          <form class="op-search">
            <input type="search" name="q" autocomplete="off" aria-label="Search for Applications, Documents or any content" class="op-search-bar__input" placeholder="Search for Applications, Documents or any content" required>
            <button class="op-search__btn" type="submit">
              <ion-icon name="search-outline" class="op-nav__icon"></ion-icon>
            </button>
          </form>

          <nav class="op-menu">
            <ul class="op-menu-wrapper">
              <li class="op-menu__item">
                <button type="button" class="op-menu__item-button active">
                  <ion-icon name="apps-outline" class="op-nav__icon"></ion-icon>
                  Apps
                </button>
              </li>
              <li class="op-menu__item">
                <button type="button" class="op-menu__item-button">
                  <ion-icon name="notifications-outline" class="op-nav__icon"></ion-icon>
                  Notifications
                </button>
              </li>
              <li class="op-menu__item">
                <button type="button" class="op-menu__item-button">
                  <ion-icon name="person-outline" class="op-nav__icon"></ion-icon>
                  Sign In
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    `;
  }
});
