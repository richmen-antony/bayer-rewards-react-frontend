import React ,{useState} from   "react";
import { SearchInput } from "../../utility/widgets/input/search-input";
import LabelsTable from "./LabelsTable";

//css file
import "../../assets/scss/label.scss";

//image file
import ProductImg from "../../assets/images/Group_4736.svg";
/**
 *Label Functional Component
 * @param props
 * @returns
 */
const Label: React.FC = (props) => {
    const [searchText, setSearchText] = useState<string>("");
     const handleSearch= (event:any)=>{
        setSearchText(event.target.value);
     }
	return (
		<div className="label-container">
			<p className="title">Label ID</p>
			<div className="card card-main ">
				<div className="search-center">
                    {searchText && <LabelsTable />}
                    
                    <p className="search-title">Which Label ID would you like to view?</p>
                    <div style={{marginLeft:"64px"}}>                    
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
				
			</div>
			
		</div>
	);
};

export default Label;
