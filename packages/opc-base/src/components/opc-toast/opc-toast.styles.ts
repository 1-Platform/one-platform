import { css } from "lit";

export default css`
  pfe-toast[variant="success"] {
    border-top: 0.25rem solid #3e8635;
  }

  pfe-toast[variant="info"] {
    border-top: 0.25rem solid #2b9af3;
  }
  pfe-toast[variant="muted"] {
    border-top: 0.25rem solid #151515;
  }
  pfe-toast[variant="warn"] {
    border-top: 0.25rem solid #f0ab00;
  }
  pfe-toast[variant="danger"] {
    border-top: 0.25rem solid #ce2615;
  }

  .op-menu-drawer__notifications-count {
    display: inline-grid;
    place-content: center;
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
    color: rgba(0, 0, 0, 0.64);
    border-radius: 1rem;
    border: 1px solid #ddd;
    box-sizing: border-box;
    margin-left: 0.5rem;
    vertical-align: middle;
  }
  .op-menu-drawer__notifications-list {
    margin: 0 -1rem;
    padding: 0;
    list-style: none;
  }
  .op-menu-drawer__notification-item {
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 0.25rem;
    background-color: var(--pfe-toast__container--BackgroundColor, #fff);
  }
  .op-menu-drawer__notification-subject a {
    color: inherit;
    text-decoration: inherit;
  }
  .op-menu-drawer__notification-time {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    opacity: 0.75;
  }
  .op-menu-drawer__notification-subject {
    margin: 0;
    font-weight: 500;
    font-size: 1rem;
  }
  .op-menu-drawer__notification-body {
    margin: 0;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    opacity: 0.87;
  }

  .op-menu-drawer__notification-item:hover {
    background: white;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.16);
  }
  .op-menu-drawer__notification-item:hover
    .op-menu-drawer__notification-subject,
  .op-menu-drawer__notification-toast:hover
    .op-menu-drawer__notification-subject {
    color: var(--op-highlight__color-blue);
  }

  .op-menu__toast-container {
    position: fixed;
    right: 0;
    top: var(--op-nav-height);
    height: auto;
    max-height: 100vh;
    z-index: 1;
  }

  .op-menu-drawer__notification-toast {
    position: relative;
    margin: 0.5rem 0;
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.24);
    border-radius: 0.25rem;
    overflow: hidden;
    font-family: "Red Hat Text";
    transition: var(--op-transition--default);
    --pfe-toast--Top: 0;
    --pfe-toast--Right: 0.5rem;
    --pfe-toast--MinWidth: 23rem;
    --pfe-toast--MaxWidth: 26rem;
    --pfe-toast__container--BoxShadow: none;
  }
  .op-menu-drawer__notification-toast:hover {
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.32);
  }
`;
