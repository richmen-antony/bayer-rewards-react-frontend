export const configApp = {
    // env: 'https://bayer-track-trace.herokuapp.com/api/',
    akanaUrl: 'https://login.microsoftonline.com/fcb2b37b-5da0-466b-9b83-0014b67a7c78/oauth2/v2.0/token',
    env: 'https://api01-np.agro.services:443/bayerrewardsplus'
}
export const apiURL = {
    login: "user/login",
    scanLogs: "user/getScanTransactionbyRegionSearch",
    productCategory: "user/getproductcategory",
    rsmDashboard: "user/getrsmdashboard/",
    channelPartnersList: "user/getuserlist",
    retailerCreation: "user/retailercreation?isMobile=false",
    deactivateChannelPartner:"user/deactivatechannelpartner",
    activateChannelPartner:"user/activatechannelpartner",
    updateUser: "user/updateuser",
    adminUserCount: "user/getadmindashboard",
    downloadUserList:"user/downloaduserlist",
    changeLogs: "user/getchangelogs",
    downloadScanlogs:"user/downloadscantransactionlist",
}