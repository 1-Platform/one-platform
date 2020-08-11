import html from 'html-template-tag';
import styles from './feedback.css';
import APIHelper from './api';

window.customElements.define( 'op-feedback', class extends HTMLElement {
  constructor () {
    super();
    this._appsList = [];
  }

  connectedCallback () {
    if ( !this.shadowRoot ) {
      this.attachShadow( { mode: 'open' } );
      this.shadowRoot.appendChild( this._template.content.cloneNode( true ) );

      const styleTag = document.createElement( 'style' );
      styleTag.innerText = styles;
      this.shadowRoot.prepend( styleTag );

      this.feedbackButton = this.shadowRoot.querySelector( '#op-feedback__button' );
      this.feedbackButton.addEventListener( 'click', this.togglePanelVisibility.bind( this ) );

      this.feedbackPanel = this.shadowRoot.querySelector( '#op-feedback__panel' );

      window.OpAuthHelper.onLogin( () => {
        APIHelper.request( /* GraphQL */`query AppOptions {
          appsList: getHomeTypeBy( input: {entityType: "spa"} ) {
            _id
            name
            link
            icon
            active
          }
        }`)
          .then( res => {
            this._appsList = res.appsList.sort( ( prev, next ) => {
              if ( prev.name?.toLowerCase() <= next.name?.toLowerCase() ) {
                return -1;
              } else {
                return 1;
              }
            } );
            /* MAGIC: Refreshes the appsList dropdown if the feedback subPanel is already open */
            if ( this.feedbackPanel.hasAttribute( 'open' )
              && this.feedbackPanel.querySelector('#op-feedback__feedbackForm') ) {
              this.feedbackPanel.querySelector( '#op-feedback__feedbackForm #feedbackType' ).innerHTML = `
                <option value="">One Platform</option>
                ${ this._appsList.map( app => html`<option value="${ app._id }" ${ this._isActiveApp( app ) ? 'selected' : '' }>${ app.name }</option>` ) }
              `;
            }
          } )
          .catch( err => {
            console.error( err );
          } );
      } );
    }
  }

  /**
   * Submit Bug Report
   *
   * @param {HTMLFormControlsCollection} formData
   */
  _submitBugReport ( formData ) {
    const user = window.OpAuthHelper.getUserInfo();
    if ( !user ) {
      throw new Error( 'Could not find details of the logged in user.' );
    }

    const query = /* GraphQL */ `mutation AddBugReport($bug: FeedbackInput!) {
      addFeedback(input: $bug) {
        _id
        title
        feedbackType
      }
    }`;
    const variables = {
      bug: {
        title: formData.namedItem( 'bugTitle' ).value,
        description: formData.namedItem( 'bugDescription' ).value,
        feedbackType: 'Bug',
        createdOn: new Date().toISOString(),
        createdBy: user.rhatUUID,
      }
    };

    APIHelper.request( query, variables )
      .then( res => {
        window.OpNotification.showToast( { subject: 'Bug Report Submitted Successfully!', body: 'Click the title to see the bug report.', link: '/feedback' } );
        this.togglePanelVisibility();
    } )
      .catch( err => {
        console.error( err );
        window.OpNotification.showToast( { subject: 'An Error occured!', body: 'Please try again or contact <a href="mailto:one-portal-devel@redhat.com">one-portal-devel@redhat.com</a>' } );
      } );
  }

  /**
   * Submit Feedback
   *
   * @param {HTMLFormControlsCollection} formData
   */
  _submitFeedback ( formData ) {
    const user = window.OpAuthHelper.getUserInfo();
    if ( !user ) {
      throw new Error( 'Could not find details of the logged in user.' );
    }

    const query = /* GraphQL */ `mutation AddFeedback($feedback: FeedbackInput!) {
      addFeedback(input: $feedback) {
        _id
        title
        feedbackType
      }
    }`;
    const variables = {
      feedback: {
        title: '',
        description: formData.namedItem( 'feedbackDescription' ).value,
        experience: formData.namedItem( 'feedbackExperience' ).value,
        spa: formData.namedItem( 'feedbackType' ).value || undefined,
        feedbackType: 'Feedback',
        createdOn: new Date().toISOString(),
        createdBy: user.rhatUUID,
      }
    };

    APIHelper.request( query, variables )
      .then( res => {
        window.OpNotification.showToast( { subject: 'Feedback Submitted Successfully!', body: 'Click the title to see the feedback.', link: '/feedback' } );
        this.togglePanelVisibility();
      } )
      .catch( err => {
        console.error( err );
        window.OpNotification.showToast( {
          subject: 'An Error occured!',
          body: 'Please try again or contact <a href="mailto:one-portal-devel@redhat.com">one-portal-devel@redhat.com</a>'
        } );
      } );
  }

  togglePanelVisibility () {
    if ( this.feedbackPanel.hasAttribute( 'open' ) ) {
      this.feedbackPanel.removeAttribute( 'open' );
      this.feedbackButton.querySelector( 'ion-icon' ).setAttribute( 'name', 'chatbox-ellipses' );
    } else {
      this.feedbackPanel.setAttribute( 'open', true );
      this.feedbackButton.querySelector( 'ion-icon' ).setAttribute( 'name', 'close-outline' );
      this._loadSubPanel( 'options' );
    }
    this.dispatchEvent( new Event( 'TEST' ) );
  }

  _loadSubPanel ( panelType ) {
    this.shadowRoot.querySelector( '#op-feedback__panel-body' ).innerHTML = this._getSubPanel( panelType );

    /* Focus the first element with autofocus property */
    if ( this.feedbackPanel.querySelector( '[autofocus]' ) ) {
      this.feedbackPanel.querySelector( '[autofocus]' ).focus();
    }

    /* Add the event listener for sub-panels */
    if ( panelType === 'options' ) {
      this.feedbackPanel.querySelectorAll( '.op-feedback__option-item' )
        .forEach( ( optionItem, key ) => {
          optionItem.addEventListener( 'click', () => {
            if ( optionItem.tagName === 'A' ) {
              return;
            }
            this._loadSubPanel( optionItem.getAttribute( 'data-feedback-type' ) );
          } );
        } );
    } else if ( panelType === 'bug' || panelType === 'feedback' ) {
      const formReference = this.feedbackPanel.querySelector( '.op-feedback__form' );
      if ( !formReference ) {
        return;
      }

      /* Event Listener for Form Submit */
      formReference.addEventListener( 'submit', ( event ) => {
        event.preventDefault();

        if ( panelType === 'bug' ) {
          this._submitBugReport( event.target.elements );
        } else if ( panelType === 'feedback' ) {
          this._submitFeedback( event.target.elements );
        }
      } );
      /* Event Listener for Form Reset/Close */
      formReference.addEventListener( 'reset', ( event ) => {
        event.preventDefault();
        this._loadSubPanel( 'options' );
      } );
    }
  }

  _getSubPanel ( panelType ) {
    if ( panelType === 'bug' ) {
      return this._bugPanel;
    } else if ( panelType === 'feedback' ) {
      return this._feedbackPanel;
    }
    return this._feedbackOptionsPanel;
  }

  _isActiveApp ( app ) {
    return window.location.pathname !== '/' && window.location.pathname.startsWith( app.link );
  }

  get _template () {
    const template = document.createElement( 'template' );
    template.innerHTML = this._html;

    return template;
  }

  get _html () {
    return html`
      <dialog id="op-feedback__panel" class="op-feedback__panel">
        <header class="op-feedback__header">
          <h3 class="op-feedback__title">Share your thoughts with us</h3>
        </header>
        <main id="op-feedback__panel-body"></main>
      </dialog>

      <button id="op-feedback__button" type="button" class="op-feedback__button">
        <ion-icon name="chatbox-ellipses" class="op-feedback__icon"></ion-icon>
        Feedback
      </button>
    `;
  }

  get _feedbackOptionsPanel () {
    return html`
      <ul class="op-feedback__options">
        <li>
          <button type="button" autofocus="true" data-feedback-type="bug" class="op-feedback__option-item">
            <ion-icon name="bug-outline" class="op-feedback__option-icon"></ion-icon>
            Report Bug
          </button>
        </li>
        <li>
          <button type="button" data-feedback-type="feedback" class="op-feedback__option-item">
            <ion-icon name="chatbox-ellipses-outline" class="op-feedback__option-icon"></ion-icon>
            Share Feedback
          </button>
        </li>
        <li>
          <a href="/feedback" data-feedback-type="feedback-list" class="op-feedback__option-item">
            <ion-icon name="chatbubbles-outline" class="op-feedback__option-icon"></ion-icon>
            View Existing Feedback
            <ion-icon name="open-outline" class="op-feedback__icon-secondary"></ion-icon>
          </a>
        </li>
      </ul>
    `;
  }

  get _bugPanel () {
    return html`
      <form id="op-feedback__bugReportForm" class="op-feedback__form">
        <div class="op-feedback__form-group">
          <label for="bugTitle" class="op-feedback__form-label">Bug Title <span class="red">*</span></label>
          <input id="bugTitle" type="text" name="bugTitle" autofocus="true" placeholder="Enter bug title" class="op-feedback__form-input" required>
        </div>
        <div class="op-feedback__form-group">
          <label for="bugDescription" class="op-feedback__form-label">Bug Description <span class="red">*</span></label>
          <textarea id="bugDescription" type="text" name="bugDescription" rows="5" placeholder="Describe the issue..." class="op-feedback__form-input" required></textarea>
        </div>
        <div class="op-feedback__form-actions">
          <button type="reset" class="op-feedback__form-button">
            <ion-icon name="arrow-back-outline" class="op-feedback__form-icon"></ion-icon>
            Go Back
          </button>
          <button type="submit" class="op-feedback__form-button">
            Submit
            <ion-icon name="send-sharp" class="op-feedback__form-icon"></ion-icon>
          </button>
        </div>
      </form>
    `;
  }

  get _feedbackPanel () {
    return html`
      <form id="op-feedback__feedbackForm" class="op-feedback__form">
        <div class="op-feedback__form-group">
          <label for="feedbackType" class="op-feedback__form-label">Select App <span class="red">*</span></label>
          <select id="feedbackType" name="feedbackType" autofocus="true" class="op-feedback__form-input">
            <option value="">One Platform</option>
            ${ this._appsList.map(app => html`<option value="${ app._id }" ${ this._isActiveApp(app) ? 'selected' : ''}>${ app.name }</option>`) }
          </select>
        </div>
        <div class="op-feedback__form-group">
          <label class="op-feedback__form-label">Select Experience <span class="red">*</span></label>
          <div class="op-feedback__form-radio-group">
              <input id="experienceExcellent" type="radio" name="feedbackExperience" value="excellent" class="op-feedback__form-radio" required>
              <label for="experienceExcellent" class="op-feedback__form-radio-label">
                Excellent
              </label>
              <input id="experienceGood" type="radio" name="feedbackExperience" value="good" class="op-feedback__form-radio" required>
              <label for="experienceGood" class="op-feedback__form-radio-label">
                Good
              </label>
              <input id="experienceNeedsImprovement" type="radio" name="feedbackExperience" value="needs-improvement" class="op-feedback__form-radio" required>
              <label for="experienceNeedsImprovement" class="op-feedback__form-radio-label">
                Needs Improvement
              </label>
          </div>
        </div>
        <div class="op-feedback__form-group">
          <label for="feedbackDescription" class="op-feedback__form-label">Description <span class="red">*</span></label>
          <textarea id="feedbackDescription" type="text" name="feedbackDescription" rows="5" placeholder="Describe your experience..." class="op-feedback__form-input" required></textarea>
        </div>
        <div class="op-feedback__form-actions">
          <button type="reset" class="op-feedback__form-button">
            <ion-icon name="arrow-back-outline" class="op-feedback__form-icon"></ion-icon>
            Go Back
          </button>
          <button type="submit" class="op-feedback__form-button">
            Submit
            <ion-icon name="send-sharp" class="op-feedback__form-icon"></ion-icon>
          </button>
        </div>
      </form>
    `;
  }
} );
