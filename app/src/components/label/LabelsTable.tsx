import React, { useState } from "react";
import { SearchInput } from "../../utility/widgets/input/search-input";
/**
 *Label Table Functional Component
 * @param props
 * @returns
 */
 const LabelsTable: React.FC = (props) => {

    return <div><div className="grid-filter">
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
      <div>
                <button
                  className="btn btn-primary"
                  // onClick={download}
                  style={{
                    backgroundColor: "#1f445a",
                    borderColor: "#1f445a",
                  }}
                >
                  {/* <img src={Download} width="17" alt={NoImage} /> */}
                  <span style={{ padding: "15px" }}>Download</span>
                </button>
              </div>
      </div>
      </div>
      </div>
      </div>
  }

  export default LabelsTable;