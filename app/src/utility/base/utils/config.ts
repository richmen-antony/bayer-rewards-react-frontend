
export const configApp = {
    // env: 'https://bayer-track-trace.herokuapp.com/api/',
    env: 'https://bayer-reward-plus.herokuapp.com/api/'
}
export const apiURL = {
    login: "user/login",
    scanLogs: "rsm/advisorsaleslog",
    productCategory: "user/getproductcategory",
    rsmDashboard: "rsm/dashboard/",
    channelPartnersList: "user/userlist",
    retailerCreation: "user/createexternaluser",
    deactivateChannelPartner:"user/deactivate",
    activateChannelPartner:"user/activate",
    updateUser: "user/update",
    adminUserCount: "user/getadmindashboard",
    downloadUserList:"user/downloaduserlist",
    changeLogs: "user/changelogs",
    downloadScanlogs:"order/advisororder/report",
    getTemplateData:"template/getTemplateByCountry",
    registerTemplateData: "template/templateForCountryRegister"
}