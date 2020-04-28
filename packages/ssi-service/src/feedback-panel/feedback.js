import html from 'html-template-tag';
import { GraphQLClient } from 'graphql-request';
import styles from './feedback.css';

window.customElements.define( 'op-feedback', class extends HTMLElement {
  constructor () {
    super();

    this._graphqlClient = new GraphQLClient( process.env.API_URL, {
      headers: {
        Authorization: process.env.ACCESS_TOKEN
      }
    } );
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
    }
  }

  /**
   * Submit Bug Report
   *
   * @param {HTMLFormControlsCollection} formData
   */
  _submitBugReport ( formData ) {
    const query = /* GraphQL */ `mutation AddBugReport($bug: FeedbackInput) {
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
        timestamp: {
          createdAt: new Date().toISOString(),
          createdBy: {
            kerberosID: 'test-user',
            name: 'Test User',
            email: 'test-user@redhat.com'
          }
        }
      }
    };

    this._graphqlClient.request( query, variables )
      .then( res => {
        console.info( res );
      } )
      .catch( err => {
        console.error( err );
      } );
  }

  /**
   * Submit Feedback
   *
   * @param {HTMLFormControlsCollection} formData
   */
  _submitFeedback ( formData ) {
    const query = /* GraphQL */ `mutation AddFeedback($feedback: FeedbackInput) {
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
        feedbackType: 'Feedback',
        timestamp: {
          createdAt: new Date().toISOString(),
          createdBy: {
            kerberosID: 'test-user',
            name: 'Test User',
            email: 'test-user@redhat.com'
          }
        }
      }
    };

    this._graphqlClient.request( query, variables )
      .then( res => {
        console.log( res );
      } )
      .catch( err => {
        console.error( err );
      } );
  }

  togglePanelVisibility () {
    if ( this.feedbackPanel.hasAttribute( 'open' ) ) {
      this.feedbackPanel.removeAttribute( 'open' );
    } else {
      this.feedbackPanel.setAttribute( 'open', true );
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
        this.togglePanelVisibility();
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
          <a disabled data-feedback-type="feedback-list" class="op-feedback__option-item">
            <ion-icon name="chatbubbles-outline" class="op-feedback__option-icon"></ion-icon>
            View Existing Feedback
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
          <textarea id="bugDescription" type="text" name="bugDescription" rows="5" placeholder="Enter bug description" class="op-feedback__form-input" required></textarea>
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
          <label for="feedbackType" class="op-feedback__form-label">Feedback for <span class="red">*</span></label>
          <select id="feedbackType" name="feedbackType" autofocus="true" class="op-feedback__form-input" required>
            <option value="one-platform">One Platform</option>
            <option value="home">Home</option>
          </select>
        </div>
        <div class="op-feedback__form-group">
          <label class="op-feedback__form-label">Select Experience <span class="red">*</span></label>
          <div class="op-feedback__form-radio-group">
              <input id="experienceExcellent" type="radio" name="feedbackExperience" value="excellent" class="op-feedback__form-radio" required>
              <label for="experienceExcellent" class="op-feedback__form-radio-label">
                <ion-icon name="heart-sharp" class="op-feedback__form-radio-icon"></ion-icon>
                Excellent
              </label>
              <input id="experienceGood" type="radio" name="feedbackExperience" value="good" class="op-feedback__form-radio" required>
              <label for="experienceGood" class="op-feedback__form-radio-label">
                <ion-icon name="thumbs-up-sharp" class="op-feedback__form-radio-icon"></ion-icon>
                Good
              </label>
              <input id="experiencePoor" type="radio" name="feedbackExperience" value="poor" class="op-feedback__form-radio" required>
              <label for="experiencePoor" class="op-feedback__form-radio-label">
                <ion-icon name="thumbs-down-sharp" class="op-feedback__form-radio-icon"></ion-icon>
                Poor
              </label>
          </div>
        </div>
        <div class="op-feedback__form-group">
          <label for="feedbackDescription" class="op-feedback__form-label">Feedback Description <span class="red">*</span></label>
          <textarea id="feedbackDescription" type="text" name="feedbackDescription" rows="5" placeholder="Enter bug description" class="op-feedback__form-input" required></textarea>
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
