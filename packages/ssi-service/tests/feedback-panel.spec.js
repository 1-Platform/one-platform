describe('op-feedback-panel component', () => {
  const Utils = {
    get opFeedback() {
      return document.querySelector('op-feedback');
    },
    get feedbackButton() {
      return Utils.opFeedback.shadowRoot.querySelector('#op-feedback__button');
    },
    get feedbackPanel() {
      return Utils.opFeedback.shadowRoot.querySelector('#op-feedback__panel');
    },
    get defaultPanel() {
      return Utils.feedbackPanel.querySelector('#op-feedback__panel-body .op-feedback__options');
    },
    get bugReportOption() {
      return Utils.opFeedback.shadowRoot.querySelector('.op-feedback__option-item[data-feedback-type=bug]');
    },
    get feedbackOption() {
      return Utils.opFeedback.shadowRoot.querySelector('.op-feedback__option-item[data-feedback-type=feedback]');
    },
    get bugReportForm() {
      return Utils.feedbackPanel.querySelector('#op-feedback__bugReportForm');
    },
    get feedbackForm() {
      return Utils.feedbackPanel.querySelector('#op-feedback__feedbackForm');
    },
  };

  beforeAll(() => {
    /* Defining the custom-component */
    require('../dist/op-feedback-panel');
    /* Appending the component to the DOM */
    document.body.appendChild(document.createElement('op-feedback'));
    return customElements.whenDefined('op-feedback');
  });

  it('creates', () => {
    expect(Utils.opFeedback).toBeTruthy();
    expect(Utils.opFeedback.shadowRoot).toBeTruthy();
    expect(Utils.opFeedback.shadowRoot.childElementCount).toBeGreaterThan(0);
  });

  it('opens panel', () => {
    /* Check if feedback panel is closed */
    expect(Utils.feedbackButton).toBeTruthy();
    expect(Utils.feedbackPanel.getAttribute('open')).not.toEqual('true');

    /* Open the feedback panel */
    Utils.feedbackButton.click();
    expect(Utils.feedbackPanel.getAttribute('open')).toEqual('true');

    /* Check if default panel/view has loaded */
    expect(Utils.defaultPanel).toBeTruthy();
    
    /* Check if the first option has focus */
    expect(Utils.opFeedback.shadowRoot.activeElement).toEqual(Utils.bugReportOption);
  });

  describe('bug report form', () => {
    it('opens bug report form', () => {
      Utils.bugReportOption.click();  
      expect(Utils.bugReportForm).toBeTruthy();
    });

    it('closes the bug report form', () => {
      Utils.bugReportForm.querySelector('.op-feedback__form-button[type=reset]').click();
      expect(Utils.bugReportForm).toBeFalsy();
      expect(Utils.defaultPanel).toBeTruthy();
    });
  });

  describe('share feedback form', () => {
    it('opens feedback form', () => {
      Utils.feedbackOption.click();
      expect(Utils.feedbackForm).toBeTruthy();
    });

    it('closes feedback form', () => {
      Utils.feedbackForm.querySelector('.op-feedback__form-button[type=reset]').click();
      expect(Utils.feedbackForm).toBeFalsy();
      expect(Utils.defaultPanel).toBeTruthy();
    });
  });
});
