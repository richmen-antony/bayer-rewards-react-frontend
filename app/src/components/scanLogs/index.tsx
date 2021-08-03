import React, { Component } from "react";
import AUX from "../../hoc/Aux_";
import Loader from "../../utility/widgets/loader";
import { withStyles, Theme, createStyles, WithStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ScanLogsTable from "./ScanLogsTable";
//scss
import "../../assets/scss/scanLogs.scss";

import  SendGoods from "./SendGoods";

type States = {
	userRole: string;
	isLoader: boolean;
	value: number;
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
					<Typography component={"span"}>{children}</Typography>
				</Box>
			)}
		</div>
	);
}
interface Props extends WithStyles<typeof useStyles> {}
class ScanLogs extends Component<Props, States> {
	timeOut: any;
	constructor(props: any) {
		super(props);
		this.state = {
			userRole: "",
			isLoader: false,
			value: 0,
		};
		this.timeOut = 0;
	}

	handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		this.setState({ value: newValue });
	};
	render() {
		const { isLoader } = this.state;
		const { classes } = this.props;

		return (
			<AUX>
				{isLoader && <Loader />}
				<div>
					<div className={classes?.root}>
						<div>
							<div className="tabs">
								<AntTabs value={this.state.value} onChange={this.handleChange} aria-label="ant example">
									<AntTab label="Send Goods" />
									<AntTab label="Sell to Farmer" />
								</AntTabs>
							</div>

							<Typography />
						</div>
						<TabPanel value={this.state.value} index={0} classes={classes}>
						<SendGoods />
						</TabPanel>
						<TabPanel value={this.state.value} index={1} classes={classes}>
						<ScanLogsTable />
						</TabPanel>
					</div>
				</div>
			</AUX>
		);
	}
}
export default withStyles(useStyles)(ScanLogs);
