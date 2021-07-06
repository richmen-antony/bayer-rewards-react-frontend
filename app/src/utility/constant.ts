const MENU_ITEMS = [
	{
		title: "Dashboard",
		path: "dashboard",
		icon: "icon_logout",
		subMenus: [],
	},
	{
		title: "MANAGEMENT",
		path: "calls",
		icon: "icon_profile",
		subMenus: [
			{
				name: "Create New User",
				path: "createUser",
				icon: "icon_profile",
			},
			{
				name: "Registered users",
				path: "userList",
				icon: "icon_profile",
			},
		],
	},
];

export const INVALID_SCANS = "Invalid Scans";
export const EXPIRED_LABEL = "Expired Labels";
export const EXPIRED_LABEL_DESC = "This product is expired";
export const NON_ADVISOR_LABEL = "Not part of advisor program";
export const NON_ADVISOR_LABEL_DESC = "This product is not part of Advisor program";
export const NON_BAYER_LABEL = "Non Bayer Labels";
export const NON_BAYER_LABEL_DESC = "Label not recognized";
export const DUPLICATE_LABEL = "Duplicate Labels";
export const DUPLICATE_LABEL_DESC = "This product is already scanned";

// order histroy table header
const FULFILLED = [
	{ label: "ORDER ID", key: "advisororderid", style: { width: "10%" } },
	{ label: "RETAILER NAME/ID", key: "username", style: { width: "16%" } },
	{ label: "REGION", key: "geolevel1", style: { width: "10%" } },
	{ label: "ORDERED QTY", key: "totalorderedquantity", style: { width: "16%", textAlign: "center" } },
	{ label: "TOTAL COST", key: "totalcost", style: { width: "12%" } },
	{ label: "ADVISOR NAME/ID", key: "advisorname", style: { width: "16%" } },
	{ label: "FARMER NAME/ID", key: "farmername", style: { width: "16%" } },
	{ label: "STATUS", key: "orderstatus", style: { width: "10%" } },
	{ label: "UPDATED DATE", key: "lastupdateddate", style: { width: "10%" }, type: "date" },
	{ label: "", key: "", style: { width: "10%" } },
];
const PENDING = [
	{ label: "ORDER ID", key: "advisororderid", style: { width: "10%" } },
	{ label: "ADVISOR NAME/ID", key: "advisorname", style: { width: "16%" } },
	{ label: "INTENDED QTY", key: "totalintendedquantity", style: { width: "10%", textAlign: "center" } },
	{ label: "TOTAL COST", key: "totalcost", style: { width: "10%" } },
	{ label: "FARMER NAME/ID", key: "farmername", style: { width: "16%" } },
	{ label: "STATUS", key: "orderstatus", style: { width: "10%" } },
	{ label: "ORDERED DATE", key: "ordereddate", style: { width: "10%" }, type: "date" },
	{ label: "UPDATED DATE", key: "lastupdateddate", style: { width: "10%" }, type: "date" },
	{ label: "", key: "", style: { width: "10%" } },
];
const EXPIRED = [
	{ label: "ORDER ID", key: "advisororderid", style: { width: "10%" } },
	{ label: "ADVISOR NAME/ID", key: "advisorname", style: { width: "16%" } },
	{ label: "INTENDED QTY", key: "totalintendedquantity", style: { width: "10%", textAlign: "center" } },
	{ label: "TOTAL COST", key: "totalcost", style: { width: "10%" } },
	{ label: "FARMER NAME/ID", key: "farmername", style: { width: "16%" } },
	{ label: "STATUS", key: "orderstatus", style: { width: "10%" } },
	{ label: "ORDERED DATE", key: "ordereddate", style: { width: "10%" }, type: "date" },
	{ label: "EXPIRED DATE", key: "expirydate", style: { width: "10%" }, type: "date" },
	{ label: "", key: "", style: { width: "10%" } },
];
const CANCELLED = [
	{ label: "ORDER ID", key: "advisororderid", style: { width: "10%" } },
	{ label: "ADVISOR NAME/ID", key: "advisorname", style: { width: "16%" } },
	{ label: "INTENDED QTY", key: "totalintendedquantity", style: { width: "10%", textAlign: "center" } },
	{ label: "TOTAL COST", key: "totalcost", style: { width: "10%" } },
	{ label: "FARMER NAME/ID", key: "farmername", style: { width: "16%" } },
	{ label: "STATUS", key: "orderstatus", style: { width: "10%" } },
	{ label: "ORDERED DATE", key: "ordereddate", style: { width: "10%" }, type: "date" },
	{ label: "UPDATED DATE", key: "lastupdateddate", style: { width: "10%" }, type: "date" },
	{ label: "", key: "", style: { width: "10%" } },
];

const OrderHistroyHeader: any = {
	FULFILLED,
	PENDING,
	EXPIRED,
	CANCELLED,
};

export { MENU_ITEMS, OrderHistroyHeader };
