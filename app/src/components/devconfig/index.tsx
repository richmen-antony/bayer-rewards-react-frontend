import React from "react";
import "../../assets/scss/configurations.scss";
import { connect } from "react-redux";
import Stepper from "../../container/components/stepper/Stepper";
import { apiURL } from "../../utility/base/utils/config";
import { invokePostService } from "../../utility/base/service";
import { Alert } from "../../utility/widgets/toaster";
import { CountrySetup } from "./components/countrysetup";
import LocationHierarchy from "./components/LocationHierarchy";
import RoleHierarchy from "./components/RoleHierarchy"; // Step 1
import TnTFlow from "./components/TnTFlow";
import PackagingDefinition from "./components/PackagingDefinition";
import ScanPointsAndAllocation from "./components/ScanPointsAndAllocation";
import { Anticounterfeit } from "./components/Anticounterfeit";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {
	addLocationInputList,
	addRoleInputList,
	addTnTFlowInputList,
	addPackagingDefinitionInputList,
	addScanpointsAndAllocationInputList,
	setAnticounterfeitSmsAuthentication,
	setAnticounterfeitDigitalScan,
	setAnticounterfeitSmartLabel,
} from "../../redux/actions/devconfig/add";
import left from "../../assets/icons/left.svg";
import ArrowIcon from "../../assets/icons/dark bg.svg";
import cluster_json from "../../utility/lib/cluster.json";
import AUX from "../../hoc/Aux_";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import right_arrow from "../../assets/icons/left-arrow.svg";
import reset from "../../assets/icons/reset.svg";
import check from "../../assets/images/check.png";
import tickIcon from "../../assets/icons/tick.svg";
import { getLocalStorageData } from "../../utility/base/localStore";
import Dropdown from "../../utility/widgets/dropdown";
import { handledropdownoption } from "../../utility/helper";
// import _ from 'lodash'

export interface IFormValue {
	id: string;
	label: string;
}
interface IDevConfigProps {
	locationhierarchy: IFormValue[];
	selectedLocationHierarchy?: IFormValue[];
	classes: any;
	loacationinputList: any;
	roleinputList: any;
	tntflowinputList: any;
	packagingdefinitionList: any;
	scanpointsandallocationinputList: any;

	addLocationInputList: any;
	addRoleInputList: any;
	addTnTFlowInputList: any;
	addPackagingDefinitionInputList: any;
	addScanpointsAndAllocationInputList: any;
	setAnticounterfeitSmsAuthentication: any;
	setAnticounterfeitDigitalScan: any;
	setAnticounterfeitSmartLabel: any;
	devconfig: any;

	location?: any;
	history?: any;
}

type MyComponentState = {
	currentStep: number;
	isActive: boolean;
	setData: Array<any>;
	setSelectedRegion: string;
	setSelectedCluster: string;
	selectedCountryDetails: Array<any>;
	selectedLocationHierarchyDetails: Array<any>;
	selectedRoleHierarchyDetails: Array<any>;
	selectedTnTFlowDetails: Array<any>;
	selectedPackagingDefinitionDetails: Array<any>;
	selectedScanPointsAndAllocationDetails: Array<any>;
	selectedAnticounterfeitDetails: Array<any>;
	isLoader: boolean;
	region: string;
	cluster: string;
	country: string;
	countrycode: string;
	currency: string;
	currencyname: string;
	value: number;
	allTemplateDataByCountry: Array<any>;
	isError: boolean;
	locationHierarchy: Array<any>;
	roleHierarchy: Array<any>;
	tntflowData: Array<any>;
	countryDetails: any;
	packageDefintionData: Array<any>;
	scanPtsAllocationData: Array<any>;
};

const AntTabs = withStyles({
	root: {
		borderBottom: "0",
	},
	indicator: {
		backgroundColor: "#1890ff",
		height: "4px",
	},
})(Tabs);

