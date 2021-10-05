import React, { useEffect } from "react";
import "../../devconfig/devconfig.scss";
import { connect } from "react-redux";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
import _ from "lodash";
import { addScanpointsAndAllocationInputList } from "../../../redux/actions";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import InputBase from '@material-ui/core/InputBase';
import { ConfigSelect } from "../../../utility/widgets/dropdown/ConfigSelect";
import { handledropdownoption } from "../../../utility/helper";


const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 14,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }),
)(InputBase);


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      // margin: theme.spacing(1),
      minWidth: 185,
      // maxWidth: 185,
      marginTop: -12,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
    menuPaper: {
      maxHeight: 150,
    },
  })
);







interface IScanPointsAndAllocationProps {
  inputList: any;
  setInputList: (data: any) => void;
  getValidation: () => void;
  isValidNext: boolean;
  tntflow: any;
  packagingdefinition: any;
}
const scanTypeOptions = [
  { value: "NA", text: "NA" },
  { value: "ADVISOR", text: "ADVISOR" },
  { value: "WALKIN", text: "WALKIN" },
  { value: "SEND GOODS", text: "SEND GOODS" },
];

const pointallocatedOptions = [
  { value: "true", text: "YES" },
  { value: "false", text: "NO" },
];

export const ScanPointsAndAllocation = (
  props: IScanPointsAndAllocationProps
) => {
  const {
     inputList,
    setInputList,
    getValidation,
    isValidNext,
  } = props;
  const classes = useStyles();
  // const theme = useTheme();
  // const [packageLevelName, setPackageDropdown] = React.useState<string[]>([]);
  const [packageLevelList,setPackageLevelList]=React.useState<string[]>([]);


  const paackaginglevelList =props.packagingdefinition?.inputList?.length>0&&_.uniqBy(
    props.packagingdefinition.inputList,
    "packaginghierarchyname"
  );
  const packageLevelOption=paackaginglevelList?.length>0&&paackaginglevelList.map((value:any)=>{ return (value.packaginghierarchyname&& value.packaginghierarchyname)});
  
   

  // handle input change
  // const handleInputChange = (e: any, index: any) => {
  //   const { name, value } = e.target;
  //   const list: any = [...inputList];
  //   list[index][name] = value;
  //   setInputList(list);
  // };

  // handle click event of the Remove button
  const handleRemoveClick = (index: any) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = (index: any) => {
  
    // get current list of array
    const data = inputList[index];
      // to call validate fn from parent component 
      getValidation();
    // check and validate fields is not empty string
    if(!Object.values(data).some(el=>el===""||el===0 )){
      setInputList([
        ...inputList,
        //   {
        //     position: { id: 0, value: "NA" },
        //     scannedby: { id: 0, value: "NA" },
        //     scantype: { id: 0, value: "NA" },
        //     packaginglevel: { id: 0, value: "NA" },
        //     pointallocated: { id: 0, value: "NA" },
        //   },
        {
          position: 0,
          scannedby: "",
          scantype: "",
          packaginglevel: "",
          pointallocated: false,
        },
      ]);
    }
    
  };

  const handleDropdownPostionChange = async(event: any, index: any) => {
    const { value } = event.target;
    const list: any = [...inputList];
    list[index].position = value;
    setInputList(list);
    // To get recent list value updated and then call validation method
    const canSetInputList:any =  await Promise.resolve(setInputList(list));
    if(canSetInputList)
     getValidation();
  };

  const handleScannedbyChange = async(event: any, index: any) => {
    const { value } = event.target;
    const list: any = [...inputList];
    list[index].scannedby = value;
    setInputList(list);
    // To get recent list value updated and then call validation method
    const canSetInputList:any =  await Promise.resolve(setInputList(list));
    if(canSetInputList)
     getValidation();
  };

  const handleScannedtypeChange = async(event: any, index: any) => {
    const {value } = event.target;
    const list: any = [...inputList];
    list[index].scantype = value;
    setInputList(list);
    // To get recent list value updated and then call validation method
    const canSetInputList:any =  await Promise.resolve(setInputList(list));
    if(canSetInputList)
     getValidation();
  };

  const handlePackaginglevelChange = async(event: any, index: any) => {
    const list: any = [...inputList];
     // remove empty string from array
     const result =  event.target.value&&event.target.value.filter((e:any) =>  e);
    list[index].packaginglevel = result.join(",");
    setInputList(list);
    // To get recent list value updated and then call validation method
    const canSetInputList:any =  await Promise.resolve(setInputList(list));
    if(canSetInputList)
     getValidation();
  };

  const handlePointsallocatedChange = (event: any, index: any) => {
    const {  value } = event.target;
    const list: any = [...inputList];
    list[index].pointallocated = value;
    setInputList(list);
  };
 
  const handleChange = (event: React.ChangeEvent<{ value: any }>,i:number) => {
   // remove empty string from array
    // const result =  event.target.value&&event.target.value.filter((e:any) =>  e);
    // setPackageDropdown(result as string[]);
    handlePackaginglevelChange(event,i)
  };

 
  useEffect(() => {
    if(packageLevelOption){
      setPackageLevelList(packageLevelOption)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  // const packaginglevelOptions = handledropdownoption(
  //   paackaginglevelList,
  //   "packaginghierarchyname"
  // );

  const positionOptions = handledropdownoption(
    props.tntflow.inputList,
    "position"
  );
  return (
    <div className="col-md-12">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 column tableScrollStyle">
            <table className="devconfig table label" id="tab_logic">
              <thead className="tableStyle">
                <tr>
                  <th className="tableHeaderStyle">Position</th>
                  <th className="tableHeaderStyle">Scanned By</th>
                  <th className="tableHeaderStyle">Scanned Type</th>
                  <th className="tableHeaderStyle">Packaging Level</th>
                  <th className="tableHeaderStyle">Points Allocated</th>
                  <th className="tablebtnStyle" />
                </tr>
              </thead>
              <tbody>
                {inputList.map((item: any, idx: number) => (
                  <tr id="addr0" key={idx}>
                    <td className="tableHeaderStyle">
                      {/* <select
                        className="dpstyle selectoutline label"
                        id="dropdown"
                        name="position"
                        value={item.position}
                        onChange={(event) =>
                          handleDropdownPostionChange(event, idx)
                        }
                      >
                        {props.tntflow.inputList.length > 0 &&
                          props.tntflow.inputList.map(({ position }: any) => (
                            <option value={position} key={position}>
                              {position}
                            </option>
                          ))}
                      </select> */}

                      <ConfigSelect
                        name="position"
                        options={positionOptions}
                        handleChange={(event: any) =>
                          handleDropdownPostionChange(event, idx)
                        }
                        value={item.position}
                        isPlaceholder
                        commonSelectType={true}
                      />
                      {item?.position_error && isValidNext && (
                          <span className="error">
                            {"Please select the position"}
                          </span>
                        )}
                    </td>
                    <td className="tableHeaderStyle">
                      {/* <select
                        className="dpstyle selectoutline label"
                        id="dropdown"
                        name="scannedby"
                        value={item.scannedby}
                        onChange={(event) => handleScannedbyChange(event, idx)}
                      >
                        {props.tntflow.inputList.length > 0 &&
                          props.tntflow.inputList.map(({ position }: any) => (
                            <option value={position} key={position}>
                              {position}
                            </option>
                          ))}
                      </select> */}

                      <ConfigSelect
                        name="scannedby"
                        options={positionOptions}
                        handleChange={(event: any) =>
                          handleScannedbyChange(event, idx)
                        }
                        value={item.scannedby}
                        isPlaceholder
                        commonSelectType={true}
                      />
                      
                      {item?.scannedby_error && isValidNext && (
                          <span className="error">
                            {"Please select the scanned by"}
                          </span>
                        )}
                    </td>

                    <td className="tableHeaderStyle">
                      {/* <select
                        className="dpstyle selectoutline label"
                        id="dropdown"
                        name="scantype"
                        value={item.scantype}
                        onChange={(event) =>
                          handleScannedtypeChange(event, idx)
                        }
                      >
                        <option value="NA" key="NA">
                          NA
                        </option>
                        <option value="ADVISOR" key="ADVISOR">
                          ADVISOR
                        </option>
                        <option value="RETAILER" key="RETAILER">
                          WALKIN
                        </option>
                        <option value="DISTRIBUTOR" key="DISTRIBUTOR">
                          SEND GOODS
                        </option>
                      </select> */}

                      <ConfigSelect
                        name="scantype"
                        options={scanTypeOptions}
                        handleChange={(event: any) =>
                          handleScannedtypeChange(event, idx)
                        }
                        value={item.scantype}
                        isPlaceholder
                        commonSelectType={true}
                      />
                      {item?.scantype_error && isValidNext && (
                          <span className="error">
                            {"Please select the scan type"}
                          </span>
                        )}
                    </td>
                    <td className="tableHeaderStyle">
                      {/* <select
                        className="dpstyle selectoutline label"
                        id="dropdown"
                        name="packaginglevel"
                        value={item.packaginglevel}
                        onChange={(event) =>
                          handlePackaginglevelChange(event, idx)
                        }
                      >
                        {paackaginglevelList.length > 0 &&
                          paackaginglevelList.map(
                            ({ packaginghierarchyname }: any) => (
                              <option
                                value={packaginghierarchyname}
                                key={packaginghierarchyname}
                              >
                                {packaginghierarchyname}
                              </option>
                            )
                          )}{" "}
                      </select>

                      {/* <ConfigSelect
                        name="packaginglevel"
                        options={packaginglevelOptions}
                        handleChange={(event: any) =>
                          handlePackaginglevelChange(event, idx)
                        }
                        value={item.packaginglevel}
                        isPlaceholder
                        commonSelectType={true}
                      /> */}
                      <FormControl className={classes.formControl}>
                        <Select
                          labelId="demo-mutiple-checkbox-label"
                          id="demo-mutiple-checkbox"
                          multiple
                          value={item.packaginglevel.split(",")}
                          onChange={(e:any)=>handleChange(e,idx)}
                          input={<BootstrapInput />}
                          renderValue={(selected) =>
                            
                            (selected as string[]).join(", ")
                          }
                          // MenuProps={MenuProps}

                          MenuProps={{
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "left",
                            },
                            transformOrigin: {
                              vertical: "top",
                              horizontal: "left",
                            },
                            getContentAnchorEl: null,
                            classes: { paper: classes.menuPaper },
                          }}
                          
                        >
                          {packageLevelList.length > 0 &&
                          packageLevelList.map((packaginghierarchyname:any) => {
                            // let trimString= item.packaginglevel.replace(/ +/g, "");;
                            return (
                              <MenuItem key={packaginghierarchyname} value={packaginghierarchyname}>
                              <Checkbox
                               style ={{
                                color: "#7EB343",
                              }}
                                checked={item.packaginglevel.trim().split(",").indexOf(packaginghierarchyname) > -1}
                              />
                              <ListItemText primary={packaginghierarchyname} />
                            </MenuItem>
                            )
                          }
                            
                          )}
                        </Select>
                      </FormControl>
                      {item?.packaginglevel_error && isValidNext && (
                          <span className="error">
                            {"Please select the package level"}
                          </span>
                        )}
                    </td>

                    <td className="tableHeaderStyle">
                      {/* <select
                        className="dpstyle selectoutline label"
                        id="dropdown"
                        name="pointallocated"
                        value={item.pointallocated}
                        onChange={(event) =>
                          handlePointsallocatedChange(event, idx)
                        }
                      >
                        <option value="true" key="YES">
                          YES
                        </option>
                        <option value="false" key="NO">
                          NO
                        </option>
                      </select> */}

                      <ConfigSelect
                        name="scantype"
                        options={pointallocatedOptions}
                        handleChange={(event: any) =>
                          handlePointsallocatedChange(event, idx)
                        }
                        value={item.pointallocated}
                        isPlaceholder
                        commonSelectType={true}
                      />
                       {item?.pointallocated_error && isValidNext && (
                          <span className="error">
                            {"Please select the points allocated"}
                          </span>
                        )}
                    </td>
                    <td className="tablebtnStyle">
                      {idx === inputList.length - 1 ? (
                        (() => {
                          if (idx === 0 && idx === inputList.length - 1) {
                            return (
                              <div>
                                <img
                                  alt=""  
                                  style={{ width: "50px", height: "50px" }}
                                  src={AddBtn}
                                  onClick={() => handleAddClick(idx)}
                                />
                              </div>
                            );
                          } else if (idx > 0 && idx === inputList.length - 1) {
                            return (
                              <div>
                                <td style={{ border: "none" }}>
                                  <img
                                    alt=""
                                    style={{ width: "50px", height: "50px" }}
                                    src={RemoveBtn}
                                    onClick={() => handleRemoveClick(idx)}
                                  />
                                </td>

                                <td style={{ border: "none" }}>
                                  <img
                                    alt=""
                                    style={{ width: "50px", height: "50px" }}
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
                          onClick={() => handleRemoveClick(idx)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  devconfig: { scanpointsandallocation, tntflow, packagingdefinition },
}: any) => {
  return {
    scanpointsandallocation,
    tntflow,
    packagingdefinition,
  };
};

const mapDispatchToProps = {
  setInputList: addScanpointsAndAllocationInputList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScanPointsAndAllocation);
