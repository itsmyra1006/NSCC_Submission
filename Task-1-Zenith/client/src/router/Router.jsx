import React, { useState, useEffect } from 'react';

const pathToRegex = (path) => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const navigate = (url) => {
    window.history.pushState(null, null, url);
    const navigationEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navigationEvent);
};

const Router = ({ children }) => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        const onLocationChange = () => {
            setCurrentPath(window.location.pathname);
        };
        window.addEventListener('popstate', onLocationChange);
        return () => window.removeEventListener('popstate', onLocationChange);
    }, []);

    let routeComponent = null;
    let routeParams = {};

    const routes = React.Children.toArray(children);

    for (const route of routes) {
        if (route.props.default) {
            routeComponent = route;
        }
        const regex = pathToRegex(route.props.path);
        const match = currentPath.match(regex);
        
        if (match) {
            const keys = Array.from(route.props.path.matchAll(/:(\w+)/g)).map(result => result[1]);
            routeParams = Object.fromEntries(keys.map((key, i) => [key, match[i + 1]]));
            routeComponent = route;
            break;
        }
    }

    if (routeComponent) {
        return React.cloneElement(routeComponent, routeParams);
    }

    return null;
};

export { Router, navigate };