const useStyles = (theme: Theme) => ({
	root: {
		flexGrow: 1,
	},
	padding: {
		padding: "0px",
		marginTop: "5px",
	},
});
const AntTab = withStyles((theme: Theme) =>
	createStyles({
		root: {
			textTransform: "none",
			minWidth: 72,
			fontWeight: theme.typography.fontWeightRegular,
			marginRight: theme.spacing(4),
			fontFamily: [
				"-apple-system",
				"BlinkMacSystemFont",
				'"Segoe UI"',
				"Roboto",
				'"Helvetica Neue"',
				"Arial",
				"sans-serif",
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"',
			].join(","),
			"&:hover": {
				color: "#40a9ff",
				opacity: 1,
			},
			"&$selected": {
				color: "#000000",
				fontWeight: theme.typography.fontWeightBold,
			},
			"&:focus": {
				color: "#40a9ff",
			},
		},
		selected: {},
	})
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

interface StyledTabProps {
	label: string;
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
	classes?: any;
}
function TabPanel(props: TabPanelProps) {
	const { children, value, index, classes, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3} className={classes.padding}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

// class Devconfigurations extends Component<MyComponentProps, MyComponentState> {
class Devconfigurations extends React.Component<IDevConfigProps, MyComponentState> {
	constructor(props: IDevConfigProps) {
		super(props);
		this.state = {
			currentStep: 1,
			isActive: false,
			setData: [],
			setSelectedRegion: "EMEA",
			setSelectedCluster: "Africa",
			selectedCountryDetails: [],
			selectedLocationHierarchyDetails: [],
			selectedRoleHierarchyDetails: [],
			selectedTnTFlowDetails: [],
			selectedPackagingDefinitionDetails: [],
			selectedScanPointsAndAllocationDetails: [],
			selectedAnticounterfeitDetails: [],
			isLoader: false,
			region: "",
			cluster: "",
			country: "",
			countrycode: "",
			currency: "",
			currencyname: "",
			value: 0,
			allTemplateDataByCountry: [],
			isError: false,
			locationHierarchy: [],
			roleHierarchy: [],
			tntflowData: [],
			countryDetails: [],
			packageDefintionData: [],
			scanPtsAllocationData: [],
		};

		this.handleDropdownChange = this.handleDropdownChange.bind(this);
		this.handleDropdownChangeRegion = this.handleDropdownChangeRegion.bind(this);
	}

	handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		this.setState({ value: newValue });
	};

	handleDropdownChangeRegion = (event: any) => {
		this.setState({ setSelectedRegion: event.target.value });
	};

	handleDropdownChange = (event: any) => {
		this.setState({ setSelectedCluster: event.target.value });
	};

	validation() {
		const { currentStep } = this.state;
		const { loacationinputList } = this.props;
		if (currentStep === 2) {
			const isValid = loacationinputList.filter((value: any) => value.locationhiername === "");
			if (isValid) {
				this.setState({ isError: true });
			} else {
				this.setState({ isError: false });
			}
		}
	}

	handleClick(clickType?: any, e?: any) {
		let { currentStep } = this.state;
		let newStep = currentStep;
		if (clickType === undefined) {
			currentStep = currentStep - 1;
		}

		clickType === "next" ? newStep++ : newStep--;

		if (newStep === 2) {
			this.setState({
				isActive: true,
			});
		}

		if (newStep === 1) {
			this.setState({
				isActive: false,
			});
		}

		if (newStep > 0 && newStep <= stepsArray.length) {
			this.setState({
				currentStep: newStep,
			});
			// }
		}

		if (currentStep === stepsArray.length) {
			//Submit values
			this.registerTemplateByCountry();
		}

		if (clickType === "next") {
			this.handleInputValidation();
		}
	}

	handleReset() {
		const { currentStep } = this.state;
		let newStep: number = 1;
		// let newStep = 1;
		// this.setState({
		//   currentStep: newStep,
		//   isActive: false,
		// });

		switch (currentStep) {
			case 1:
				break;
			case 2:
				this.props.addLocationInputList({});
				this.props.addLocationInputList([{ locationhierlevel: 0, locationhiername: "", parentlocation: -1 }]);
				newStep = 2;
				break;
			case 3:
				this.props.addRoleInputList({});
				this.props.addRoleInputList([
					{
						rolehierarchylevel: 0,
						rolecode: "",
						rolehierarchyname: "",
						roletype: "",
						parentrole: "NONE",
					},
				]);
				newStep = 3;
				break;
			case 4:
				this.props.addTnTFlowInputList({});
				this.props.addTnTFlowInputList([{ level: 0, code: "", position: "" }]);
				newStep = 4;
				break;
			case 5:
				this.props.addPackagingDefinitionInputList({});
				this.props.addPackagingDefinitionInputList([
					{
						productcategory: "SEED",
						packaginghierarchylevel: 0,
						packaginghierarchyname: "",
						parentpackage: "",
					},
					{
						productcategory: "CP",
						packaginghierarchylevel: 0,
						packaginghierarchyname: "",
						parentpackage: "",
					},
				]);
				newStep = 5;
				break;
			case 6:
				this.props.addScanpointsAndAllocationInputList({});
				this.props.addScanpointsAndAllocationInputList([
					{
						position: 0,
						scannedby: "",
						scantype: "",
						packaginglevel: "",
						pointallocated: false,
					},
				]);
				newStep = 6;
				break;
			case 7:
				this.props.setAnticounterfeitSmsAuthentication(false);
				this.props.setAnticounterfeitDigitalScan(false);
				this.props.setAnticounterfeitSmartLabel(false);
				newStep = 7;
				break;
			default:
				break;
		}

		if (newStep === 2) {
			this.setState({
				isActive: true,
			});
		}

		if (newStep === 1) {
			this.setState({
				isActive: false,
			});
		}

		if (newStep > 0 && newStep <= stepsArray.length) {
			this.setState({
				currentStep: newStep,
			});
		}
	}

	// componentWillMount() {
	// 	let getUserdata: any = getLocalStorageData("userData");
	//     let userData = JSON.parse(getUserdata);
	// 	const setData = cluster_json;
	// 	this.setState({ setData: setData });

	// 	if (this.state.setSelectedCluster) {
	// 		this._retrieveSelectedContryofCluster(this.state.setSelectedCluster);
	// 	}
	// }

	UNSAFE_componentWillMount() {
		let getUserdata: any = getLocalStorageData("userData");
		let userData = JSON.parse(getUserdata);
		const setData = cluster_json;
		this.setState({ setData: setData });
		let setSelectedClusterName: string;

		if (userData.countrycode === "IN") {
			setSelectedClusterName = "South Asia";
			this.setState({ setSelectedRegion: "APAC" });
			this.setState({ setSelectedCluster: "South Asia" });
			this._retrieveSelectedContryofCluster(setSelectedClusterName);
		} else if (this.state.setSelectedCluster) {
			this._retrieveSelectedContryofCluster(this.state.setSelectedCluster);
		}
	}

	componentDidUpdate(prevProps: any, prevState: any) {
		if (this.state.currentStep !== prevState.currentStep) {
			window.scrollTo(0, 0);
		}
		// if (this.state.setSelectedCluster) {
		//   this._retrieveSelectedContryofCluster(this.state.setSelectedCluster);
		// }
		if (this.props.loacationinputList !== prevProps.loacationinputList) {
			this.setState({
				locationHierarchy: this.props.loacationinputList,
			});
		}
		// update the role hiearchy data in state
		if (this.props.roleinputList !== prevProps.roleinputList) {
			this.setState({
				roleHierarchy: this.props.roleinputList,
			});
		}
		// update the t and t flow  data in state
		if (this.props.tntflowinputList !== prevProps.tntflowinputList) {
			this.setState({
				tntflowData: this.props.tntflowinputList,
			});
		}
		// update the package defintion data in state
		if (this.props.packagingdefinitionList !== prevProps.packagingdefinitionList) {
			this.setState({
				packageDefintionData: this.props.packagingdefinitionList,
			});
		}
		// update the scan points allocation data in state
		if (this.props.scanpointsandallocationinputList !== prevProps.scanpointsandallocationinputList) {
			this.setState({
				scanPtsAllocationData: this.props.scanpointsandallocationinputList,
			});
		}
	}

	_retrieveSelectedContryofCluster = async (setSelectedCluster: any) => {
		try {
			let selectedCountryDetails = [];
			const regions = cluster_json;
			const filterCuntryDropdown = regions.filter(function (result) {
				return result.cluster === setSelectedCluster;
			});
			const countryUnique = this.getUnique(filterCuntryDropdown, "name");
			selectedCountryDetails = countryUnique;

			this.setState({ selectedCountryDetails });
		} catch (error) {}
	};

	registerTemplateByCountry = () => {
		const { registerTemplateData } = apiURL;
		const { devconfig } = this.props;

		let getUserdata: any = getLocalStorageData("userData");
		let userData = JSON.parse(getUserdata);
		// const { locationHierarchy, roleHierarchy, tntflowData } = this.state;
		// let locationHierarchyData = locationHierarchy.map((value: any) => {
		// 	if (value?.error || !value?.error) {
		// 		delete value.error;
		// 		return (value = { ...value });
		// 	}
		// });

		// let roleHierarchyData = roleHierarchy.map((value: any) => {
		// 	if (value?.rolehierarchyname_error || !value?.rolecode_error) {
		// 		delete value?.rolehierarchyname_error;
		// 		delete value?.rolecode_error;
		// 		return (value = { ...value });
		// 	}
		// });

		// let tntflowDataData = tntflowData.map((value: any) => {
		// 	if (value?.code_error || !value?.position_error) {
		// 		delete value?.code_error;
		// 		delete value?.position_error;
		// 		return (value = { ...value });
		// 	}
		// });

		this.setState({ isLoader: true });
		let data = {
			countrycode: devconfig.countryName,
			currencycode: devconfig.currencyCode,
			currency: devconfig.currencyName,
			country: devconfig.countryCode,
			cluster: this.state.setSelectedCluster,
			region: this.state.setSelectedRegion,
			smsauthentication: devconfig.anticounterfeit.sms_authentication,
			digitalscan: devconfig.anticounterfeit.digital_scan,
			smartlabel: devconfig.anticounterfeit.smart_label,
			createdby: userData.username,
			locationhierarchy: devconfig.location.inputList,
			rolehierarchy: devconfig.role.inputList,
			trackntraceflow: devconfig.tntflow.inputList,
			productpackagedefinition: devconfig.packagingdefinition.inputList,
			scanpointallocationdefinition: devconfig.scanpointsandallocation.inputList,
		};

		invokePostService(registerTemplateData, data)
			.then((response: any) => {
				// toastSuccess("Country configuration is successfully created");
				Alert("success", "Country configuration is successfully created");
				this.props.history.push("./dashboard");
				this.setState({
					isLoader: false,
				});
			})
			.catch((error: any) => {
				this.setState({ isLoader: false });
				let message = error.message;
				if (message === 'duplicate key value violates unique constraint "tt_tem_countrydef_pkey"') {
					message = "Country configuration is already exists";
				}
				// toastInfo(message);
				Alert("info", message);
				this.props.history.push("/devconfig");
			});
	};

	// getTemplateByCountry = () => {
	//   const { getTemplateData } = apiURL;
	//   this.setState({ isLoader: true });
	//   let data = {
	//     countryCode: "MW",
	//   };

	//   invokeGetAuthServiceTemp(getTemplateData, data)
	//     .then((response: any) => {
	//       // const location = response.body[0].locationhierarchy.map(
	//       //   (locationhier: any, idx: any) => {
	//       //     return {
	//       //       locationhierarchy: locationhier.locationhiername,
	//       //       parentlocation: {
	//       //         id: locationhier.parentlocation,
	//       //         value:
	//       //           locationhier.parentlocation === 0
	//       //             ? "NA"
	//       //             : response.body[0].locationhierarchy[
	//       //                 locationhier.parentlocation
	//       //               ].locationhiername,
	//       //       },
	//       //     };
	//       //   }
	//       // );
	//       // console.log(location);
	//       let objCountryData = response.body[0];
	//       this.props.addLocationInputList(objCountryData.locationhierarchy);
	//       this.props.addRoleInputList(objCountryData.rolehierarchy);
	//       this.props.addTnTFlowInputList(objCountryData.trackntraceflow);
	//       this.props.addPackagingDefinitionInputList(
	//         objCountryData.productpackagedefinition
	//       );
	//       this.props.addScanpointsAndAllocationInputList(
	//         objCountryData.scanpointallocationdefinition
	//       );

	//       this.props.setAnticounterfeitSmsAuthentication(
	//         objCountryData.smsauthentication
	//       );

	//       this.props.setAnticounterfeitDigitalScan(objCountryData.digitalscan);

	//       this.props.setAnticounterfeitSmartLabel(objCountryData.smartlabel);

	//       this.setState({
	//         isLoader: false,
	//       });
	//     })
	//     .catch((error: any) => {
	//       this.setState({ isLoader: false });
	//       console.log(error, "error");
	//     });
	// };

	getCountryDetails = () => {};

	_getCurrentStep = () => {
		const {
			currentStep,
			selectedCountryDetails,
			locationHierarchy,
			isError,
			roleHierarchy,
			tntflowData,
			packageDefintionData,
			scanPtsAllocationData,
		} = this.state;

		switch (currentStep) {
			case 1:
				return (
					<CountrySetup
						setCountryDetails={(data: any) => this.setState({ selectedCountryDetails: data })}
						selectedCountryDetails={selectedCountryDetails}
					/>
				);
			case 2:
				return (
					<LocationHierarchy
						getValidation={this.handleInputValidation}
						inputList={locationHierarchy}
						isValidNext={isError}
					/>
				);
			case 3:
				return <RoleHierarchy inputList={roleHierarchy} isValidNext={isError} getValidation={this.handleInputValidation} />;
			case 4:
				return <TnTFlow inputList={tntflowData} isValidNext={isError} getValidation={this.handleInputValidation} />;
			case 5:
				return (
					<PackagingDefinition
						inputList={packageDefintionData}
						isValidNext={isError}
						getValidation={this.handleInputValidation}
					/>
				);
			case 6:
				return (
					<ScanPointsAndAllocation
						inputList={scanPtsAllocationData}
						isValidNext={isError}
						getValidation={this.handleInputValidation}
					/>
				);
			case 7:
				return <Anticounterfeit />;
			default:
				break;
		}
	};

	getRegion = (region: any) => {
		var regions = cluster_json.filter(function (value: any) {
			return value.region === region;
		});
		return regions;
	};

	getUnique(arr: any, comp: any) {
		//store the comparison  values in array
		const unique = arr
			.map((e: any) => e[comp])
			// store the indexes of the unique objects
			.map((e: any, i: any, final: any) => final.indexOf(e) === i && i)
			// eliminate the false indexes & return unique objects
			.filter((e: any) => arr[e])
			.map((e: any) => arr[e]);
		return unique;
	}

	/**
	 * Validate fields
	 */
	handleInputValidation = () => {
		const { currentStep } = this.state;
		const {
			loacationinputList,
			roleinputList,
			tntflowinputList,
			packagingdefinitionList,
			scanpointsandallocationinputList,
		} = this.props;
		// validate location hierarchy data
		if (currentStep === 2) {
			const data = loacationinputList.map((value: any) => {
				if (!value.locationhiername) {
					value = { ...value, error: true };
					this.setState({
						isError: true,
						currentStep: 2,
					});
				} else {
					value = { ...value, error: false };
					this.setState({
						isError: false,
					});
				}

				if (value?.isDuplicate) {
					this.setState({
						isError: true,
						currentStep: 2,
					});
				}
				return value;
			});

			this.setState({ locationHierarchy: data });
		}
		// validate role hierarchy data
		if (currentStep === 3) {
			const data = roleinputList.map((value: any) => {
				if (!value.rolehierarchyname || !value.rolecode) {
					if (!value.rolehierarchyname && !value.rolecode) {
						value = {
							...value,
							rolehierarchyname_error: true,
							rolecode_error: true,
						};
					} else if (!value.rolehierarchyname)
						value = {
							...value,
							rolehierarchyname_error: true,
							rolecode_error: false,
						};
					else if (!value.rolecode)
						value = {
							...value,
							rolecode_error: true,
							rolehierarchyname_error: false,
						};
					this.setState({
						isError: true,
						currentStep: 3,
					});
				} else {
					value = {
						...value,
						rolehierarchyname_error: false,
						rolecode_error: false,
					};
					this.setState({
						isError: false,
					});
				}

				if (value?.rolehierarchynameIsDuplicate || value?.rolecodeIsDuplicate) {
					this.setState({
						isError: true,
						currentStep: 3,
					});
				}
				return value;
			});
			this.setState({ roleHierarchy: data });
		}
		// validate T and T Flow data
		if (currentStep === 4) {
			const data = tntflowinputList.map((value: any) => {
				if (!value.code || !value.position) {
					if (!value.code && !value.position) {
						value = { ...value, code_error: true, position_error: true };
					} else if (!value.code) {
						value = { ...value, code_error: true, position_error: false };
					} else if (!value.position) {
						value = { ...value, position_error: true, code_error: false };
					}
					this.setState({
						isError: true,
						currentStep: 4,
					});
				} else {
					value = { ...value, code_error: false, position_error: false };
					this.setState({
						isError: false,
					});
				}
				if (value?.codeIsDuplicate || value?.positionIsDuplicate) {
					this.setState({
						isError: true,
						currentStep: 4,
					});
				}

				return value;
			});
			this.setState({ tntflowData: data });
		}
		// validate package defintion data
		if (currentStep === 5) {
			const data = packagingdefinitionList.map((value: any) => {
				if (!value.packaginghierarchyname) {
					value = { ...value, error: true };
					this.setState({
						isError: true,
						currentStep: 5,
					});
				} else {
					value = { ...value, error: false };
					this.setState({
						isError: false,
					});
				}

				if (value?.isDuplicate) {
					this.setState({
						isError: true,
						currentStep: 5,
					});
				}
				return value;
			});

			this.setState({ packageDefintionData: data }, () => {});
		}
		// validate the scan points allocation data
		if (currentStep === 6) {
			const errorKeys: any[] = [];
			const data = scanpointsandallocationinputList.map((value: any) => {
				for (let key in value) {
					if (!key.includes("_error") && key !== "pointallocated" && (value[key] === "" || value[key] === 0)) {
						value = { ...value, [key + "_error"]: true };
						errorKeys.push(key + "_error");
						this.setState({
							isError: true,
							currentStep: 6,
						});
					} else {
						let appendKey = key.includes("_error") ? key : key + "_error";
						if (!errorKeys.includes(key)) {
							value = { ...value, [appendKey]: false };
						} else {
							value = { ...value, [appendKey]: true };
							this.setState({
								isError: true,
								currentStep: 6,
							});
						}
					}
					
				}
				return value;
			});
			console.log({ data });
			this.setState({ scanPtsAllocationData: data });
		}
	};
	render() {
		const { currentStep } = this.state;

		// const { region, cluster, country, countrycode, currency, currencyname } =
		// 	this.state;
		// const values = {
		// 	region,
		// 	cluster,
		// 	country,
		// 	countrycode,
		// 	currency,
		// 	currencyname,
		// };

		// const btnStyle = {
		// 	width: 185,
		// 	height: 35,
		// 	background: "#FFFFFF 0% 0% no-repeat",
		// 	boxshadow: "0px 1px 3px #0000004D",
		// 	border: "0.5px solid #006CF8",
		// 	opacity: 1,
		// 	color: "black",
		// };
		// const btnNextSubmit = {
		// 	background: "#89D329 0% 0% no-repeat padding-box",
		// 	boxshadow: "0px 1px 3px #0000004D",
		// 	// borderRadius: 10,
		// 	opacity: 1,
		// 	color: "white",
		// 	width: 185,
		// 	height: 35,
		// };

		let button;
		if (currentStep === stepsArray.length) {
			button = (
				<button className="btnNextSubmit" onClick={() => this.handleClick("next", "")}>
					Apply
					<img src={check} alt="" />
				</button>
			);
		} else {
			button = (
				<button className="btnNextSubmit cus-btn-dev" onClick={(e) => this.handleClick("next", e)}>
					Next <img src={right_arrow} alt="" />
				</button>
			);
		}

		const regions = cluster_json;
		const regionUnique = this.getUnique(regions, "region");

		const course = this.state.setSelectedRegion;
		const filterClusterDropdown = regions.filter(function (result) {
			return result.region === course;
		});
		const clusterUnique = this.getUnique(filterClusterDropdown, "cluster");
		const { classes } = this.props;
		const regionOption = handledropdownoption(regionUnique, "region");
		const clusterOption = handledropdownoption(clusterUnique, "cluster");
		return (
			<AUX>
				<div className="card-container">
					<div>
						<div className="tabs">
							<AntTabs value={this.state.value} onChange={this.handleChange} aria-label="ant example">
								<AntTab label="COUNTRY" />
								{/* <AntTab label="FEATURE TOGGLE" />
                <AntTab label="DEV CONFIG" /> */}
							</AntTabs>
							<Typography />
						</div>
						<TabPanel value={this.state.value} index={0} classes={classes}>
							{currentStep === 1 ? (
								<div className="col-md-10">
									<div className="container">
										<div className="row rm-group">
											<div className="col-sm-3">
												<div>
													<label className="font-weight-bold pt-4 label">Region</label>
												</div>
												<div>
													<Dropdown
														name="setSelectedRegion"
														label="Region"
														options={regionOption}
														handleChange={(event: any) => this.handleDropdownChangeRegion(event)}
														value={this.state.setSelectedRegion}
														isPlaceholder
														isDisabled
													/>
													{/* <select
                            disabled
                            className="dpstyle selectoutline"
                            id="dropdown"
                            value={this.state.setSelectedRegion}
                            defaultValue={values.region}
                            onChange={(event) =>
                              this.handleDropdownChangeRegion(event)
                            }
                          >
                            {regionUnique.length > 0 ? (
                              regionUnique.map(({ region }: any) => (
                                <option value={region} key={region}>
                                  {region}
                                </option>
                              ))
                            ) : (
                              <option value="" key="">
                                No Region found
                              </option>
                            )}
                          </select> */}
												</div>
											</div>
											<div className="col-sm-3">
												<div>
													<label className="font-weight-bold pt-4 label">Cluster</label>
												</div>
												<div>
													<Dropdown
														name="setSelectedCluster"
														label="Cluster"
														options={clusterOption}
														handleChange={(event: any) => this.handleDropdownChange(event)}
														value={this.state.setSelectedCluster}
														isPlaceholder
														isDisabled
													/>
													{/* <select
                            disabled
                            className="dpstyle selectoutline"
                            id="dropdown"
                            value={this.state.setSelectedCluster}
                            defaultValue={values.cluster}
                            onChange={(event) =>
                              this.handleDropdownChange(event)
                            }
                          >
                            {clusterUnique.length > 0 ? (
                              clusterUnique.map(({ cluster }: any) => (
                                <option value={cluster} key={cluster}>
                                  {cluster}
                                </option>
                              ))
                            ) : (
                              <option value="" key="">
                                No Cluster found
                              </option>
                            )}
                          </select> */}
												</div>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className="col-md-10">
									<div className="container">
										<div className="row rm-group">
											<div className="col-sm-6">
												<div>
													<label className="font-weight-bold pt-4"></label>
												</div>
												<div className="breadcrums sub-title">
													<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
														{/* <Link color="inherit" href="/">
                              {this.state.setSelectedRegion}
                            </Link>
                            <Link color="inherit">
                              {this.state.setSelectedCluster}
                            </Link> */}
														<Typography color="textPrimary">{this.state.setSelectedRegion}</Typography>
														<Typography color="textPrimary">{this.state.setSelectedCluster}</Typography>
														<Typography color="textPrimary">{this.props.devconfig.countryCode}</Typography>
													</Breadcrumbs>
													{/* <p>{"EMEA >  Africa  >Malawi"}</p> */}
												</div>
											</div>
										</div>
									</div>
								</div>
							)}

							<div className="stepper-container-horizontal">
								<Stepper direction="horizontal" currentStepNumber={currentStep - 1} steps={stepsArray} stepColor="#7DBB41" />
							</div>
							{this._getCurrentStep()}
							<div className="col-md-12 buttons-container">
								{this.state.isActive && (
									<button className="cus-btn-dev reset" onClick={() => this.handleClick()}>
										<img src={left} alt="" width="7" style={{ marginRight: "8px" }} /> Back
									</button>
								)}
								<button className="cus-btn-dev reset" onClick={() => this.handleReset()}>
									Reset <img src={reset} alt="" width="12" style={{ marginLeft: "5px" }} />
								</button>
								<button className="btnNextSubmit cus-btn-dev" onClick={() => this.handleClick("next")}>
									{currentStep === stepsArray.length ? "Apply" : "Next"}{" "}
									{currentStep === stepsArray.length ? (
										// <img src={check} />
										<span style={{ margin: 0 }}>
											<img src={tickIcon} className="arrow-i" width="12" alt="" />{" "}
											{/* <img src={RtButton} className="layout" /> */}
										</span>
									) : (
										<span>
											<img src={ArrowIcon} alt="" className="arrow-i" /> {/* <img src={RtButton} className="layout" /> */}
										</span>
									)}{" "}
								</button>
							</div>
						</TabPanel>
						{/* <TabPanel value={this.state.value} index={1} classes={classes}>
              Item Two
            </TabPanel>
            <TabPanel value={this.state.value} index={2} classes={classes}>
              Item Three
            </TabPanel> */}
					</div>
				</div>
			</AUX>
		);
	}
}

const stepsArray = [
	"Country Setup",
	"Location Hierarchy",
	"Role Hierarchy",
	"T & T Flow",
	"Packaging Definition",
	"Scan Points & Allocation",
	"Anti-counterfeit",
];

const mapStateToProps = ({
	devconfig,
	devconfig: { location, role, tntflow, packagingdefinition, scanpointsandallocation },
}: any) => {
	return {
		devconfig,
		loacationinputList: location.inputList,
		roleinputList: role.inputList,
		tntflowinputList: tntflow.inputList,
		packagingdefinitionList: packagingdefinition.inputList,
		scanpointsandallocationinputList: scanpointsandallocation.inputList,
	};
};

const mapDispatchToProps = {
	addLocationInputList,
	addRoleInputList,
	addTnTFlowInputList,
	addPackagingDefinitionInputList,
	addScanpointsAndAllocationInputList,
	setAnticounterfeitSmsAuthentication,
	setAnticounterfeitDigitalScan,
	setAnticounterfeitSmartLabel,
};

// const rootComponent = compose(withStyles(useStyles), connect(mapStateToProps))(Devconfigurations);
// export default rootComponent as React.ComponentType;

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(Devconfigurations));
