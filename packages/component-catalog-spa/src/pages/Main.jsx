import './Main.scss';
import Card from '../components/Card/Card';
import { Libraries } from '../assets/component-libraries';

const Main = () => {
    return (
        <div className="Main">
        { Libraries.map(
          ( lib ) => <Card theme="light" link={ lib.link } key={ lib.id } name={ lib.title } logo={ lib.logo } description={ lib.description } /> ) }
        </div>
    );
}

export default Main;
