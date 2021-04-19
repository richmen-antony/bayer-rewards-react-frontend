import React from "react";
import PencilEditImg from "../../assets/images/pencil.svg";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import { purple } from "@material-ui/core/colors";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch, { SwitchClassKey, SwitchProps } from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}

const PurpleSwitch = withStyles({
  switchBase: {
    color: purple[300],
    "&$checked": {
      color: purple[500],
    },
    "&$checked + $track": {
      backgroundColor: purple[500],
    },
  },
  checked: {},
  track: {},
})(Switch);

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

const AntSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: "flex",
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      "&$checked": {
        transform: "translateX(12px)",
        color: theme.palette.common.white,
        "& + $track": {
          opacity: 1,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: "none",
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  })
)(Switch);

const ConfigureFeature: React.FC = (props) => {
  // const [count, setCount] = React.useState(0) // The useState hook
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    checkedC: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  return (
    <div>
      <div className="title mt-2">
      
          <div className="breadcrums sub-title">
            <p>{"EMEA >  Africa  >Malawi"}</p>
          </div>
          <div className="right-column">
            <i className="fa fa-search icon"></i>
            <input
              placeholder="Search Customer Name"
              className="input-field"
              type="text"
              // onChange='{this.handleSearch}'
            />
            <div
              className="btn-group mobile-web "
              role="group"
              aria-label="Basic outlined example"
            >
              <button type="button" className="btn btn-outline-primary">
                Mobile
              </button>
              <button type="button" className="btn btn-outline-primary">
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
              <th>
                <div className="config-header">
                  <img src={PencilEditImg}></img>
                  <h3>Level One</h3>
                  <p>Dealer</p>
                </div>
              </th>
              <th>
                <div className="config-header">
                  <img src={PencilEditImg}></img>
                  <h3>Level Two</h3>
                  <p>Sub Dealer</p>
                </div>
              </th>
              <th>
                <div className="config-header">
                  <img src={PencilEditImg}></img>
                  <h3>Field sales</h3>
                </div>
              </th>
              <th>
                <div className="config-header">
                  <img src={PencilEditImg}></img>
                  <h3>Field Sales Manager</h3>
                  <p>Dealer</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p  className="text">Dashboard Overview</p></td>
              <td>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        checked={state.checkedB}
                        onChange={handleChange}
                        name="checkedB"
                      />
                    }
                    label="iOS style"
                  />
                </FormGroup>
              </td>
              <td>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        checked={state.checkedB}
                        onChange={handleChange}
                        name="checkedB"
                      />
                    }
                    label="iOS style"
                  />
                </FormGroup>
              </td>
              <td>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        checked={state.checkedB}
                        onChange={handleChange}
                        name="checkedB"
                      />
                    }
                    label="iOS style"
                  />
                </FormGroup>
              </td>
              <td>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        checked={state.checkedB}
                        onChange={handleChange}
                        name="checkedB"
                      />
                    }
                    label="iOS style"
                  />
                </FormGroup>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfigureFeature;
