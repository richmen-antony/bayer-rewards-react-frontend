import React from 'react';
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
    role:"public"
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
    role:"public",
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
    role:"public"
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
    role:"ADMIN"
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
    role:"ADMIN"
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
    role:"RSM"
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
    role:"DEVADMIN"
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
    role:"ADMIN"
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
    role:"RSM"
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
