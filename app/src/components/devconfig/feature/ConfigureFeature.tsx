import React, { useEffect, useState } from "react";
//import PencilEditImg from "../../../assets/images/pencil.svg";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Switch, { SwitchClassKey, SwitchProps } from "@material-ui/core/Switch";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
//import filterIcon from "../../../assets/icons/filter_icon.svg";
//import { headerData, rowsData } from "./Feature";
import {
  invokeGetAuthService,
  invokePutService,
} from "../../../utility/base/service";
import { apiURL } from "../../../utility/base/utils/config";
import { getLocalStorageData } from "../../../utility/base/localStore";
import Loader from "../../../utility/widgets/loader";
import ArrowIcon from "../../../assets/icons/tick.svg";
import reset from "../../../assets/icons/reset.svg";
import RouterPrompt from "../../../containers/prompt";

/**
 * Toggle styles
 */
interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}
// Toggle props
interface Props extends SwitchProps {
  classes: Styles;
}
const IOSSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      "&$checked": {
        transform: "translateX(16px)",
        color: theme.palette.common.white,
        "& + $track": {
          backgroundColor: "#52d869",
          opacity: 1,
          border: "none",
        },
      },
      "&$focusVisible $thumb": {
        color: "#52d869",
        border: "6px solid #fff",
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(["background-color", "border"]),
    },
    checked: {},
    focusVisible: {},
  })
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

/**
 * Configure Feature Functional Component
 * @param props
 * @returns
 */
