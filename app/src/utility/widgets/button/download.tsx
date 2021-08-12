import React ,{Fragment}from "react";
import Download from "../../../assets/icons/download.svg";
import NoImage from "../../../assets/images/Group_4736.svg";
function CustomDownload(props: any) {
	const {download } = props;
	return (
		<Fragment>
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
			</div>
			<i
				className="fa fa-info-circle"
				style={{
					fontSize: "16px",
					fontFamily: "appRegular !important",
					marginLeft: "5px",
					marginTop: "-20px",
				}}
				title={"Full extract"}
			></i>
		</Fragment>
	);
}
export { CustomDownload };
