import { Suspense } from 'react';
import { Loader } from 'components/Loader';
import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import { Router } from './router';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={ <Loader /> }>
        <Router />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
