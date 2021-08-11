import { css } from "lit";

export default css`
  h6 {
    margin: 0;
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
  }

  .p-4 {
    margin: 1rem;
  }

  .opc-toast-container {
    position: fixed;
    right: 0;
    top: var(--op-nav-height);
    height: auto;
    max-height: 100vh;
    z-index: 1;
  }

  :host {
    --opc-app-layout__avatar-bg: #316dc11a;
    --opc-app-layout__avatar-color: #316dc1;
  }
`;
