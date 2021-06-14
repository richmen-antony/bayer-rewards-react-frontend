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

export const INVALID_SCANS = 'Invalid Scans';
export const EXPIRED_LABEL = 'Expired Labels';
export const EXPIRED_LABEL_DESC = 'This product is expired';
export const NON_ADVISOR_LABEL = 'Not part of advisor program';
export const NON_ADVISOR_LABEL_DESC = 'This product is not part of Advisor program';
export const NON_BAYER_LABEL = 'Non Bayer Labels';
export const NON_BAYER_LABEL_DESC = 'Label not recognized';
export const DUPLICATE_LABEL = 'Duplicate Labels';
export const DUPLICATE_LABEL_DESC = 'This product is already scanned';