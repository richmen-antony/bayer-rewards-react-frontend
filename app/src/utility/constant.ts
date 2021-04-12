const MENU_ITEMS=[{
  title:'Dashboard',
  path:'dashboard',
  icon:'icon_logout',
  subMenus: []
},{
  title:'MANAGEMENT',
  path:'calls',
  icon:'icon_profile',
  subMenus: [
    {
      name: 'Create a new user',
      path: 'createUser',
      icon:'icon_profile'
    },
    {
      name: 'Registered users',
      path: 'userList',
      icon:'icon_profile'
    }
  ]
}];


export{
  MENU_ITEMS
};