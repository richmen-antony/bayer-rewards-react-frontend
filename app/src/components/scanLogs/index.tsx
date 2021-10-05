import React, { Component } from "react";
import AUX from "../../hoc/Aux_";
import { withStyles, Theme, createStyles, WithStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import SellFarmer from "./SellFarmer";
//scss
import "../../assets/scss/scanLogs.scss";

import SendGoods from "./sendGoods/index";

//Define types of variable in states
type States = {
	userRole: string;
	value: number;
};
// Material AntTabs styles
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
/**
 * Define the tab panel values 
 * @param props 
 * @returns 
 */
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
					<Typography component={"span"}>{children}</Typography>
				</Box>
			)}
		</div>
	);
}
interface Props extends WithStyles<typeof useStyles> { }
/**
 * ScanLogs component 
 * @param props  define types
 * @param states define types
 */
class ScanLogs extends Component<Props, States> {
	timeOut: any;
	constructor(props: any) {
		//accessed parent props variable 
		super(props);
		// To maintain the default initial state management
		this.state = {
			userRole: "",
			value: 0,
		};
		this.timeOut = 0;
	}
/**
 * Handle the tab changes 
 * @param event 
 * @param newValue 
 */
	handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		//update value state 
		this.setState({ value: newValue });
	};
	//render the ui elements
	render() {
		const { classes } = this.props;
		return (
			<AUX>
				<div>
					<div className={classes?.root}>
						<div className="tab-header"><p>Scan Logs</p></div>
						<AntTabs value={this.state.value} onChange={this.handleChange} aria-label="ant example">
							<AntTab label="Send Goods" />
							<AntTab label="Sell to Farmer" />
						</AntTabs>
						<TabPanel value={this.state.value} index={0} classes={classes}>
							<SendGoods />
						</TabPanel>
						<TabPanel value={this.state.value} index={1} classes={classes}>
							<SellFarmer />
						</TabPanel>

					</div>

				</div>
			</AUX>
		);
	}
}
//export the component and wrapped material ui styles
export default withStyles(useStyles)(ScanLogs);
