import React from 'react';
import {RSM_ROLE,ADMIN_ROLE,DEVADMIN_ROLE,PUBLIC_ROLE,RSM_ADMIN_ROLE} from "../utility/constant";
// site title
export const siteTitle = 'Bayer Rewards';
export const siteMetaDescription = 'Bayer Rewards';

export const setTitle = (title:any) => {
  document.title = title ? title : siteTitle;
};

export const setMetaDescription = (description:any) => {
  document.querySelector('meta[name="description"]')?.setAttribute('content', description ? description : siteMetaDescription);
};

export const ROUTE = [
  {
    private: false,
    exact: true,
    path: '/',
    meta: {
      title: siteTitle,
      description: siteMetaDescription
    },
    component: React.lazy(() => import('../components/auth/landing')),
    role:PUBLIC_ROLE
  },
  {
    private: false,
    exact: true,
    path: '/landing',
    meta: {
      title: siteTitle,
      description: siteMetaDescription
    },
    component: React.lazy(() => import('../components/auth/landing')),
    role:PUBLIC_ROLE,
  },
  {
    private: true,
    exact: true,
    path: '/dashboard',
    meta: {
      title: siteTitle,
      description: siteMetaDescription
    },
    component: React.lazy(() => import('../components/dashboard')),
    role:PUBLIC_ROLE
  },
  {
    private: true,
    exact: true,
    path: '/userList',
    meta: {
      title: siteTitle,
      description: siteMetaDescription
    },
    component: React.lazy(() => import('../components/users/userList')),
    role:ADMIN_ROLE
  },
  {
    private: true,
    exact: true,
    path: '/createUser',
    meta: {
      title: siteTitle,
      description: siteMetaDescription
    },
    component: React.lazy(() => import('../components/users/createUser')),
    role:ADMIN_ROLE
  },
  {
    private: true,
    exact: true,
    path: '/scanLogs',
    meta: {
      title: siteTitle,
      description: siteMetaDescription
    },
    component: React.lazy(() => import('../components/scanLogs')),
    role:RSM_ADMIN_ROLE
  },
  {
    private: true,
    exact: true,
    path: '/devconfig',
    meta: {
      title: siteTitle,
      description: siteMetaDescription
    },
    component: React.lazy(() => import('../components/devconfig')),
    role:DEVADMIN_ROLE
  },
  {
    private: true,
    exact: true,
    path: '/order',
    meta: {
      title: siteTitle,
      description: siteMetaDescription
    },
    component: React.lazy(() => import('../components/order')),
    role:ADMIN_ROLE
  },
  {
    private: true,
    exact: true,
    path: '/label',
    meta: {
      title: siteTitle,
      description: siteMetaDescription
    },
    component: React.lazy(() => import('../components/label')),
    role:RSM_ROLE
  },
  {
    private: true,
    exact: true,
    path: '/consolidatedScans',
    meta: {
      title: siteTitle,
      description: siteMetaDescription
    },
    component: React.lazy(() => import('../components/consolidatedScans')),
    role:RSM_ROLE
  },
  {
    private: true,
    exact: true,
    path: '/inventory',
    meta: {
      title: siteTitle,
      description: siteMetaDescription
    },
    component: React.lazy(() => import('../components/inventory')),
    role:RSM_ROLE
  },

  // {
  //   private: true,
  //   exact: false,
  //   meta: {
  //     title: siteTitle,
  //     description: siteMetaDescription
  //   },
  //   component: React.lazy(() => import('../app/layouts/pageNotFound'))
  // }
];
