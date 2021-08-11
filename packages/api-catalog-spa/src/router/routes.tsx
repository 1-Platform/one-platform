import { AppLayout } from 'layouts/AppLayout';
import { lazy } from 'react';
import { Link } from 'react-router-dom';

const RestApiView = lazy(() => import('pages/RestApiView') as any);
const GraphqlApiView = lazy(() => import('pages/GraphqlApiView') as any);
const PlaygroundView = lazy(() => import('pages/PlaygroundView') as any);

export const routes = [ {
    path: '/',
    exact: true,
    element: (
        <AppLayout>
            <Link to="/api-catalog/rest/1">Rest</Link>
            <Link to="/api-catalog/graphql/1">Graphql</Link>
            <Link to="/api-catalog/playground/1">Playground</Link>
        </AppLayout>
    ),
},
{
    path: '/rest/:propertyName',
    exact: true,
    element: (
        <AppLayout>
            <RestApiView />
        </AppLayout>
    )
},
{
    path: '/graphql/:propertyName',
    exact: true,
    element: (
        <AppLayout>
            <GraphqlApiView />
        </AppLayout>
    )
},
{
    path: '/playground/:propertyName',
    exact: true,
    element: (
        <AppLayout>
            <PlaygroundView
                endpoint='http://graphql-typescript-server.herokuapp.com/graphql'
                title='One Platform | API Catalog'
                headers={
                    {
                        'Authorization': 'Bearer <ENTER_API_KEY_HERE>' /* lgtm [js/hardcoded-credentials] */
                    } }/>
        </AppLayout>
    )
}]
