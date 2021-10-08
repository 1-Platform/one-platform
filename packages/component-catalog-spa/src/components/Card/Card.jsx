import "./Card.scss";
import { APP_THEMES } from "../../constants";
import opLogo from "../../assets/images/op-logo.svg";
import "@patternfly/pfe-card";
import "@patternfly/pfe-cta";

const Card = ({ logo, name, description, link }) => {
  return (
    <>
      <pfe-card color="lightest" border>
        <div>
          <img src={logo} alt="logo" />
        </div>
        <h3>{name}</h3>
        <p>{description}</p>
        <div slot="pfe-card--footer">
          <pfe-cta>
            <a target="_blank" rel="noreferrer" href={link}>
              View on Github
            </a>
          </pfe-cta>
        </div>
      </pfe-card>
    </>
  );
};

Card.defaultProps = {
  logo: opLogo,
  name: "Title",
  description:
    "There are different types of secrets. She had held onto plenty of them during her life, but this one was different.",
  theme: APP_THEMES.dark,
  link: "https://github.com",
};

export default Card;
