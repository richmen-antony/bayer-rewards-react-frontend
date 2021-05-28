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
import { invokeGetAuthServiceTemp } from "../../../utility/base/service";
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

type State = {
  foo: number;
  bar: string;
  baz: number;
};

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
    if (countryCode) {
      _retriveCountryCode(countryCode);
    }
    return () => {
      setCountryDetails(countryDetails);
    };
  }, []);

  const handleDropdownChangeCurrency = (event: any) => {
    const countryName: any = countryDetails.filter(function (result: any) {
      return result.name === event.target.value;
    });
    const currencyDesc = countryName[0].currencyDesc;
    setcurrencyDesc(currencyDesc);
  };

  const handleDropdownChange = (event: any) => {
    setCountryCode(event.target.value);

    _retriveCountryCode(event.target.value);

    getTemplateByCountry();
  };

  const getTemplateByCountry = () => {
    const { getTemplateData } = apiURL;
    const { devconfig } = props;
    let data = {
      countryCode: props.countryName,
    };

    invokeGetAuthServiceTemp(getTemplateData, data)
      .then((response: any) => {
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
  };

  const getUnique = (arr: any, comp: any) => {
    //store the comparison  values in array
    const unique = arr
      .map((e: any) => e[comp])
      // store the indexes of the unique objects
      .map((e: any, i: any, final: any) => final.indexOf(e) === i && i)
      // eliminate the false indexes & return unique objects
      .filter((e: any) => arr[e])
      .map((e: any) => arr[e]);
    return unique;
  };

  const _retriveCountryCode = (countryValue: any) => {
    const countryName: any = countryDetails.filter(function (result: any) {
      return result.name === countryValue;
    });

    const countryISO = countryName[0].isoCode;
    const currencyDesc = countryName[0].currencyDesc;
    setcurrencyDesc(currencyDesc);
    setCountryISO(countryISO);
    setcountryCurrency(countryName);

    setCountryName(countryISO);
    setCurrencyCode(countryName[0].currency);
    setCurrencyName(currencyDesc);
  };

  return (
    <div className="col-md-10">
      <div className="container">
        <div className="row effectiveDate fo  rm-group">
          <div className="col-sm-3">
            <div>
              <label className="font-weight-bold pt-4">Country</label>
            </div>
            <div>
              <select
                className="dpstyle selectoutline"
                id="dropdown"
                onChange={(event) => handleDropdownChange(event)}
                value={countryCode}
                defaultValue={countryCode}
              >
                {countryDetails.length > 0 ? (
                  countryDetails.map(({ name }) => (
                    <option value={name} key={name}>
                      {name}
                    </option>
                  ))
                ) : (
                  // countryDetails.length > 0 ? (
                  //   countryDetails.map(({ name }) => (
                  //     <option value={name} key={name}>
                  //       {name}
                  //     </option>
                  //   ))
                  <option value="" key="">
                    No country found
                  </option>
                )}
              </select>
            </div>
          </div>
          <div className="col-sm-3">
            <div>
              <label className="font-weight-bold pt-4">Country Code</label>
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
              <label className="font-weight-bold pt-4">Currency Code</label>
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
              <label className="font-weight-bold pt-4">Currency</label>
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
