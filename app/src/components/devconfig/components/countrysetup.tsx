import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  setCountryCode,
  setCountryName,
  setCurrencyCode,
  setCurrencyName,
  addLocationInputList,
  addRoleInputList,
  addTnTFlowInputList,
  addPackagingDefinitionInputList,
  addScanpointsAndAllocationInputList,
  setAnticounterfeitSmsAuthentication,
  setAnticounterfeitDigitalScan,
  setAnticounterfeitSmartLabel,
  
} from "../../../redux/actions/devconfig/add";
import { apiURL } from "../../../utility/base/utils/config";
import { invokeGetAuthService } from "../../../utility/base/service";
import Dropdown from "../../../utility/widgets/dropdown";
import { handledropdownoption } from "../../../utility/helper";

type ICountryProps = {
  setCountryDetails: (data: any) => void;
  selectedCountryDetails: cDetails[];
  setCountryCode: (data: any) => void;
  countryCode: any;
  setCountryName: (data: any) => void;
  countryName: any;
  setCurrencyCode: (data: any) => void;
  currencyCode: any;
  setCurrencyName: (data: any) => void;
  currencyName: any;

  addLocationInputList: any;
  addRoleInputList: any;
  addTnTFlowInputList: any;
  addPackagingDefinitionInputList: any;
  addScanpointsAndAllocationInputList: any;
  setAnticounterfeitSmsAuthentication: any;
  setAnticounterfeitDigitalScan: any;
  setAnticounterfeitSmartLabel: any;
  devconfig: any;
};

// type State = {
//   foo: number;
//   bar: string;
//   baz: number;
// };

interface cDetails {
  region: string;
  cluster: string;
  isoCode: string;
  name: string;
  currency: string;
  currencyDesc: string;
}

const mapDispatchToProps = {
  setCountryCode,
  setCountryName,
  setCurrencyCode,
  setCurrencyName,

  addLocationInputList,
  addRoleInputList,
  addTnTFlowInputList,
  addPackagingDefinitionInputList,
  addScanpointsAndAllocationInputList,
  setAnticounterfeitSmsAuthentication,
  setAnticounterfeitDigitalScan,
  setAnticounterfeitSmartLabel,
};

const mapStateToProps = ({
  devconfig,
  devconfig: {
    countryCode,
    countryName,
    currencyCode,
    currencyName,
    location,
    role,
    tntflow,
    packagingdefinition,
    scanpointsandallocation,
  },
}: any) => {
  return {
    countryCode,
    countryName,
    currencyCode,
    currencyName,
    devconfig,
    loacationinputList: location.inputList,
    roleinputList: role.inputList,
    tntflowinputList: tntflow.inputList,
    packagingdefinitionList: packagingdefinition.inputList,
    scanpointsandallocationinputList: scanpointsandallocation.inputList,
  };
};

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

