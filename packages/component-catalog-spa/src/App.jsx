// Styles
import './App.scss';
import { useEffect, useRef, useState } from 'react';
// Components
import '@one-platform/opc-footer/dist/opc-footer';
import { footer } from './Configs/footer';
import Home from './Pages/Home';
import NavBar from './Components/Navbar';
import {
  Breadcrumb,
  BreadcrumbItem,
  Page,
  PageSection,
  PageSidebar,
} from '@patternfly/react-core';
// Routes
import { Routes, Route } from 'react-router-dom';
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
  const [componentRoutes, setComponentRoutes] = useState([]);

  useEffect(() => {
    ( async () => {
      const results = await Promise.all(
        Repositories.map(async (repo) => 
          fetch(RepoAPI(repo))
          .then(response => response.json())
          .then(data => 
            ({ [repo.repo] : data.reduce((acc, curr) => {
              if (curr.name.split('-')[1]) {
              acc.push({
                ...curr,
                title: curr.name.split('-').join(' '),
              })
            }
            return acc;
          }, []) }))
          .catch(error => {
            console.error(error);
            return [];
          })
        )
      );
      setComponents(results);
      setComponentRoutes(results.map( lib => Object.values(lib)[0]).flat());
    })();
  }, []);

  const breadCrumb = 
  <Breadcrumb>
    <BreadcrumbItem to="/">Home</BreadcrumbItem>
    <BreadcrumbItem to={process.env.PUBLIC_URL} isActive>
      Component Catalog
    </BreadcrumbItem>
  </Breadcrumb>;

  const routes = 
  <Routes>
    <Route exact path="/" element={<Home components={componentRoutes} />} />
    {componentRoutes.map((item, index) => (
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
      <Page sidebar={<PageSidebar className="side-panel" theme={'dark'} nav={< NavBar components={components} />} />}>
        <PageSection key={'breadcrumb'} type="breadcrumb" children={breadCrumb} />
        <PageSection key={'main'} children={routes} />
        <footer><opc-footer ref={footerRef} theme="dark"></opc-footer></footer>
      </Page>
    </>
  );
};

export default App;
