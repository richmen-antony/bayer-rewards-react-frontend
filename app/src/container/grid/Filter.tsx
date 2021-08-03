import React from "react";
import { SearchInput } from "../../utility/widgets/input/search-input";
import { Button, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import filterIcon from "../../assets/icons/filter_icon.svg";
import Download from "../../assets/icons/download.svg";
import NoImage from "../../assets/images/Group_4736.svg";
interface Props {
	dropdownOpenFilter: boolean;
	handleSearch: (e: any) => any;
	toggleFilter: (e: any) => any;
	download: () => any;
	searchText: string;
	children: any;
	handleFilterChange: (e: any, name: string, item: any) => any;
	selectedFilters: any;
	partnerType?: any[];
	salesType?: any[];
}

/**
 *Filter Functional Component
 * @param props
 * @returns
 */
const Filter: React.FC<Props> = (props: Props) => {
	const {
		dropdownOpenFilter,
		handleSearch,
		searchText,
		toggleFilter,
		download,
		children,
		partnerType,
		handleFilterChange,
		selectedFilters,
		salesType,
	} = props;
	return (
		<div className="advisor-filter">
			<div className="filter-left-side">
				<SearchInput
					name="searchText"
					data-testid="search-input"
					placeHolder="Search (min 3 letters)"
					type="text"
					onChange={handleSearch}
					value={searchText}
					tolltip="Search applicable for Order ID, Retailer Name/ID, Farmer Name/ID, Advisor Name/ID."
				/>
				<div className="filter-right-side">
					{salesType && salesType.length > 0 && (
						<div className="filter-partnertype" style={{marginLeft:"10px"}}>
							<label className="font-weight-bold pt-2" style={{ color: "#363636", fontSize: "12px" }}>
								Sales Type
							</label>
							<div className="partnertype-list">
								{salesType &&
									salesType.map((item: any, index: number) => {
										return (
											<span className="mr-2" key={index}>
												<Button
													color={
														selectedFilters.salesType === item ? "btn activeColor rounded-pill" : "btn rounded-pill boxColor"
													}
													size="md"
													onClick={(e: any) => handleFilterChange(e, "salesType", item)}
												>
													{item ==="WALKIN_SALES" ? "Walk-In Sales":"Advisor Sales"}
												</Button>
											</span>
										);
									})}
							</div>
						</div>
					)}
					<div className="filter-partnertype">
						<label className="font-weight-bold pt-2" style={{ color: "#363636", fontSize: "12px" }}>
							Partner Type
						</label>
						<div className="partnertype-list">
							{partnerType &&
								partnerType.map((item: any, index: number) => {
									return (
										<span className="mr-2" key={index}>
											<Button
												color={
													selectedFilters.partnerType === item ? "btn activeColor rounded-pill" : "btn rounded-pill boxColor"
												}
												size="md"
												onClick={(e: any) => handleFilterChange(e, "partnerType", item)}
											>
												{item}
											</Button>
										</span>
									);
								})}
						</div>
					</div>
					<div className="filterRow">
						<Dropdown isOpen={dropdownOpenFilter} toggle={toggleFilter}>
							<DropdownToggle>{!dropdownOpenFilter && <img src={filterIcon} width="17" alt="filter" />}</DropdownToggle>
							<DropdownMenu right>
								<div className="p-3">
									<i className="fa fa-filter boxed float-right" aria-hidden="true" onClick={toggleFilter}></i>
									{children}
								</div>
							</DropdownMenu>
						</Dropdown>
					</div>
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
				</div>
			</div>
		</div>
	);
};

export default Filter;
