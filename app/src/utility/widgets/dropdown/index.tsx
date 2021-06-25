import React from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  withTheme,
} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
// import '../../../assets/scss/variable.scss';

export interface DropdownProps {
  label?: string;
  control?: any;
  defaultValue?: any;
  options?: any;
  handleChange?: any;
  value: any;
  name: any;
  isPlaceholder?: boolean;
  isLabel?: boolean;
  isDisabled?: boolean;
  isNative?: boolean;
  width?: number;
}
export interface StyleProps {
  width?: number;
}
const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
  createStyles({
    root: {
      maxHeight: 100,
      "& .MuiOutlinedInput-root": {
        height: "40px",
        fontSize: "14px",
      },
      "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "#d6d6d6",
      },
      "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "#00bcff",
      },
      // "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      //   color: "purple"
      // },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "black",
      },
    },
    formControl: {
      margin: "0px !important",
      // margin: theme.spacing(1),
      minWidth: ({ width }) => (width ? width : 215),
      maxHeight: 100,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    menuPaper: {
      maxHeight: 150,
    },
  })
);

/**
 * @Dropdown
 *
 * Defines the Dropdown component. This component is reusable and can be custom
 * rendered with props.
 *
 * @example
 *  this.state = {selectedValue : ''}
 *
 *  handleChange = (event: any) => {
 *     this.setState({ selectedValue : event.target.value });
 *   };
 *   options = [
 *       { value: "father", text: "Father" },
 *       { value: "son", text: "Son" },
 *       { value: "mother", text: "Mother" },
 *  ];
 *   <Dropdown
 *   label="Age"
 *   options={this.options}
 *   handleChange={this.handleChange}
 *   value={this.state.selectedValue}
 *   isPlaceholder   // With placeholder
 *   isLabel         // with Label
 *   isDisabled      // for disable dropdwon
 *   />
 */

export const Dropdown = ({
  label,
  control,
  defaultValue,
  options,
  handleChange,
  value,
  name,
  isPlaceholder,
  isLabel,
  isDisabled,
  isNative,
  width,
  ...props
}: DropdownProps) => {
  const classes = useStyles({ width });
  const labelId = `${value}-label`;

  return (
    <div>
      <FormControl
        variant="outlined"
        className={`${classes.root} ${classes.formControl}`}
      >
        {isLabel && <InputLabel htmlFor={labelId}>{label}</InputLabel>}
        <Select
          name={name}
          labelId={labelId}
          value={value}
          onChange={handleChange}
          displayEmpty={isPlaceholder ? true : false}
          disabled={isDisabled ? true : false}
          native={isNative ? true : false}
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
          {isPlaceholder && !isNative ? (
            <MenuItem value="" disabled>
              {label}
            </MenuItem>
          ) : (
            <option value="" disabled>
              {label}
            </option>
          )}
          {options &&
            options.map((person: any) =>
              !isNative ? (
                <MenuItem key={person.value} value={person.value}>
                  {person.text}
                </MenuItem>
              ) : (
                <option key={person.value} value={person.value}>
                  {person.text}
                </option>
              )
            )}
        </Select>
      </FormControl>
    </div>
  );
};
export default withTheme(Dropdown);
