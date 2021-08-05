
export const configApp = {
    // env: 'https://bayer-reward-plus.herokuapp.com/api/'
    env: process.env.REACT_APP_BRP_API_HOST
}
export const apiURL = {
    login: "user/login",
    scanLogs: "rsm/advisorsaleslog",
    productCategory: "user/getproductcategory",
    rsmDashboard: "rsm/dashboard/",
    channelPartnersList: "user/userlist",
    retailerCreation: "user/createexternaluserweb",
    deactivateChannelPartner:"user/deactivate",
    activateChannelPartner:"user/activate",
    updateUser: "user/update",
    adminUserCount: "admin/dashboard",
    downloadUserList:"user/download",
    changeLogs: "user/changelogs",
    downloadScanlogs:"order/advisororder/report",
    getTemplateData:"template/getTemplateByCountry",
    registerTemplateData: "template/templateForCountryRegister",
    rsmRetailerList:"order/users",
    getHierarchyLevels: "geographical/getRegLocHierLevelForWeb",
    getLevelFour: "geographical/getGeolevel4",
    getLevelFive: "geographical/getGeolevel5",
    downloadChanglogs:"user/changelogsdownload",
    adminOrderList:"admin/orderlist",
    downloadAdminOrderList:"admin/downloadorderlist",
    channelPartners : "user/channelpartnerlist",
    asaCreation : "user/createasauser",
    thirdPartyList: "user/thirdpartyuserlist",
    internalUserAPI:"user/internaluserlist",
    downloadThirdPartyList: "user/thirdpartyuserdownload"
}