const ConfigureFeature: React.FC = (props) => {
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [activeButton, SetActiveButton] = React.useState("web");
  const [tFeatures, setTFeatures] = useState<any>([]);
  const [webRoles, setWebRoles] = useState([]);
  const [mobileRoles, setMobileRoles] = useState<any>([]);
  const [webRoleFeatures, setWebRoleFeatures] = useState<any>([]);
  const [mobileRoleFeatures, setMobileRoleFeatures] = useState([]);
  const [updateToggleData, setUpdateToggleData] = useState<any>([]);
  const [showApplyButton, setShowApplyButton] = useState<boolean>(true);

  /*
   * Function based on change toggle active or inactive
   * @param event
   */

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = () => {
    const { featureToggle } = apiURL;
    let localObj: any = getLocalStorageData("userData");
    let userData = JSON.parse(localObj);
    let countrycode = {
      countrycode: userData?.countrycode,
    };

    setIsLoader(true);
    invokeGetAuthService(featureToggle, countrycode)
      .then((response) => {
        let tANDtFeatures =
          response?.body && Object.keys(response?.body?.features).length !== 0
            ? response?.body?.features
            : [];
        setTFeatures(tANDtFeatures);
        //web
        let webFeatures =
          response?.body && Object.keys(response?.body?.web).length !== 0
            ? response?.body?.web
            : [];

        let listOfWebHeaders: any = [];
        let ModifiedWebDatas: any = [];

        webFeatures.forEach((item: any) => {
          Object.entries(item).forEach((allWebEntries) => {
            listOfWebHeaders.push(allWebEntries[0]);
            let data = {
              role: allWebEntries[0],
              roleData: allWebEntries[1],
            };
            ModifiedWebDatas.push(data);
          });
        });
        setWebRoleFeatures(ModifiedWebDatas);
        setWebRoles(listOfWebHeaders);

        //mobile
        let mobileFeatures =
          response?.body && Object.keys(response?.body?.web).length !== 0
            ? response?.body?.mobile
            : [];

        let listOfMobileHeaders: any = [];
        let ModifiedMobileDatas: any = [];

        mobileFeatures.forEach((item: any) => {
          Object.entries(item).forEach((allMobileEntries) => {
            listOfMobileHeaders.push(allMobileEntries[0]);
            let data = {
              role: allMobileEntries[0],
              roleData: allMobileEntries[1],
            };
            ModifiedMobileDatas.push(data);
          });
        });
        setMobileRoleFeatures(ModifiedMobileDatas);
        setMobileRoles(listOfMobileHeaders);
        setIsLoader(false);
      })
      .catch((error) => {
        console.log("Error message", error.message);
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let roleName = event.target.name; // RSM,CSM
    let activeRole: any =
      activeButton === "mobile" ? mobileRoleFeatures : webRoleFeatures;
    let toggleButtonStateUpdates: any =
      activeButton === "mobile" ? setMobileRoleFeatures : setWebRoleFeatures;

    let data = activeRole.map((value: any) => {
      setShowApplyButton(false);

      if (value.role === event.target.name) {
        return (value = {
          ...value,
          role: roleName,
          roleData: {
            ...value.roleData,
            [event.target.value]: event.target.checked,
          },
        });
      }
      return value;
    });
    toggleButtonStateUpdates(data);
    UpdateData(event.target.name, event.target.value, event.target.checked);
  };

  const UpdateData = (role: any, selectedRole: any, selectedRoleValue: any) => {
    if (activeButton === "web") {
      let newData: any = {
        featurename: selectedRole,
        role: role,
        isfeatureactive: selectedRoleValue,
        isweb: true,
      };
      setUpdateToggleData([...updateToggleData, newData]);
    } else {
      let newData: any = {
        featurename: selectedRole,
        role: role,
        isfeatureactive: selectedRoleValue,
        ismobile: true,
      };
      setUpdateToggleData([...updateToggleData, newData]);
    }
  };

  const applyFeature = () => {
    setIsLoader(true);
    const { updateFeatureToggle } = apiURL;
    let obj: any = getLocalStorageData("userData");
    let userData = JSON.parse(obj);
    let APIdata = {
      countrycode: userData?.countrycode,
      loginuser: userData?.username,
      data: [...updateToggleData],
    };
    invokePutService(updateFeatureToggle, APIdata)
      .then((response) => {
        console.log("response", response);
        setIsLoader(false);
        setShowApplyButton(true);
      })
      .catch((error) => {
        console.log("Error message", error.message);
      });
  };

  const handleResetToggleValues = () => {
    setUpdateToggleData([]); // here we reset value
    setShowApplyButton(true);
    fetchTableData();
  };
  /**
   * Function to handle active button ,where based on mobile and web category
   * @param value
   */
  const handleButton = (value: string) => {
    // call the SetActiveButton and update the activeButton value
    SetActiveButton(value);
  };
  /**
   * Function handle breadcrumb selection
   * @param event
   */
  function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }

  let Role: any = activeButton === "mobile" ? mobileRoles : webRoles;
  let RoleFeatures: any =
    activeButton === "mobile" ? mobileRoleFeatures : webRoleFeatures;

  return (
    <div>
      {isLoader && <Loader />}
      <RouterPrompt
        when={!showApplyButton}
        title="Leave this page"
        cancelText="Cancel"
        okText="Confirm"
        onOK={() => true}
        onCancel={() => false}
      />
      <div className="configure-title mt-2">
        <div className="breadcrums sub-title">
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link color="inherit" href="/" onClick={handleClick}>
              EMEA
            </Link>
            <Link color="inherit" href="/" onClick={handleClick}>
              Africa
            </Link>
            <Typography color="textPrimary">Malawi</Typography>
          </Breadcrumbs>
          {/* <p>{"EMEA >  Africa  >Malawi"}</p> */}
        </div>
        <div className="right-column">
          {/* <div className="search-configure">
          <i className="fa fa-search icon"></i>
          <input
            placeholder="Search Customer Name"
            className="search-input-field"
            type="text"
          />
          </div> */}
          {/* <button>
           <img src={filterIcon} width="17" alt="filter" />
           </button> */}

          <div
            className="btn-group mobile-web "
            role="group"
            aria-label="Basic outlined example"
          >
            <button
              type="button"
              className={`btn btn-outline-primary ${
                activeButton === "mobile" ? "active" : ""
              }`}
              onClick={() => handleButton("mobile")}
            >
              Mobile
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary ${
                activeButton === "web" ? "active" : ""
              }`}
              onClick={() => handleButton("web")}
            >
              Web
            </button>
          </div>
        </div>
      </div>

      <div className="card-body configure">
        <table className="config-table">
          <thead>
            <tr>
              <th
                style={{
                  width: "250px",
                  fontSize: "20px",
                }}
              >
                T&T Features
              </th>
              {Role.map((val: any, index: any) => {
                return (
                  <th
                    style={{
                      fontSize: "20px",
                      width: "250px",
                      textAlign: "center",
                    }}
                    key={index}
                  >
                    {val}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {tFeatures.map((val: any, index: any) => {
              return (
                <tr key={index}>
                  <td>
                    <p className="text">
                      <strong>{val}</strong>
                    </p>
                  </td>
                  {RoleFeatures.map((key: any, ind: any) => (
                    <td key={ind}>
                      <IOSSwitch
                        checked={key.roleData[val] ? true : false}
                        onChange={handleChange}
                        disabled={
                          Object.keys(key.roleData).includes(val) ? false : true
                        }
                        name={key.role}
                        value={val ? val : ""}
                        id={key.role + "_" + val + "_" + index}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="bottom-div">
          <button
            type="button"
            className="btn btn-outline-secondary btn-lg reset-toggle"
            disabled={showApplyButton ? true : false}
            onClick={() => handleResetToggleValues()}
          >
            Reset
            <span style={{ marginLeft: "5px" }}>
              <img
                src={reset}
                alt="reset-icon"
                width="12"
                style={{ marginLeft: "5px" }}
              />
            </span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-lg apply-feature-toggle"
            style={{ marginLeft: "10px" }}
            disabled={showApplyButton ? true : false}
            onClick={() => applyFeature()}
          >
            Apply
            <span style={{ marginLeft: "5px" }}>
              <img
                src={ArrowIcon}
                className="arrow-i"
                alt="tick-icon"
                style={{ marginLeft: "5px" }}
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigureFeature;
