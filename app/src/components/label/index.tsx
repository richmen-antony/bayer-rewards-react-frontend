import React, { useState } from "react";
import LabelsTable from "./LabelsTable";
import SearchLabel from "./SearchLabel";

//css file
import "../../assets/scss/label.scss";

/**
 *Label Functional Component
 * @param props
 * @returns
 */
const Label: React.FC = (props) => {
	const [searchText, setSearchText] = useState<string>("");
	const handleSearch = (event: any) => {
		setSearchText(event.target.value);
	};

	return (
		<div className="label-container">
			<p className="title">Label ID</p>
			<div className="card card-main ">
				{searchText ? <LabelsTable /> : <SearchLabel searchText={searchText} handleSearch={handleSearch} />}
			</div>
		</div>
	);
};

export default Label;
