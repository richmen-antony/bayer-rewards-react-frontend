/**
 * This file is based on table data for configure toggle data
 * File name Feature.js
 */

/**
 * Data is associated header values for mobile and web categories
 */
const headerData = {
  mobile: [
    { title: "Level 1", subTitle: "Dealer" },
    { title: "Level 2", subTitle: "Sub Dealer" },
    { title: "Field Sales", subTitle: "" },
    { title: "Field Sales Manager", subTitle: "" },
  ],
  web: [
    { title: "Field Sales", subTitle: "" },
    { title: "Field Sales Manager", subTitle: "" },
    { title: "Country-Admin", subTitle: "Dealer" },
    { title: "Country-Dev", subTitle: "Sub Dealer" },
  ],
};

/**
 * rowData is based on the values are mobile and web toogle data
 */
const rowsData = {
    // mobile 
  mobile: [
    {
      label: "Dashboard Overview",
      isLevelOneToggle: true,
      isLevelTwoToggle: true,
      isFieldSalesToggle: true,
      isFieldSalesManagerToggle: true,
    },
    {
      label: "Dashboard Scan Button",
      isLevelOneToggle: true,
      isLevelTwoToggle: true,
      isFieldSalesToggle: true,
      isFieldSalesManagerToggle: true,
    },
    {
      label: "Redeem Points Button",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
    {
      label: "Recently/Most Sold Products",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
    {
      label: "Inventory Overview",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
    {
      label: "Inventory Details",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
    {
      label: "Scan History",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
    {
      label: "Points History",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
    {
      label: "Send Goods Plan",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
    {
      label: "Receive Goods Plan",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
  ],
  // web 
  web: [
    {
      label: "Notification",
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
      isCountryAdminToggle: false,
      isCountryDevToggle: false,
    },
    {
      label: "Scan Overview",
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
      isCountryAdminToggle: false,
      isCountryDevToggle: false,
    },
    {
      label: "Dashboard Overview",
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
      isCountryAdminToggle: false,
      isCountryDevToggle: false,
    },
    {
      label: "Targets Overview",
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
      isCountryAdminToggle: false,
      isCountryDevToggle: false,
    },
    {
      label: "Overall User Info",
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
      isCountryAdminToggle: false,
      isCountryDevToggle: false,
    },
    {
      label: "Sales by Region",
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
      isCountryAdminToggle: false,
      isCountryDevToggle: false,
    },
    {
      label: "Top Selling Customers/Products",
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
      isCountryAdminToggle: false,
      isCountryDevToggle: false,
    },
  ],
};
// export headerData,rowsData to accesss other file
export { headerData, rowsData };
