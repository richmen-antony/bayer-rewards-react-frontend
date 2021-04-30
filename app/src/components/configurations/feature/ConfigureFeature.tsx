import React, { useEffect } from "react";
import PencilEditImg from "../../../assets/images/pencil.svg";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Switch, { SwitchClassKey, SwitchProps } from "@material-ui/core/Switch";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import filterIcon from "../../../assets/icons/filter_icon.svg";
import {headerData,rowsData } from "./Feature";

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
  const [activeButton, SetActiveButton] = React.useState("mobile"); // The useState hook
  const [rows, setRows] = React.useState(rowsData);

/**
 * Function based on change toggle active or inactive
 * @param event 
 */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let key = event.target.value;
    const data = rows[activeButton === "mobile" ? "mobile" : "web"].map(
      (value: any) => {
        if (value.label === key) {
          return (value = {
            ...value,
            [event.target.name]: event.target.checked,
          });
        }
        return value;
      }
    );
    rows[activeButton === "mobile" ? "mobile" : "web"] = data;
    // update the state value
    setRows({ ...rows });
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
    console.info('You clicked a breadcrumb.');
  }
  return (
    <div>
      <div className="configure-title mt-2">
        <div className="breadcrums sub-title">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
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
              className={`btn btn-outline-primary ${activeButton==='mobile'? "active":""}`}
              onClick={() => handleButton("mobile")}
            >
              Mobile
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary ${activeButton==='web'? "active":""}`}
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
              <th>T&T Features</th>

              {headerData[activeButton === "mobile" ? "mobile" : "web"].map(
                (value, index) => {
                  return (
                    <th>
                      <div className="config-header">
                        <img src={PencilEditImg}></img>
                        <h3>{value.title}</h3>
                        <p>{value.subTitle}</p>
                      </div>
                    </th>
                  );
                }
              )}
            </tr>
          </thead>
          <tbody>
            {rows[activeButton === "mobile" ? "mobile" : "web"].map(
              (value: any, index: number) => {
                return (
                  <tr>
                    <td key={index}>
                      <p className="text"> {value.label}</p>
                    </td>
                    <td>
                      <IOSSwitch
                        checked={
                          activeButton === "mobile"
                            ? value.isLevelOneToggle
                            : value.isFieldSalesToggle
                        }
                        onChange={handleChange}
                        name={
                          activeButton === "mobile"
                            ? "isLevelOneToggle"
                            : "isFieldSalesToggle"
                        }
                        value={value.label}
                      />
                    </td>
                    <td>
                      <IOSSwitch
                        checked={
                          activeButton === "mobile"
                            ? value.isLevelTwoToggle
                            : value.isFieldSalesManagerToggle
                        }
                        onChange={handleChange}
                        name={
                          activeButton === "mobile"
                            ? "isLevelTwoToggle"
                            : "isFieldSalesManagerToggle"
                        }
                        value={value.label}
                      />
                    </td>
                    <td>
                      <IOSSwitch
                        checked={
                          activeButton === "mobile"
                            ? value.isFieldSalesToggle
                            : value.isCountryAdminToggle
                        }
                        onChange={handleChange}
                        name={
                          activeButton === "mobile"
                            ? "isFieldSalesToggle"
                            : "isCountryAdminToggle"
                        }
                        value={value.label}
                      />
                    </td>
                    <td>
                      <IOSSwitch
                        checked={
                          activeButton === "mobile"
                            ? value.isFieldSalesManagerToggle
                            : value.isCountryDevToggle
                        }
                        onChange={handleChange}
                        name={
                          activeButton === "mobile"
                            ? "isFieldSalesManagerToggle"
                            : "isCountryDevToggle"
                        }
                        value={value.label}
                      />
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
// export name of component 
export default ConfigureFeature;
