// Styles
import './App.scss';
import { useEffect, useRef, useState } from 'react';
// Components
import '@one-platform/opc-footer/dist/opc-footer';
import { footer } from './assets/footer';
import Home from './Components/Home';
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
import {repositories,repoAPI } from './Configs/repositoryConfig';


const App = () => {
  const footerRef = useRef();
  useEffect(() => {
    if (footerRef.current) {
      footerRef.current.opcLinkCategories = footer;
    }
  }, []);

  const [navBarItems, setNavbarItems] = useState([]);
  useEffect(() => {
    ( async () => {
      const results = await Promise.all(
        repositories.map(async (repo) => 
          fetch(repoAPI(repo))
          .then(response => response.json())
          .catch(error => {
            console.log(error);
            return [];
          })
        )
      );
      setNavbarItems(
      results.flat().reduce((acc, curr) => {
        acc.push({
          ...curr,
          title: curr.name.split('-').join(' '),
        })
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
    <BreadcrumbItem to="/components-catalogue" isActive>
      Component Catalog
    </BreadcrumbItem>
  </Breadcrumb>;

  const navMenu = 
  <Nav onSelect={onNavItemClick}>
    <NavList>
      <NavItem id="home" to="/" itemId={-1} isActive={activeItem === -1}>
        <Link className="pf-c-nav__link" to="/">
          All Components
        </Link>
      </NavItem>
      { navBarItems.map( (item, index) =>
        <NavItem key={index} itemId={index} isActive={activeItem === index}>
          <Link key={item.sha} className=" capitalize" to={item.name}> {item.title}</Link> 
        </NavItem>) }
    </NavList>
  </Nav>;
  
  const routeMain = 
  <Routes>
  <Route exact key={'home'} path="/" element={<Home />} />
  {navBarItems.map((item, index) => (
    <Route
      key={item.name}
      path={`/${item.name}`}
      element={<Description key={index.toString()} githubLink={item.html_url} componentLink={item.url} />}
    />
  ))}
</Routes>;

  return (
    <>
      <Page sidebar={<PageSidebar className="view-height" theme={'dark'} nav={navMenu} />}>
        <PageSection key={'breadcrumb'} type="breadcrumb" children={breadCrumb} />
        <PageSection key={'main'} children={routeMain} />
        <footer><opc-footer ref={footerRef} theme="dark"></opc-footer></footer>
      </Page>
    </>
  );
};

export default App;
