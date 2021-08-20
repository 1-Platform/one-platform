import { css } from "lit";

export default css`
  a {
    text-decoration: none;
    color: #4f5255;
  }

  .opc-footer__container {
    display: flex;
    flex-direction: column;
    font-family: var(--opc-global--Font-Family, "Red Hat Text");
    font-size: 14px;
    margin: 0.5rem 0;
  }

  .opc-footer__container .opc-footer__section:not(:last-child) {
    margin-bottom: 0.75rem;
  }

  .opc-footer__section {
    display: flex;
    font-weight: 500;
  }

  .opc-footer__section div:not(:last-child) {
    margin-right: 1rem;
  }
  .opc-footer__copyright {
    font-weight: 400;
    color: #6a6e73;
  }
`;
