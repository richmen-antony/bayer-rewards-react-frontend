const MENU_ITEMS = [{
  title: 'Dashboard',
  path: 'dashboard',
  icon: 'icon_logout',
  subMenus: []
}, {
  title: 'MANAGEMENT',
  path: 'calls',
  icon: 'icon_profile',
  subMenus: [
    {
      name: 'Create New User',
      path: 'createUser',
      icon: 'icon_profile'
    },
    {
      name: 'Registered users',
      path: 'userList',
      icon: 'icon_profile'
    }
  ]
}];


export {
  MENU_ITEMS
};

export enum FormSteps {
  CountrySetup = 1,
  LocationHierarchy = 2,
}