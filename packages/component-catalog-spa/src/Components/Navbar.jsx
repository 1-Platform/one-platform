import './Navbar.scss';
import {
  Nav,
  NavList,
  NavItem,
  NavExpandable,
  SearchInput,
  Stack,
  StackItem,
  Button,
} from '@patternfly/react-core';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';


const SubListNavbar = ({components}) => {
  const [activeItem, setActiveItem] = useState('all');
  const onNavItemClick = (event) => {
    setActiveItem(event.itemId);
  };
  return (
  <Nav theme="light" onSelect={onNavItemClick}>
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
  </Nav>
  );
};

const ListNavbar = ({components, searchValue}) => {
  const [activeItem, setActiveItem] = useState('all');
  const onNavItemClick = (event) => {
    setActiveItem(event.itemId);
  };
  components = components.map( (lib) => Object.values(lib)[0]).flat();
  return (
  <Nav theme="light" onSelect={onNavItemClick}>
    <NavList>
      {components.filter( (component) => 
      component.title.includes(searchValue)).map( (component) =>
      <NavItem className="list-style-none" key={component.sha} itemId={component.sha} isActive={activeItem === component.sha}>
        <Link key={component.sha} className=" capitalize" to={component.name}> {component.title}</Link> 
      </NavItem>
        )}
    </NavList>
  </Nav>
  );
};


const NavBar = ({components, onToggle = () => {}}) => {
  const { control, getValues, setValue, watch } = useForm({
    mode: 'all',
  });
  const [isNavOpen, setIsNavOpen] = useState(true);
  useEffect(() => {
    onToggle(isNavOpen);
  }, [isNavOpen, onToggle]);
  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Button id="nav-close" variant="plain" onClick={() => { setIsNavOpen(!isNavOpen)}} aria-label="nav toggle">
            <ion-icon name="close-outline"></ion-icon>
          </Button>
        </StackItem>
        <StackItem>
          <Controller
            control={ control }
            defaultValue=""
            name="search"
            render={ ({ field }) => (
              <SearchInput
                { ...field }
                placeholder="Find by name"
                onClear={ evt => setValue('search', '') }
              />
            ) } />
        </StackItem>
        <StackItem>
          { !watch('search') && <SubListNavbar components={ components } /> }
          { !!watch('search') && <ListNavbar components={ components } searchValue={ getValues('search') } /> }
        </StackItem>
      </Stack>
    </>);
};

export default NavBar;
