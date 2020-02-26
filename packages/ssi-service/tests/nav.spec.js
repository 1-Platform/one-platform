describe('op-nav component', () => {
  beforeAll(() => {
    /* Defining the custom-component */
    require('../dist/op-nav');
    /* Appending the component to the DOM */
    document.body.appendChild(document.createElement('op-nav'));
    return customElements.whenDefined('op-nav')
      .then(() => {
        this.opNav = document.querySelector('op-nav');
      });
  });

  it('creates', () => {
    expect(this.opNav).toBeDefined();
    expect(this.opNav.shadowRoot).toBeDefined();
    expect(this.opNav.shadowRoot.childElementCount).toBeGreaterThan(0);
  });
});
