import { Card, Dropdown, KebabToggle, Title } from '@patternfly/react-core';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface IAppCardProps {
  app: any;
  dropdownItems: any[]
}

function AppCard (props: IAppCardProps) {
  const { app } = props;
  const [dropDownState, setDropdownState] = useState( false );

  return (
    <>
      <Card isHoverable isRounded className="app-card">
        <section className="app-card--body">
          <Link to={app.path || ''}><Title headingLevel='h2'>{ app.name }</Title></Link>
          {/* <p>Owner: <strong>{ app.owner }</strong></p> */}
          <p className="app-card--body__description">{ app.description }</p>
        </section>
        <aside className="app-card--dropdown">
          <Dropdown
            toggle={ <KebabToggle onToggle={ () => setDropdownState( !dropDownState) } /> }
            isOpen={ dropDownState }
            isPlain
            dropdownItems={ props.dropdownItems }
            position={ 'right' }
          />
        </aside>
        <footer className="app-card--footer pf-u-display-flex pf-u-justify-content-space-between">
          <p>Path: <strong>{ app.path }</strong></p>
          <Link to={ app.path }>
            View App
            <ion-icon class="ion-icon" name="open-outline"></ion-icon>
          </Link>
        </footer>
      </Card>
    </>
  );
}

export default AppCard;
