import React from "react";

export type RouteParam = {
    path?: string;
    routes?: RouteParam[];
    component: React.ComponentType;
    layout?: LayoutParam;
}

export type LayoutType = 'stack' | 'tab' | 'drawer' | 'modal';

export type LayoutParam = {
    type: LayoutType;
    component?: React.ComponentType<{ children?: React.ReactNode }>;
}