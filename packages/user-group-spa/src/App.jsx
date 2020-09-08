import React, { useState, useEffect } from 'react';
import { Switch, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import {
  Nav,
  NavList,
  NavItem,
  NavGroup,
} from '@patternfly/react-core';

import Home from './components/Home';
import GroupForm from './components/Form';
import Group from './components/Group';
import User from './components/User';
import NotFound from './components/NotFound';


function App ( props ) {
  const location = useLocation();
  const [ user, setUser ] = useState( {} );

  useEffect( () => {
    const authUser = window.OpAuthHelper?.getUserInfo();
    setUser( {
      uid: authUser.kerberosID,
    } );
  }, [ ] );

  function isNavItemActive ( url ) {
    return location.pathname === url;
  }

  return (
    <>
      <Nav theme="light" className="op-sidemenu">
        <NavList>
          <NavGroup title="User-Group Menu">
            <NavItem isActive={ isNavItemActive( `/user/${ user?.uid }` ) }>
              <Link to={ '/user/' + user.uid }>My Profile</Link>
            </NavItem>
            <NavItem isActive={ isNavItemActive( "/" ) }>
              <Link to="/">User Groups</Link>
            </NavItem>
          </NavGroup>
        </NavList>
      </Nav>
      <div className="app">
        <header className="op-header">
          <h1>User Group SPA</h1>
        </header>
        <main className="page">
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/group/new" component={GroupForm} />
            <Route path="/group/edit/:cn" component={GroupForm} />
            <Route path="/group/:cn" component={Group} />
            <Route path="/user/:cn" component={User} />
            <Route path="*" component={NotFound} />
          </Switch>
        </main>
      </div>
    </>
  );
}

export default App;
