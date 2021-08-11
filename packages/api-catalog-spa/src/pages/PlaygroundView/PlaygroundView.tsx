import { Playground, store } from 'graphql-playground-react';
import { Provider } from 'react-redux';

export const PlaygroundView = (props:any) =>
    <Provider store={store}>
        <Playground
            endpoint={ props.endpoint }
            setTitle={ props.title || `One Platform | API Catalog` }
            headers={ props.headers || null}
            />
    </Provider>
