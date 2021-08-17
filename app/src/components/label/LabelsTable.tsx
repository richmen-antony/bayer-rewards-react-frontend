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

	const download = () => {

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
			<div className="label-table">
				<table>
					<thead>
						<tr>
							<th>Label Details</th>
						</tr>
						<tbody>
							<tr>
								<td className="title">Label ID</td>
								<td className="value">623569852125332</td>
							</tr>
							<tr>
								<td className="title">Label Type</td>
								<td  className="value">SKU</td>
							</tr>
							<tr>
								<td className="title">Code Type</td>
								<td  className="value">1</td>
							</tr>
							<tr>
								<td className="title">Batch #</td>
								<td  className="value">98301238</td>
							</tr>
							<tr>
								<td className="title">Product Name</td>
								<td  className="value" >Corn</td>
							</tr>

							<tr>
								<td className="title">Product ID</td>
								<td  className="value">3211123</td>
							</tr>
							<tr>
								<td className="title">Produced Date</td>
								<td  className="value">26 Jun, 2020</td>
							</tr>
							<tr>
								<td className="title">Filled Date</td>
								<td className="value">26 Jun, 2020</td>
							</tr>
							<tr>
								<td className="title">Expired Date</td>
								<td className="value">26 Jun, 2020</td>
							</tr>
						</tbody>
					</thead>
				</table>

			</div>
		</div>
	);
};

export default LabelsTable;
