import { css } from "lit";

export default css`
  button {
    cursor: pointer;
    background: none;
    border: none;
  }

  .opc-notification-drawer__header-chip {
    border: 1px solid #bee1f4;
    font-size: 0.75rem;
    text-transform: uppercase;
    padding: 4px 8px;
    border-radius: 15px;
    margin-top: 1rem;
    color: #002952;
  }

  .opc-notification-drawer__header-chip[active] {
    background: #316dc1;
    color: #fff;
  }
`;
