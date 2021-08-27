import React ,{Fragment,useState,useEffect}from "react";
import Download from "../../../assets/icons/download.svg";
import NoImage from "../../../assets/images/Group_4736.svg";
import { Button, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import filterIcon from "../../../assets/icons/filter_icon.svg";
import "../../../assets/scss/download.scss";

function CustomDownload(props: any) {
	const {download, downloadPopup,overallDownload,brandWiseDownload,productWiseDownload } = props;

	const [dropdownOpenDownload,settoggleDownload]= useState<boolean>(false);

	const toggleDownload =()=>{
		settoggleDownload(!dropdownOpenDownload)
	}
	// useEffect(() => { 
	// 	onClose&& onClose(toggleDownload)

	// },[dropdownOpenDownload]);

	return (
		<Fragment>
			{!downloadPopup ?
			<div>
				<button
					className="btn btn-primary"
					onClick={download}
					style={{
						backgroundColor: "#1f445a",
						borderColor: "#1f445a",
					}}
				>
					<img src={Download} width="17" alt={NoImage} />
					<span style={{ padding: "15px" }}>Download</span>
				</button>
			</div> : 
			<div className="downloadDropdown">
				<Dropdown isOpen={dropdownOpenDownload} toggle={toggleDownload}>
					<DropdownToggle>{
						<button
						className="btn btn-primary"
						onClick={(e:any)=>downloadPopup ? download :  e.preventDefault()}
						style={{
							backgroundColor: "#1f445a",
							borderColor: "#1f445a",
						}}
						>
							<img src={Download} width="17" alt={NoImage} />
							<span style={{ padding: "15px" }}>Download
							<i
                              className={`fas ${
                                dropdownOpenDownload ? "fa-sort-up" : "fa-sort-down"
                              } ml-3`}
                            ></i>
							</span>
						</button>}
					</DropdownToggle>
					<DropdownMenu right>
						<div className="p-3 dropdownMenu">
							<div>
								<div className="contents" onClick = {overallDownload}>
									<i class="fa fa-download" aria-hidden="true"></i>
									<span className="dropdownContent">Overall Scans</span>
								</div>
								<hr />
								<div className="contents" onClick = {brandWiseDownload}>
									<i class="fa fa-download" aria-hidden="true"></i>
									<span className="dropdownContent">BrandWise Scans</span>
								</div>
								<hr />
								<div className="contents" onClick = {productWiseDownload}>
									<i class="fa fa-download" aria-hidden="true"></i>
									<span className="dropdownContent">ProductWise Scans</span>
								</div>
							</div>
						</div>
					</DropdownMenu>
				</Dropdown>
			</div> }
			{/* <i
				className="fa fa-info-circle"
				style={{
					fontSize: "16px",
					fontFamily: "appRegular !important",
					marginLeft: "5px",
					marginTop: "-20px",
				}}
				title={"Full extract"}
			></i> */}
		</Fragment>
	);
}
export { CustomDownload };
