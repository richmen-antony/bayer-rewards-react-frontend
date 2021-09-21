import React,{useState,useEffect} from "react";
import { SearchInput } from "../../utility/widgets/input/search-input";
import { Button, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import filterIcon from "../../assets/icons/filter_icon.svg";
import { CustomDownload } from "../../utility/widgets/button/download";
import { CustomDropdown }  from "../components/customDropdown"
import "../../assets/scss/filter.scss";
interface Props {
	handleSearch: (e: any) => any;
	download?: Function;
	downloadPopup?: Boolean;
	searchText: string;
	children: any;
	partnerTypeList?: any[];
	isDownload?: boolean;
	selectedPartnerType?: any;
	handlePartnerChange?: any;
	toolTipText: string;
	internalUserTypeFilterHeading?: boolean;
	isPartnerType?: boolean;
	condType?: string;
	condTypeList?: any[];
	buttonChange?: any;
	condSelectedButton?: string;
	onClose ?:any;
	isDownloadHelpText?:boolean;
	selectedYear?: {};
	handleReactSelect?: any;
	yearOptions?: {};
	isCustomDropdown? : Boolean;
	packageType?: any;
	packageTypeOptions?: any
}

/**
 *Filter Functional Component
 * @param props
 * @returns
 */
const Filter: React.FC<Props> = (props: Props) => {
  const [dropdownOpenFilter,setToggleFilter]= useState<boolean>(false);

  const toggleFilter =()=>{
    setToggleFilter(!dropdownOpenFilter)
  }
	const {
		handleSearch,
		searchText,
		download,
		children,
		partnerTypeList,
		isDownload,
		selectedPartnerType,
		handlePartnerChange,
		toolTipText,
		internalUserTypeFilterHeading = false,
		condType,
		condTypeList,
		buttonChange,
		condSelectedButton,
		onClose,
		downloadPopup,
		isDownloadHelpText,
		isPartnerType,
		selectedYear,
		handleReactSelect,
		yearOptions,
		isCustomDropdown,
		packageType,
		packageTypeOptions
	} = props;
	console.log('selectedYear',selectedYear)

	useEffect(() => { 
		onClose&& onClose(toggleFilter)

	},[dropdownOpenFilter,onClose]); // eslint-disable-line react-hooks/exhaustive-deps
	return (
		<div className="grid-filter">
			<div className="filter-left-side">
				<SearchInput
					name="searchText"
					data-testid="search-input"
					placeHolder="Search (min 3 letters)"
					type="text"
					onChange={handleSearch}
					value={searchText}
					tolltip={toolTipText}
				/>
				{ isCustomDropdown &&
				<div className="customDropdown">
					<CustomDropdown name="selectedYear" value={selectedYear} options={yearOptions} handleReactSelect={handleReactSelect} title="Fiscal Year" /> 
					<CustomDropdown name="packageType" value={packageType} options={packageTypeOptions} handleReactSelect={handleReactSelect} title="Package Type" />
				</div>
				}

				{/* 
				{ isCustomDropdown &&
					<div className="customDropdown">
						<div className="yearlabel">
							<label className="font-weight-bold yeartext">Fiscal Year</label>
						</div>
						<ReactSelect
							name="selectedYear"
							options={yearOptions}
							handleChange={(selectedOptions: any, e: any) => {
								handleReactSelect(selectedOptions, e);
							}}
							value={selectedYear}
							defaultValue={selectedYear}
							id="year-test"
							dataTestId="year-test"
						/>
					</div>
				} */}

				<div className="filter-right-side">
					{isPartnerType &&
					<div className="filter-partnertype">
						<label className="font-weight-bold pt-2" style={{ color: "#363636", fontSize: "12px" }}>
							{internalUserTypeFilterHeading ? "User Type" : "Partner Type"}
						</label>
						<div className="partnertype-list">
							{partnerTypeList &&
								partnerTypeList.map((item: any, index: number) => {
									return (
										<span className="mr-2" key={index}>
											<Button
												color={
													selectedPartnerType.type === item ? "btn activeColor rounded-pill" : "btn rounded-pill boxColor"
												}
												size="md"
												onClick={(e: any) => handlePartnerChange(item)}
											>
												{item}
											</Button>
										</span>
									);
								})}
						</div>
					</div>}
					{condTypeList && condTypeList.length > 0 && (
						<div className="filter-partnertype" style={{ marginLeft: "10px" }}>
							<label className="font-weight-bold pt-2" style={{ color: "#363636", fontSize: "12px" }}>
								{condType}
							</label>
							<div className="partnertype-list">
								{condTypeList &&
									condTypeList.map((item: any, index: number) => {
										return (
											<span className="mr-2" key={index}>
												<Button
													color={condSelectedButton === item ? "btn activeColor rounded-pill" : "btn rounded-pill boxColor"}
													size="md"
													onClick={() =>
														buttonChange(condType === "Scan Type" ? "selectedScanType" : "selectedSalesType", item)
													}
												>
													{condType === "Scan Type" ? item : item === "WALKIN_SALES" ? "Walk-In Sales" : "Advisor Sales"}
												</Button>
											</span>
										);
									})}
							</div>
						</div>
					)}
					<div className="filterRow">
						<Dropdown isOpen={dropdownOpenFilter} toggle={toggleFilter}>
							<DropdownToggle>{!dropdownOpenFilter && <img src={filterIcon} width="17" alt="filter" />}</DropdownToggle>
							<DropdownMenu right>
								<div className="p-3" style={{minWidth:"23rem"}}>
									<i className="fa fa-filter boxed float-right" aria-hidden="true" onClick={toggleFilter}></i>
									{children}
								</div>
							</DropdownMenu>
						</Dropdown>
					</div>
					{isDownload && <CustomDownload download={download} downloadPopup={downloadPopup} isHelpText={isDownloadHelpText}/>}
				</div>
			</div>
		</div>
	);
};

export default Filter;
