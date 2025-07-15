import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { RouteParam } from "./types";

export const buildRouter = (routeParam: RouteParam, path: string = '') => {
    return () => (
        <Routes>
            {buildWebRoutes(routeParam, path)}
        </Routes>
    );
};

/**
 * Create React Router routes from RouteParam configuration
 * @param routeParam The route parameter configuration
 * @param parentPath The parent path for nested routes
 * @returns Array of React Router Route elements
 */
const buildWebRoutes = (routeParam: RouteParam, parentPath: string = ''): React.ReactElement[] => {
    const routes: React.ReactElement[] = [];
    const currentPath = routeParam.path ? `${parentPath}${routeParam.path}` : parentPath;
    
    // Handle layout wrapping
    const LayoutComponent = routeParam.layout?.component;
    const RouteComponent = routeParam.component;
    
    if (LayoutComponent && routeParam.routes) {
        // Create a wrapper component that renders the layout with Outlet
        const LayoutWrapper: React.FC = () => (
            <LayoutComponent>
                <Outlet />
            </LayoutComponent>
        );
        
        // Create parent route with layout
        const layoutRoute = (
            <Route 
                key={`layout-${currentPath || 'root'}`} 
                path={currentPath || '/'} 
                element={<LayoutWrapper />}
            >
                {/* Add index route for the main component */}
                <Route 
                    index 
                    element={<RouteComponent />} 
                />
                {/* Add nested routes */}
                {routeParam.routes.reduce((acc, nestedRoute) => {
                    return acc.concat(buildWebRoutes(nestedRoute, currentPath));
                }, [] as React.ReactElement[])}
            </Route>
        );
        
        routes.push(layoutRoute);
    } else {
        // Simple route without layout
        routes.push(
            <Route 
                key={currentPath || 'root'} 
                path={currentPath || '/'} 
                element={<RouteComponent />} 
            />
        );
        
        // Handle nested routes without layout
        if (routeParam.routes) {
            routeParam.routes.forEach(nestedRoute => {
                routes.push(...buildWebRoutes(nestedRoute, currentPath));
            });
        }
    }
    
    return routes;
};