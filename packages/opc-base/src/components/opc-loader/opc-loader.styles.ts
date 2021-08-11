import { css } from "lit";

export default css`
  .opc-loader__container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: grid;
    place-content: center;
    background-color: rgba(255, 255, 255, 0.95);
    z-index: 999;
  }
  .opc-loader {
    display: block;
    font-size: 48px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.64);
    position: relative;
    margin-left: auto;
    margin-right: auto;
  }
  .opc-loader::before {
    content: "";
    position: absolute;
    left: 34px;
    bottom: 8px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 5px solid rgba(0, 0, 0, 0.64);
    border-bottom-color: #ff3d00;
    box-sizing: border-box;
    animation: rotation 0.6s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