const CountrySetupComp = (props: ICountryProps) => {
  const {
    setCountryDetails,
    selectedCountryDetails,
    countryCode,
    setCountryCode,
    setCountryName,
    setCurrencyCode,
    setCurrencyName,
  } = props;
  const [countryISO, setCountryISO] = useState("");
  const [countryCurrency, setcountryCurrency] = useState([]);
  const [currencyDesc, setcurrencyDesc] = useState("");

  let countryDetails: cDetails[] =
    selectedCountryDetails.length > 0 ? selectedCountryDetails : [];
  useEffect(() => {
    if (countryDetails.length) {
      let countryName = countryCode ?countryCode:countryDetails[0].name;
      _retriveCountryCode(countryName)
    }
    return () => {
      setCountryDetails(countryDetails);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode]);

  // const handleDropdownChangeCurrency = (event: any) => {
  //   const countryName: any = countryDetails.filter(function (result: any) {
  //     return result.name === event.target.value;
  //   });
  //   const currencyDesc = countryName[0].currencyDesc;
  //   setcurrencyDesc(currencyDesc);
  // };

  const handleDropdownChange = (event: any) => {
    setCountryCode(event.target.value);
    _retriveCountryCode(event.target.value);
  };

  const getTemplateByCountry = (countryShortName: any) => {
    const { getTemplateData } = apiURL;
    let newCountry: boolean = true;
    let data = {
      countryCode: countryShortName,
    };

    props.addLocationInputList({});
    props.addRoleInputList({});
    props.addTnTFlowInputList({});
    props.addPackagingDefinitionInputList({});
    props.addScanpointsAndAllocationInputList({});
    props.setAnticounterfeitSmsAuthentication(false);
    props.setAnticounterfeitDigitalScan(false);
    props.setAnticounterfeitSmartLabel(false);

    invokeGetAuthService(getTemplateData, data)
      .then((response: any) => {
        newCountry = false;
        let objCountryData = response.body[0];
        props.addLocationInputList(objCountryData.locationhierarchy);
        props.addRoleInputList(objCountryData.rolehierarchy);
        props.addTnTFlowInputList(objCountryData.trackntraceflow);
        props.addPackagingDefinitionInputList(
          objCountryData.productpackagedefinition
        );
        props.addScanpointsAndAllocationInputList(
          objCountryData.scanpointallocationdefinition
        );

        props.setAnticounterfeitSmsAuthentication(
          objCountryData.smsauthentication
        );

        props.setAnticounterfeitDigitalScan(objCountryData.digitalscan);

        props.setAnticounterfeitSmartLabel(objCountryData.smartlabel);
      })
      .catch((error: any) => {
        console.log(error, "error");
      });

    if (newCountry === true) {
      props.addLocationInputList([
        { locationhierlevel: 0, locationhiername: "", parentlocation: -1 },
      ]);
      props.addRoleInputList([
        {
          rolehierarchylevel: 0,
          rolecode: "",
          rolehierarchyname: "",
          roletype: "",
          parentrole: "NONE",
        },
      ]);
      props.addTnTFlowInputList([{ level: 0, code: "", position: "" }]);
      props.addPackagingDefinitionInputList([
        {
          productcategory: "SEED",
          packaginghierarchylevel: 0,
          packaginghierarchyname: "",
          parentpackage: "",
        },
        {
          productcategory: "CP",
          packaginghierarchylevel: 0,
          packaginghierarchyname: "",
          parentpackage: "",
        },
      ]);
      props.addScanpointsAndAllocationInputList([
        {
          position: 0,
          scannedby: "",
          scantype: "",
          packaginglevel: "",
          pointallocated: false,
        },
      ]);

      props.setAnticounterfeitSmsAuthentication(false);
      props.setAnticounterfeitDigitalScan(false);
      props.setAnticounterfeitSmartLabel(false);
    }
  };

  // const getUnique = (arr: any, comp: any) => {
  //   //store the comparison  values in array
  //   const unique = arr
  //     .map((e: any) => e[comp])
  //     // store the indexes of the unique objects
  //     .map((e: any, i: any, final: any) => final.indexOf(e) === i && i)
  //     // eliminate the false indexes & return unique objects
  //     .filter((e: any) => arr[e])
  //     .map((e: any) => arr[e]);
  //   return unique;
  // };

  const _retriveCountryCode = (countryValue: any) => {
    const countryName: any = countryDetails.filter(function (result: any) {
      return result.name === countryValue;
    });

    const countryISO = countryName[0].isoCode;
    const currencyDesc = countryName[0].currencyDesc;
    setcurrencyDesc(currencyDesc);
    setCountryISO(countryISO);
    setcountryCurrency(countryName);
    setCountryCode(countryValue);
    setCountryName(countryISO);
    setCurrencyCode(countryName[0].currency);
    setCurrencyName(currencyDesc);
    getTemplateByCountry(countryISO);
  };

  const countryDetailsOption = handledropdownoption(countryDetails, "name");
  
  // console.log(countryDetailsOption);
  // countryDetails?.length > 0 &&
  // countryDetails.map((val: any) => {
  //   return { value: val.name, text: val.name };
  // });

  return (
    <div className="col-md-10">
      <div className="container">
        <div className="row effectiveDate fo  rm-group">
          <div className="col-sm-3">
            <div>
              <label className="font-weight-bold pt-4 label">Country</label>
            </div>
            <div>
              {/* <Select
                labelId="demo-mutiple-name-label"
                id="demo-mutiple-name"
                value={countryCode}
                onChange={(event) => handleDropdownChange(event)}
              >
                {countryDetails.map(({ name }) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select> */}

              <Dropdown
                name="country"
                label="Country"
                options={countryDetailsOption}
                handleChange={(event: any) => handleDropdownChange(event)}
                value={countryCode}
                isPlaceholder
              />
            </div>

            {/* <div>
              <select
                className="dpstyle selectoutline"
                id="dropdown"
                onChange={(event) => handleDropdownChange(event)}
                value={countryCode}
                // defaultValue={countryDetails[0].name}
              >
                {countryDetails.length > 0 ? (
                  countryDetails.map(({ name }) => (
                    <option value={name} key={name}>
                      {name}
                    </option>
                  ))
                ) : (
                  <option value="" key="">
                    No country found
                  </option>
                )}
              </select>
            </div> */}
          </div>
          <div className="col-sm-3">
            <div>
              <label className="font-weight-bold pt-4 label">
                Country Code
              </label>
            </div>
            <div>
              <input
                className="form-control dpstyle"
                type="text"
                name="Currency"
                value={countryISO}
                read-only
              />
            </div>
          </div>

          <div className="col-sm-3">
            <div>
              <label className="font-weight-bold pt-4 label">
                Currency Code
              </label>
            </div>
            <div>
              <input
                type="text"
                className="form-control dpstyle"
                name="Currency"
                value={countryCurrency.map(({ currency }) => currency)}
              />
            </div>
          </div>

          <div className="col-sm-3">
            <div>
              <label className="font-weight-bold pt-4 label">Currency</label>
            </div>
            <div>
              <input
                type="text"
                className="form-control dpstyle"
                name="Currency"
                value={currencyDesc}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CountrySetup = connect(
  mapStateToProps,
  mapDispatchToProps
)(CountrySetupComp);
