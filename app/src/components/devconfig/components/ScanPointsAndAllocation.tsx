import React, { useState, useEffect } from "react";
import "../../devconfig/devconfig.scss";
import { connect } from "react-redux";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
import _ from "lodash";
import { addScanpointsAndAllocationInputList } from "../../../redux/actions";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
  withStyles,
} from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import InputBase from '@material-ui/core/InputBase';



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
      fontSize: 16,
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
      minWidth: 175,
      maxWidth: 300,
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
  })
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

function getStyles(name: string, packageLevelName: string[], theme: Theme) {
  return {
    fontWeight:
      packageLevelName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface IScanPointsAndAllocationProps {
  scanpointsandallocation: any;
  setInputList: (data: any) => void;
  tntflow: any;
  packagingdefinition: any;
}

export const ScanPointsAndAllocation = (
  props: IScanPointsAndAllocationProps
) => {
  const {
    scanpointsandallocation: { inputList },
    setInputList,
  } = props;
  console.log({inputList})
  const [valSelected, setValSelected] = useState("NA");
  const classes = useStyles();
  const theme = useTheme();
  const [packageLevelName, setPackageDropdown] = React.useState<string[]>([]);
  const [packageLevelList,setPackageLevelList]=React.useState<string[]>([]);


  const paackaginglevelList =props.packagingdefinition?.inputList?.length>0&&_.uniqBy(
    props.packagingdefinition.inputList,
    "packaginghierarchyname"
  );
  const packageLevelOption=paackaginglevelList?.length>0&&paackaginglevelList.map((value:any)=>{ return (value.packaginghierarchyname&& value.packaginghierarchyname)});
   console.log({packageLevelOption,paackaginglevelList})
  
   

  // handle input change
  const handleInputChange = (e: any, index: any) => {
    const { name, value } = e.target;
    const list: any = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index: any) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = (index: any) => {
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
  };

  const handleDropdownPostionChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].position = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  const handleScannedbyChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].scannedby = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  const handleScannedtypeChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].scantype = value;
    setInputList(list);
    setValSelected(event.target.value);
  };

  const handlePackaginglevelChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    list[index].packaginglevel = value.join(",");
    setInputList(list);
    setValSelected(event.target.value);
  };

  const handlePointsallocatedChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const list: any = [...inputList];
    console.log("value : ", value);
    list[index].pointallocated = value;
    setInputList(list);
    setValSelected(event.target.value);
  };
 
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>,i:number) => {
    console.log("calue",event.target.value);
    setPackageDropdown(event.target.value as string[]);
    handlePackaginglevelChange(event,i)
  };

  const handleChangeMultiple = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const { options } = event.target as HTMLSelectElement;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setPackageDropdown(value);
  };
  useEffect(() => {
    if(packageLevelOption){
      setPackageLevelList(packageLevelOption)
    }
  },[]);
  console.log({packageLevelList,packageLevelName})
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
                      <select
                        className="dpstyle selectoutline label"
                        id="dropdown"
                        name="position"
                        value={item.position}
                        onChange={(event) =>
                          handleDropdownPostionChange(event, idx)
                        }
                      >
                        {/* <option value="Plant" key="Plant">
                          Plant
                        </option>
                        <option value="Warehouse" key="Warehouse">
                          Warehouse
                        </option> */}

                        {props.tntflow.inputList.length > 0 &&
                          props.tntflow.inputList.map(({ position }: any) => (
                            <option value={position} key={position}>
                              {position}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="tableHeaderStyle">
                      <select
                        className="dpstyle selectoutline label"
                        id="dropdown"
                        name="scannedby"
                        value={item.scannedby}
                        onChange={(event) => handleScannedbyChange(event, idx)}
                      >
                        {/* <option value="Plant" key="Plant">
                          Plant
                        </option>
                        <option value="Warehouse" key="Warehouse">
                          Warehouse
                        </option> */}
                        {props.tntflow.inputList.length > 0 &&
                          props.tntflow.inputList.map(({ position }: any) => (
                            <option value={position} key={position}>
                              {position}
                            </option>
                          ))}
                      </select>
                    </td>

                    <td className="tableHeaderStyle">
                      <select
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
                        {/* {idx > 0 && this.state.dpList.length > 0 && (
                          this.state.dpList.map(({ locationhierarchy }) => (
                            <option value={locationhierarchy} key={locationhierarchy}>
                              {locationhierarchy}
                            </option>
                          ))
                        )} */}
                      </select>
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
                      </select> */}
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
                          MenuProps={MenuProps}
                          
                        >
                          {packageLevelList.length > 0 &&
                          packageLevelList.map((packaginghierarchyname:any) => {
                            // let trimString= item.packaginglevel.replace(/ +/g, "");;
                            return (
                              <MenuItem key={packaginghierarchyname} value={packaginghierarchyname}>
                              <Checkbox
                                checked={item.packaginglevel.trim().split(",").indexOf(packaginghierarchyname) > -1}
                              />
                              <ListItemText primary={packaginghierarchyname} />
                            </MenuItem>
                            )
                          }
                            
                          )}
                        </Select>
                      </FormControl>
                    </td>

                    <td className="tableHeaderStyle">
                      <select
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
                      </select>
                    </td>
                    <td className="tablebtnStyle">
                      {/* {idx === inputList.length - 1 ? (
                        <img
                          style={{ width: "50px", height: "50px" }}
                          src={AddBtn}
                          onClick={() => handleAddClick(idx)}
                        />
                      ) : (
                        <img
                          style={{ width: "50px", height: "50px" }}
                          src={RemoveBtn}
                          onClick={() => handleRemoveClick(idx)}
                        />
                      )} */}

                      {idx === inputList.length - 1 ? (
                        (() => {
                          if (idx === 0 && idx === inputList.length - 1) {
                            return (
                              <div>
                                <img
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
                                    style={{ width: "50px", height: "50px" }}
                                    src={RemoveBtn}
                                    onClick={() => handleRemoveClick(idx)}
                                  />
                                </td>

                                <td style={{ border: "none" }}>
                                  <img
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
