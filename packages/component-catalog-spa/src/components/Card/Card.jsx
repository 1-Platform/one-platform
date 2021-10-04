import './Card.scss'
import githubIcon from '../../assets/images/github-icon.svg';
import { APP_THEMES } from '../../constants';
import opLogo from '../../assets/images/op-logo.svg';

/**
 * 
 * @param {theme} theme Theme of the component (default=dark)
 * @param {fragment} fragment Rest of the class
 * @returns Generated class name e.g. card-dark__content
 */
const generateClass = (theme=APP_THEMES.dark, fragment = '') => {
  const cardThemes = {
    light: 'card-light',
    dark: 'card-dark'
  }
  return cardThemes[theme] + fragment;
}

const Card = ({theme, logo, name, description, link }) => {
  return (
    <div className={generateClass(theme)}>
      <div className={generateClass(theme, '__content')}>
        <div className={generateClass(theme, '__logo')}>
          <img src={logo} alt="logo" />
        </div>
        <h3 className={generateClass(theme, '__content-header')}>
          {name}
        </h3>
        <p className={generateClass(theme, '__content-information')}>
          {description}
        </p>
        <div className={generateClass(theme, '__footer')}>
          <a target="_blank" rel="noreferrer" href={link}>
            <img src={githubIcon} alt="otto-cat" /> 
            <label> Github </label>
          </a>
        </div>
      </div>
    </div>
  );
}

Card.defaultProps = {
    logo: opLogo,
    name: 'Title',
    description: 'There are different types of secrets. She had held onto plenty of them during her life, but this one was different.',
    theme: APP_THEMES.dark,
    link: 'https://github.com'
};

export default Card;
