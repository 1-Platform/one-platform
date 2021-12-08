import {
  Nav,
  NavList,
  NavItem,
  NavExpandable,
} from '@patternfly/react-core';
import { useState } from 'react';
import { Link } from 'react-router-dom';


const NavBar = ({components}) => {
  const [activeItem, setActiveItem] = useState('all');
  const onNavItemClick = (event) => {
    setActiveItem(event.itemId);
  };

  return ( <Nav onSelect={onNavItemClick}>
    <NavList>
      <NavItem id="navbar" to="/" itemId={'all'} isActive={activeItem === 'all'}>
        <Link className="pf-c-nav__link" to="/">
          All Components
        </Link>
      </NavItem>
      {components.map( (lib) => 
      <NavExpandable 
        className="capitalize" 
        key={Object.keys(lib)[0]} 
        title={Object.keys(lib)[0].split('-').join(' ')} 
        isExpanded>
      { Object.values(lib)[0].map( (component) =>
        <NavItem className="list-style-none" key={component.sha} itemId={component.sha} isActive={activeItem === component.sha}>
          <Link key={component.sha} className=" capitalize" to={component.name}> {component.title}</Link> 
        </NavItem>) }
        </NavExpandable>
        )}
    </NavList>
  </Nav>)
};

export default NavBar;
