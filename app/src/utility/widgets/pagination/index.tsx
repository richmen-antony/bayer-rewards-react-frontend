import React, { Component } from "react";
import "../../../assets/scss/pagination.scss";
import Dropdown from "../dropdown";
import { Alert } from "../toaster";
import { withStyles, Theme, WithStyles } from "@material-ui/core/styles";
import PaginationMUI from "@material-ui/lab/Pagination";
import Validator from "../../../utility/validator";

const useStyles = (theme: Theme) => ({
	root: {
		"& > *": {
			marginTop: theme.spacing(2),
		},
		"& .Mui-selected": {
			background: "transparent linear-gradient(90deg, #03BCFB 0%, #025E7E 100%) 0% 0% no-repeat padding-box",
			color: "#FFFFFF",
		},
		"& button": {
			"[aria-label=Go to previous page]": {
				background: " #FFFFFF 0% 0% no-repeat padding-box !important",
				boxShadow: "0px 3px 6px #00000029",
				border: " 0.5px solid #BFBFBF",
				borderRadius: "5px",
			},
		},
	},
});

type States = {
	startIndex: number;
	endIndex: number;
	pageNo: number;
	rowsPerPage: number;
	gotoPage: number;
};

const rowPerPageOptions = [
	{ value: "5", text: "5" },
	{ value: "10", text: "10" },
	{ value: "20", text: "20" },
	{ value: "50", text: "50" },
];
interface Props extends WithStyles<typeof useStyles> {
	totalData: any;
	data: any;
	totalLabel?: any;
	getRecords?: any;
	onRef?: any;
}
class Pagination extends Component<Props, States> {
	constructor(props: any) {
		super(props);
		this.state = {
			pageNo: 1,
			rowsPerPage: 10,
			gotoPage: 1,
			startIndex: 1,
			endIndex: 5,
		};
	}

	componentDidMount() {
		// assign a refrence
		this.props.onRef && this.props.onRef(this);
	}
	handleGoToPage = () => {
		!this.state.pageNo && Alert("error", "Go to Page should be greater than 0");
	};
	previous = (pageNo: any) => {
		this.setState({ pageNo: pageNo - 1 }, () => this.props.getRecords());
	};
	next = (pageNo: any) => {
		this.setState({ pageNo: pageNo + 1 }, () => this.props.getRecords());
	};
	pageNumberClick = (number: any) => {
		this.setState({ pageNo: number }, () => this.props.getRecords(number));
	};

	backForward = () => {
		this.setState({
			startIndex: this.state.startIndex - 3,
			endIndex: this.state.endIndex - 1,
		});
	};
	fastForward = () => {
		this.setState({
			startIndex: this.state.endIndex + 1,
			endIndex: this.state.endIndex + 3,
		});
	};

	handlePaginationChange = (e: any) => {
		let value = 0;
		if (e.target.name === "perpage") {
			value = e.target.value;
			this.setState({ rowsPerPage: value }, () => this.props.getRecords());
		} else if (e.target.name === "gotopage") {
			const { rowsPerPage } = this.state;
			const { totalData } = this.props;
			const pageData = Math.ceil(totalData / rowsPerPage);
			value = e.target.value === "0" || pageData < e.target.value ? "" : e.target.value;
			let isNumeric = Validator.validateNumeric(e.target.value);
			if (isNumeric) {
				this.setState({ pageNo: value }, () => {
					if (this.state.pageNo && pageData >= this.state.pageNo) {
						this.props.getRecords(this.state.pageNo);
					}
				});
			}
		}
	};

  setDefaultPage=()=>{
    this.setState({pageNo:1})
  }

	render() {
		const { totalData, data, totalLabel, classes } = this.props;
		const { pageNo, rowsPerPage } = this.state;
		const pageNumbers = [];
		const pageData = Math.ceil(totalData / rowsPerPage);
		for (let i = 1; i <= pageData; i++) {
			pageNumbers.push(i);
		}
		return (
			<>
				{data?.length > 0 && (
					<div className="col-sm-12">
						<div className="row">
							<div
								className="col-sm-6"
								style={{
									display: "flex",
									justifyContent: "flex-start",
									fontSize: "13px",
									alignItems: "center",
									padding: "0",
								}}
							>
								<div className="col-sm-4 pl-0">
									Total {totalLabel || "Users"}: {totalData || 0}
								</div>

								<div className="col-sm-5">
									<div style={{ display: "flex", alignItems: "center" }}>
										<span style={{ marginRight: "10px" }}>Rows Per Page</span>
										<span style={{ width: "25%" }}>
											<Dropdown
												name="perpage"
												options={rowPerPageOptions}
												handleChange={(event: any) => this.handlePaginationChange(event)}
												value={rowsPerPage}
												isPlaceholder
												width={50}
												isDisabled={!pageNo}
											/>
										</span>
									</div>
								</div>

								<div className="col-sm-4">
									<div style={{ display: "flex", alignItems: "center" }}>
										<span style={{ marginRight: "10px" }}>Go to Page</span>
										<span style={{ width: "25%" }}>
											<input
												style={{ width: "100%" }}
												type="text"
												className="form-control"
												name="gotopage"
												value={pageNo}
												onChange={(e: any) => this.handlePaginationChange(e)}
												onBlur={this.handleGoToPage}
											/>
										</span>
									</div>
								</div>
							</div>
							<div
								className="col-sm-6"
								style={{
									display: "flex",
									justifyContent: "flex-end",
									paddingRight: "0px",
								}}
							>
								<div className="paginationNumber">
									<PaginationMUI
										className={classes?.root}
										count={pageData}
										shape="rounded"
										page={Number(pageNo)}
										onChange={(event, val) => this.pageNumberClick(val)}
									/>
								</div>
							</div>
						</div>
					</div>
				)}
			</>
		);
	}
}
export default withStyles(useStyles)(Pagination);
