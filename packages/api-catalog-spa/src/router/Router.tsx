import { JSXElementConstructor, ReactElement } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './routes';

export const Router = (): ReactElement<any, string | JSXElementConstructor<any>> | null => {
    return useRoutes( routes, process.env.PUBLIC_URL );
}
