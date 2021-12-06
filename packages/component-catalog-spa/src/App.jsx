// Styles
import "./App.scss";
import { useEffect, useRef, useState } from "react";
// Components
import "@one-platform/opc-footer/dist/opc-footer";
import { footer } from "./assets/footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  Page,
  PageSection,
  Nav,
  NavList,
  NavItem,
  PageSidebar,
} from "@patternfly/react-core";
// Pages
import Main from "./pages/Main";
// Routes
import { Routes, Route, Link } from "react-router-dom";
import Description from "./Components/Description";

const Home = () => (
<>
<main>
  <h3>Components Catalog</h3>
  <p>
    A Unified interface to access components from Chapeaux, Patternfly
    elements and One Platform components, which allows in increase of
    collaboration and helps to improve component quality and development & 
    delivery speed.
  </p>
  <Main />
</main>
</>);

const breadCrumb = 
<Breadcrumb>
  <BreadcrumbItem to="/">Home</BreadcrumbItem>
  <BreadcrumbItem to="/components-catalogue" isActive>
    Component Catalog
  </BreadcrumbItem>
</Breadcrumb>;

const App = () => {
  const footerRef = useRef();
  useEffect(() => {
    if (footerRef.current) {
      footerRef.current.opcLinkCategories = footer;
    }
  }, []);

  const [navBarItems, setNavbarItems] = useState([]);
  useEffect(() => {
    const repositories = [
      {
        owner: "1-platform",
        repo: "op-components",
        folderName: "packages",
      },
      {
        owner: "patternfly",
        repo: "patternfly-elements",
        folderName: "elements",
      },
    ];
    ( async () => {
      const results = await Promise.all(
        repositories.map(async (repo) => {
          const response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/contents/${repo.folderName}?ref=master`);
          return response.json();
        })
      );
      setNavbarItems(results.flat());
    })();
  }, []);

  const navMenu = 
  <Nav>
    <NavList>
      <NavItem id="home" to="/" itemId={0}>
        <Link className="pf-c-nav__link" to="/">
          All Components
        </Link>
      </NavItem>
      { navBarItems.map( item =>  <Link key={item.sha} className="pf-c-nav__link" to={item.name}> {item.name} </Link>) }
    </NavList>
  </Nav>;
  
  const routeMain = 
  <Routes>
  <Route exact path="/" element={<Home />} />
  {navBarItems.map((item) => (
    <Route
      key={item.name}
      path={`/${item.name}`}
      element={<Description componentLink={item.url} />}
    />
  ))}
</Routes>;

  return (
    <>
      <Page sidebar={<PageSidebar className="view-height" theme={'dark'} nav={navMenu} />}>
        <PageSection type="breadcrumb" children={breadCrumb} />
        <PageSection children={routeMain} />
        <footer><opc-footer ref={footerRef} theme="dark"></opc-footer></footer>
      </Page>
    </>
  );
};

export default App;
