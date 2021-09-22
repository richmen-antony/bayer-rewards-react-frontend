
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
    editasauser : "user/editasauser",
    thirdPartyList: "user/thirdpartyuserlist",
    internalUserAPI:"user/internaluserlist",
    downloadThirdPartyList: "user/thirdpartyuserdownload",
    downloadInternalList:"user/internaluserdownload",
    getScanLog:"admin/scanloglist",
    downloadAllScanLogs:"admin/downloadscanloglist",
    getBatchList:"admin/batchlist",
    getPartnerList:"admin/partnerlist",
    featureToggle:"feature/getFeatures",
    updateFeatureToggle:"feature/EditFeatures",
    consolidatedScans : {
        getOverallScans  : "scangoods/report/level1",
        getScannedBrands : "scangoods/report/level2",
        getScannedProducts : "scangoods/report/level3",
        downloadScans : "scangoods/report/download"
    },
    inventory : {
        getOverallInventory : "inventory/report/level1",
        getBrandwiseInventory : "inventory/report/level2",
        getProductwiseInventory : "inventory/report/level3",
        downloadScans : "inventory/report/download"
    }
}