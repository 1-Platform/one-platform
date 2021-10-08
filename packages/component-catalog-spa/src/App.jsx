// Styles
import './App.scss';
import { useEffect, useRef } from 'react';
// Components
import '@one-platform/opc-footer/dist/opc-footer';
import { footer } from './assets/footer';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
// Pages
import Main from './pages/Main';

function App() {
  const footerRef = useRef();
  useEffect( () => {
    if (footerRef.current) {
      footerRef.current.opcLinkCategories = footer;
    }
  }, [] );
  return (
    <div className="App">
      <div className="breadcrumbs">
        <Breadcrumb>
          <BreadcrumbItem to="/">Home</BreadcrumbItem>
          <BreadcrumbItem to="/components-catalogue" isActive>Component Catalog</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <h3>Components Catalog</h3>
      <p>
        A Unified interface to access components from Chapeaux, Patternfly elements and One Platform components,
        which allows in increase of collaboration and helps to improve component quality and development & delivery speed.
      </p>
      <main>
        <Main />
      </main>
      <footer>
        <opc-footer ref={footerRef} theme="dark"></opc-footer>
      </footer>
    </div>
  );
}

export default App;
