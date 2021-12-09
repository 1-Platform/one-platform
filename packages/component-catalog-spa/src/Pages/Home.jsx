import Main from '../Components/Main';

const Home = () => {
  return <>
  <main>
    <h3 className="pf-c-title pf-m-3xl" style={ {fontWeight: 300}}>Components Catalog</h3>
    <p>
      A Unified interface to access components from Chapeaux, Patternfly
      elements and One Platform components, which allows in increase of
      collaboration and helps to improve component quality and development & 
      delivery speed.
    </p>
    <Main />
  </main>
  </>
  };

export default Home;
