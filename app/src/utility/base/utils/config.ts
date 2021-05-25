
export const configApp = {
    env: 'https://bayer-track-trace.herokuapp.com/api/',
    // env: 'https://bayer-reward-plus.herokuapp.com/api/'
}
export const apiURL = {
    login: "user/login",
    scanLogs: "user/getScanTransactionbyRegionSearch",
    productCategory: "user/getproductcategory",
    rsmDashboard: "user/getrsmdashboard/",
    channelPartnersList: "user/getuserlist",
    retailerCreation: "user/createexternaluser",
    deactivateChannelPartner:"user/deactivatechannelpartner",
    activateChannelPartner:"user/activatechannelpartner",
    updateUser: "user/updateuser",
    adminUserCount: "user/getadmindashboard",
    downloadUserList:"user/downloaduserlist",
    changeLogs: "user/getchangelogs",
    downloadScanlogs:"user/downloadscantransactionlist",
}