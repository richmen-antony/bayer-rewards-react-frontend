import React from "react";
import "../../devconfig/devconfig.scss";
import { connect } from "react-redux";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
import { addPackagingDefinitionInputList } from "../../../redux/actions";
import { ConfigSelect } from "../../../utility/widgets/dropdown/ConfigSelect";
import { handledropdownoption } from "../../../utility/helper";

interface IPackagingDefinitionProps {
  inputList: any;
  setInputList: (data: any) => void;
  getValidation: () => void;
  isValidNext: boolean;
}

export const PackagingDefinition = (props: IPackagingDefinitionProps) => {
  const {
     inputList,
    setInputList,
    isValidNext,
    getValidation
  } = props;
  const [activeButton, SetActiveButton] = React.useState("SEED");

  
  /**
   * handle input change
   * @param e 
   * @param index 
   * @param data 
   */
  const handleInputChange =(e: any, index: any, data: any) => {
    const { name, value } = e.target;
    const list: any = [...inputList];
    let isDuplicate:boolean=false
    const arr = list.map((val: any) => {
      //check for duplicate values
      if(val.productcategory === data.productcategory){
        if(val[name].toLowerCase() === value.toLowerCase()){
          isDuplicate=true
        }
      }
      // assign the values for current change list values
      if (
        val.productcategory === data.productcategory &&
        val.packaginghierarchylevel === data.packaginghierarchylevel
      ) {
        return (val = { ...val, [name]: value ,isDuplicate});
      } else {
        return val;
      }
    });
    // add list 
    setInputList(arr);
    // To get recent list value updated and then call validation method
    // const canSetInputList:any =  await Promise.resolve(setInputList(arr));
    // if(canSetInputList)
    //  getValidation();
    
  };

  
  /**
   * handle click event of the Remove button
   * @param index 
   * @param data 
   */
  const handleRemoveClick = (index: any, data: any) => {
    let list = [...inputList];
       list.map((val: any, i: number) => {
      if (
        val.productcategory === data.productcategory &&
        val.packaginghierarchylevel === data.packaginghierarchylevel
      ) {
        list.splice(i, 1);
      }
      return list;
    });

    list = setCorrectHierLvlSeed(list, index,data);
    setInputList(list);
  };
 /**
  * To set the hiearachy level for array list
  * @param list 
  * @param index 
  * @param data 
  * @returns 
  */
  const setCorrectHierLvlSeed = (list: any, index: number,data:any) => {
    let i=0;
    const newList = list.map((listItem: any, idx: number) => {
      if (
        listItem.productcategory === data.productcategory
      ) {
      let count = i++;
        return {
          ...listItem,
        packaginghierarchylevel: !count ? 0 : count,
          parentpackage:
            listItem.parentpackage >= index
              ? listItem.parentpackage - 1
              : listItem.parentpackage,
          // parentlocation : listItem.parentlocation === index ? -1 : listItem.parentlocation > index ? listItem.parentlocation-1 : listItem.parentlocation
        };
      }
      else{ 
        return listItem
      }
      
    });
    return newList;
  };

  
  /**
   * handle click event of the Add button
   * @param index 
   */
  const handleAddClick = (index: any) => {
    // validate the fields
    getValidation();
    const inputListSeedOrCP = inputList
    .filter((pc: any) => pc.productcategory === activeButton)
    const data = inputListSeedOrCP[index];
     if(data.packaginghierarchyname && !data.isDuplicate)
    setInputList([
      ...inputList,
      {
        productcategory: activeButton, 
        packaginghierarchylevel: inputListSeedOrCP.length,
        packaginghierarchyname: "",
        parentpackage: inputListSeedOrCP.length-1,
      },
    ]);
  };

  /**
   * To handle the dropdown values 
   * @param event 
   * @param index 
   * @param data 
   */
  const handleDropdownChange = (event: any, index: any, data: any) => {
    const { value } = event.target;
    const list: any = [...inputList];
    activeButton === data.productcategory &&
      list.map((val: any, i: number) => {
        if (
          val.productcategory === data.productcategory &&
          val.packaginghierarchylevel === data.packaginghierarchylevel
        ) {
          list[i].parentpackage = value;
          setInputList(list);
        }
        return list;
      });
  };

  /**
   * Function to handle active button ,where based on mobile and web category
   * @param value
   */
  const handleButton = (value: string) => {
    // call the SetActiveButton and update the activeButton value
    SetActiveButton(value);
  };
  const inputListData = inputList
    .filter((pc: any) => pc.productcategory === activeButton)
    .map((item: any, idx: number) => item);

  const parentpackageOptions = handledropdownoption(inputListData, "packaginghierarchyname");


  return (
    <div className="col-md-12">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-8  column tableScrollStyle">
            <div
              className="btn-group product-categeory"
              role="group"
              aria-label="Basic outlined"
            >
              <span style={{paddingRight:"85px"}}>
                <label>Product Category</label>
              </span>
              <button
                type="button"
                className={`btn btn-outline-primary ${
                  activeButton === "SEED" ? "active" : ""
                }`}
                onClick={() => handleButton("SEED")}
              >
                SEED
              </button>

              <button
                type="button"
                className={`btn btn-outline-primary ${
                  activeButton === "CP" ? "active" : ""
                }`}
                onClick={() => handleButton("CP")}
              >
                CP
              </button>
            </div>

            <table className="devconfig table label" id="tab_logic">
              <thead className="tableStyle">
                <tr>
                  <th className="tableStyle text-center">Level</th>
                  <th className="tableHeaderStyle">Name</th>
                  <th className="tableHeaderStyle">Parent Name</th>
                  <th className="tablebtnStyle" />
                </tr>
              </thead>
              <tbody>
                {inputListData.length > 0 &&
                  inputListData
                    .filter((pc: any) => pc.productcategory === activeButton)
                    .map((item: any, idx: number) => {
                      return (
                        <tr id="addr0" key={idx}>
                          <td className="tableStyle">{idx}</td>
                          <td className="tableHeaderStyle">
                            <input
                              className="form-control dpstyle label"
                              type="text"
                              name="packaginghierarchyname"
                              value={item.packaginghierarchyname}
                              onChange={(e) => handleInputChange(e, idx, item)}
                              onBlur={getValidation}
                            />
                             {isValidNext && item?.error ?  
                         <span className="error">
                         {"Please enter the name"}
                       </span> :item?.isDuplicate && (
                          <span className="error">
                            {item.packaginghierarchyname + " already exists"}
                          </span>
                        )  }
                          {/* {item?.error && isValidNext && (
                          <span className="error">
                            {"Please enter the name"}
                          </span>
                        )}
                        {item?.isDuplicate && isValidNext && (
                          <span className="error">
                            {item.packaginghierarchyname + " already exists"}
                          </span>
                        )} */}
                          </td>

                          <td className="tableHeaderStyle">
                            {/* <select
                              className="dpstyle selectoutline label"
                              defaultValue="NA"
                              name="parentpackage"
                              data-id={idx}
                              id="dropdown"
                              value={item.parentpackage}
                              onChange={(event) =>
                                handleDropdownChange(event, idx, item)
                              }
                            >
                              <option value="NA" key="NA">
                                NA
                              </option>
                              {idx > 0 &&
                                inputListData.length > 0 &&
                                inputListData.map(
                                  (
                                    {
                                      packaginghierarchyname,
                                      productcategory,
                                    }: any,
                                    index: number
                                  ) =>
                                    index < idx &&
                                    productcategory === activeButton && (
                                      <option
                                        value={index}
                                        key={packaginghierarchyname}
                                      >
                                        {packaginghierarchyname}
                                      </option>
                                    )
                                )}
                            </select> */}
                            <ConfigSelect
                          defaultValue="NA"
                          name="parentpackage"
                          options={parentpackageOptions}
                          handleChange={(event: any) =>
                            handleDropdownChange(event, idx, item)
                          }
                          value={
                            Number(item.parentpackage) ===-1 || item.parentpackage==="" ? "NA"
                            :item.parentpackage
                          }
                          isPlaceholder
                          parentIndex={idx}
                          locationHierarchySelected={true}
                        />
                          </td>

                          <td className="tablebtnStyle">
                            {idx === inputListData.length - 1 ? (
                              (() => {
                                if (
                                  idx === 0 &&
                                  idx === inputListData.length - 1
                                ) {
                                  return (
                                    <div>
                                      <img
                                        alt=""
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                        }}
                                        src={AddBtn}
                                        onClick={() => handleAddClick(idx)}
                                      />
                                    </div>
                                  );
                                } else if (
                                  idx > 0 &&
                                  idx === inputListData.length - 1
                                ) {
                                  return (
                                    <div>
                                      <td style={{ border: "none" }}>
                                        <img
                                          alt=""
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                          }}
                                          src={RemoveBtn}
                                          onClick={() =>
                                            handleRemoveClick(idx, item)
                                          }
                                        />
                                      </td>

                                      <td style={{ border: "none" }}>
                                        <img
                                          alt=""
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                          }}
                                          src={AddBtn}
                                          onClick={() => handleAddClick(idx)}
                                        />
                                      </td>
                                    </div>
                                  );
                                }
                              })()
                            ) : (
                              <img
                                alt=""
                                style={{ width: "50px", height: "50px" }}
                                src={RemoveBtn}
                                onClick={() => handleRemoveClick(idx, item)}
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ devconfig: { packagingdefinition } }: any) => {
  return {
    packagingdefinition,
  };
};

const mapDispatchToProps = {
  setInputList: addPackagingDefinitionInputList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PackagingDefinition);
