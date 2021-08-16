import { Playground, store,  } from 'graphql-playground-react';
import { Provider } from 'react-redux';

type Playground = {
    endpoint: URL
    title: string
    headers: string
}

export const PlaygroundView = (props: Playground) =>
    <Provider store={store}>
        <Playground
            endpoint={ props.endpoint }
            setTitle={ props.title || `One Platform | API Catalog` }
            headers={ props.headers || null}
            />
    </Provider>
