// Styles
import './App.scss';
import { useEffect, useRef, useState } from 'react';
// Components
import '@one-platform/opc-footer/dist/opc-footer';
import { footer } from './Configs/footer';
import Home from './Pages/Home';
import {
  Breadcrumb,
  BreadcrumbItem,
  Page,
  PageSection,
  Nav,
  NavList,
  NavItem,
  PageSidebar,
} from '@patternfly/react-core';
// Routes
import { Routes, Route, Link } from 'react-router-dom';
import Description from './Components/Description';
import { Repositories, RepoAPI } from './Configs/repositoryConfig';


const App = () => {
  const footerRef = useRef();
  useEffect(() => {
    if (footerRef.current) {
      footerRef.current.opcLinkCategories = footer;
    }
  }, []);

  const [components, setComponents] = useState([]);
  useEffect(() => {
    ( async () => {
      const results = await Promise.all(
        Repositories.map(async (repo) => 
          fetch(RepoAPI(repo))
          .then(response => response.json())
          .catch(error => {
            return [];
          })
        )
      );
      setComponents(
      results.flat().reduce((acc, curr) => {
          if (curr.name.split('-')[1]) {
          acc.push({
            ...curr,
            title: curr.name.split('-').join(' '),
          })
        }
        return acc;
      }, [])
      );
    })();
  }, []);
  const [activeItem, setActiveItem] = useState(-1);
  const onNavItemClick = (event) => {
    setActiveItem(event.itemId);
  };

  const breadCrumb = 
  <Breadcrumb>
    <BreadcrumbItem to="/">Home</BreadcrumbItem>
    <BreadcrumbItem to={process.env.PUBLIC_URL} isActive>
      Component Catalog
    </BreadcrumbItem>
  </Breadcrumb>;

  const navMenu = 
  <Nav onSelect={onNavItemClick}>
    <NavList>
      <NavItem id="navbar" to="/" itemId={-1} isActive={activeItem === -1}>
        <Link className="pf-c-nav__link" to="/">
          All Components
        </Link>
      </NavItem>
      { components.map( (component, index) =>
        <NavItem key={index} itemId={index} isActive={activeItem === index}>
          <Link key={component.sha} className=" capitalize" to={component.name}> {component.title}</Link> 
        </NavItem>) }
    </NavList>
  </Nav>;
  
  const routes = 
  <Routes>
    <Route exact path="/" element={<Home components={components} />} />
    {components.map((item, index) => (
    <Route
      key={item.name}
      path={`/${item.name}`}
      element={
        <Description 
          key={index.toString()} 
          component={item}
        />}
    />
  ))}
  </Routes>;

  return (
    <>
      <Page sidebar={<PageSidebar className="side-panel" theme={'dark'} nav={navMenu} />}>
        <PageSection key={'breadcrumb'} type="breadcrumb" children={breadCrumb} />
        <PageSection key={'main'} children={routes} />
        <footer><opc-footer ref={footerRef} theme="dark"></opc-footer></footer>
      </Page>
    </>
  );
};

export default App;
