import React  from "react";
import { SearchInput } from "../../utility/widgets/input/search-input";
import "../../assets/scss/filter.scss";
//image file
import ProductImg from "../../assets/images/Group_4736.svg";

interface Props {
	handleSearch: (event: any) => void;
	searchText: string;
}

/**
 *Label Table Functional Component
 * @param props
 * @returns
 */
const SearchLabel: React.FC<Props> = ({ searchText, handleSearch }) => {
	return (
		<>
			<div className="search-center">
				<p className="search-title">Which Label ID would you like to view?</p>
				<div style={{ marginLeft: "64px" }}>
					<SearchInput
						name="searchText"
						data-testid="search-input"
						placeHolder="Search ..."
						type="text"
						onChange={handleSearch}
						value={searchText}
						width="380px"
					/>
				</div>
			</div>
			<div className="bottom">
				<div className="footer-img">
					<img src={ProductImg} alt="" />
					<img src={ProductImg} alt="" />
				</div>
			</div>
		</>
	);
};

export default SearchLabel;
