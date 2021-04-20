import React, { useEffect } from "react";
import PencilEditImg from "../../assets/images/pencil.svg";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Switch, { SwitchClassKey, SwitchProps } from "@material-ui/core/Switch";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import filterIcon from "../../assets/icons/filter_icon.svg";


interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

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

const header = {
  mobile: [
    { title: "Level 1", subTitle: "Dealer" },
    { title: "Level 2", subTitle: "Sub Dealer" },
    { title: "Field Sales", subTitle: "" },
    { title: "Field Sales Manager", subTitle: "" },
  ],
  web: [
    { title: "Field Sales", subTitle: "" },
    { title: "Field Sales Manager", subTitle: "" },
    { title: "Country-Admin", subTitle: "Dealer" },
    { title: "Country-Dev", subTitle: "Sub Dealer" },
  ],
};

const data = {
  mobile: [
    {
      label: "Dashboard Overview",
      isLevelOneToggle: true,
      isLevelTwoToggle: true,
      isFieldSalesToggle: true,
      isFieldSalesManagerToggle: true,
    },
    {
      label: "Dashboard Scan Button",
      isLevelOneToggle: true,
      isLevelTwoToggle: true,
      isFieldSalesToggle: true,
      isFieldSalesManagerToggle: true,
    },
    {
      label: "Redeem Points Button",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
    {
      label: "Recently/Most Sold Products",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
    {
      label: "Inventory Overview",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
    {
      label: "Inventory Details",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
    {
      label: "Scan History",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
    {
      label: "Points History",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
    {
      label: "Send Goods Plan",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
    {
      label: "Receive Goods Plan",
      isLevelOneToggle: false,
      isLevelTwoToggle: false,
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
    },
  ],
  web: [
    {
      label: "Notification",
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
      isCountryAdminToggle: false,
      isCountryDevToggle: false,
    },
    {
      label: "Scan Overview",
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
      isCountryAdminToggle: false,
      isCountryDevToggle: false,
    },
    {
      label: "Dashboard Overview",
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
      isCountryAdminToggle: false,
      isCountryDevToggle: false,
    },
    {
      label: "Targets Overview",
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
      isCountryAdminToggle: false,
      isCountryDevToggle: false,
    },
    {
      label: "Overall User Info",
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
      isCountryAdminToggle: false,
      isCountryDevToggle: false,
    },
    {
      label: "Sales by Region",
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
      isCountryAdminToggle: false,
      isCountryDevToggle: false,
    },
    {
      label: "Top Selling Customers/Products",
      isFieldSalesToggle: false,
      isFieldSalesManagerToggle: false,
      isCountryAdminToggle: false,
      isCountryDevToggle: false,
    },
  ],
};

const ConfigureFeature: React.FC = (props) => {
  const [activeButton, SetActiveButton] = React.useState("mobile"); // The useState hook
  const [rows, setRows] = React.useState(data);

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
    console.log("rows", rows);
    setRows({ ...rows });
  };
  const handleButton = (value: string) => {
    SetActiveButton(value);
    console.log("called");
  };
  useEffect(() => {
    console.log({ rows });
    //setRows(rows)
  });
  function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }
  return (
    <div>
      <div className="title mt-2">
        <div className="breadcrums sub-title">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link color="inherit" href="/" onClick={handleClick}>
        EMEA
        </Link>
        <Link color="inherit" href="/getting-started/installation/" onClick={handleClick}>
        Africa
        </Link>
        <Typography color="textPrimary">Malawi</Typography>
      </Breadcrumbs>
          {/* <p>{"EMEA >  Africa  >Malawi"}</p> */}
        </div>
        <div className="right-column">
          <i className="fa fa-search icon"></i>
          <input
            placeholder="Search Customer Name"
            className="input-field"
            type="text"
          />
           <img src={filterIcon} width="17" alt="filter" />
          <div
            className="btn-group mobile-web "
            role="group"
            aria-label="Basic outlined example"
          >
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => handleButton("mobile")}
            >
              Mobile
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
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

              {header[activeButton === "mobile" ? "mobile" : "web"].map(
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

export default ConfigureFeature;
