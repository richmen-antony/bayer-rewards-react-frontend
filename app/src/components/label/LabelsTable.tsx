import React, { useState } from "react";
import { CustomDownload } from "../../utility/widgets/button/download";
import { SearchInput } from "../../utility/widgets/input/search-input";
import "../../assets/scss/filter.scss";

/**
 *Label Table Functional Component
 * @param props
 * @returns
 */
const LabelsTable: React.FC = (props) => {

  const download =()=>{

  }
	return (
		<div>
			<div className="grid-filter">
				<div className="filter-left-side">
					<SearchInput
						name="searchText"
						data-testid="search-input"
						placeHolder="Search (min 3 letters)"
						type="text"
						// onChange={handleSearch}
						// value={searchText}
						// tolltip={toolTipText}
					/>
					<div className="filter-right-side">
          <CustomDownload download={download} />
          </div>
         
				</div>
			</div>
		</div>
	);
};

export default LabelsTable;
