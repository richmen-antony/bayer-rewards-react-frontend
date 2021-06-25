import React, { Component } from "react";
import AUX from "../../../hoc/Aux_";
import rewardsLogo from "../../../assets/icons/logo.svg";
import { apiURL } from "../../../utility/base/utils/config";
import { invokePostServiceLogin } from "../../../utility/base/service";
import Loaders from "../../../utility/widgets/loader";
import Cookies from "js-cookie";
import { CustomButton } from "../../../utility/widgets/button";
import "../../../assets/scss/login.scss";
import Authorization from "../../../utility/authorization";

type Props = {
  location?: any;
  history?: any;
};
type States = {
  username: any;
  password: any;
  usernameError: any;
  passwordError: any;
  isRemember: boolean;
  isPwdView: boolean;
  isLoader: boolean;
  validErrorMsg: any;
};

class Login extends Component<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
      password: "",
      usernameError: "",
      passwordError: "",
      isRemember: false,
      isPwdView: false,
      isLoader: false,
      validErrorMsg: "",
    };
  }

  handleChange = (e: any) => {
    if (e.target.name === "username") {
      if (e.target.value === "" || e.target.value === null) {
        this.setState({
          usernameError: "Please enter the username",
          username: e.target.value,
        });
      } else {
        this.setState({
          usernameError: "",
          username: e.target.value,
        });
      }
    } else if (e.target.name === "password") {
      if (e.target.value === "" || e.target.value === null) {
        this.setState({
          passwordError: "Please enter the password",
          password: e.target.value,
        });
      } else {
        this.setState({
          passwordError: "",
          password: e.target.value,
        });
      }
    }
  };
  login = () => {
    let formValid = this.checkValidation();
    const data = {
      username: this.state.username,
      password: this.state.password,
      region: "R1",
    };
    const { login } = apiURL;
    if (formValid) {
      this.setState({ isLoader: true });
      invokePostServiceLogin(login, data)
        .then((response: any) => {
          response.body.isRemember = this.state.isRemember;
          Authorization.login(response.body);
          Cookies.set("userData", JSON.stringify(response.body), {
            expires: 7,
          });
          const currentUser = response.body;
          if (currentUser.role === "DEVADMIN") {
            this.props.history.push("/devconfig");
          } else {
            this.props.history.push("/dashboard");
          }

          this.setState({ isLoader: false, validErrorMsg: "" });
        })
        .catch((error) => {
          this.setState({ isLoader: false, validErrorMsg: error.message });
          console.log(error, "error");
          // toastError(error.message);
        });
    }
  };
  checkValidation = () => {
    let formValid = true;
    if (this.state.username === "") {
      this.setState({
        usernameError: "Please enter the username",
      });
      formValid = false;
    }
    if (this.state.password === "") {
      this.setState({
        passwordError: "Please enter the password",
      });
      formValid = false;
    }
    return formValid;
  };

  handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      this.login();
    }
  };

  render() {
    const {
      username,
      password,
      usernameError,
      passwordError,
      isRemember,
      isPwdView,
      isLoader,
      validErrorMsg,
    } = this.state;
    return (
      <AUX>
        {isLoader && <Loaders />}
        <div className=" col-md-10 ~form">
          <div className="text-center">
            <img src={rewardsLogo} width="140" alt="Content2" />
          </div>
          <form className="form-horizontal">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className={
                  !usernameError
                    ? "form-control"
                    : "form-control invalid loginStyle"
                }
                name="username"
                placeholder="Enter username"
                value={username}
                onChange={this.handleChange}
                style={{ height: "40px" }}
              />
              {usernameError && <span className="error">{usernameError} </span>}
              {/* <Input type="text" className={!usernameError ? "form-control" : "form-control invalid loginStyle"} name="username" placeHolder="Enter username" value={username} onChange={this.handleChange} />
                                            {usernameError && <span className="error">{ usernameError } </span>} */}
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="withIcon">
                <input
                  type={isPwdView ? "text" : "password"}
                  onKeyPress={this.handleKeyPress}
                  className={
                    !passwordError ? "form-control" : "form-control invalid"
                  }
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={this.handleChange}
                  style={{ height: "40px" }}
                  maxLength={40}
                />
                {/* <Input type={isPwdView ? "text" : "password"} className={!passwordError ? "form-control" : "form-control invalid"} name="password" placeHolder="Enter password" value={password}
                                                    onChange={this.handleChange} /> */}
                <i
                  className={isPwdView ? "fa fa-eye-slash" : "fa fa-eye"}
                  onClick={() => {
                    this.setState({ isPwdView: !isPwdView });
                  }}
                ></i>
              </div>
              {passwordError && <span className="error">{passwordError} </span>}
            </div>
            <div className="form-group row m-t-20">
              <div className="col-sm-6">
                <label className="login-container">
                  Remember me
                  <input
                    type="checkbox"
                    defaultChecked={isRemember}
                    onClick={(e: any) => {
                      this.setState({ isRemember: e.target.checked });
                    }}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
              {/* <div className="form-group m-t-10 mb-0 row forgot">
                <div className="col-12">
                  <Link to="">Forgot password?</Link>
                </div>
              </div> */}
              <div className="col-sm-12 text-center">
                {validErrorMsg && (
                  <span className="error">{validErrorMsg} </span>
                )}
              </div>
            </div>
            <div className="form-group row loginBtnRow">
              <div className="col-sm-12 text-center">
                {/* <button
                  className="btn btn-secondary loginBtn form-control w-md waves-effect waves-light"
                  type="button"
                  onClick={this.login}
                >
                  Login
                </button> */}
                <CustomButton
                  label="Login"
                  style={{
                    borderRadius: "30px",
                    backgroundColor: "#10384F",
                    width: "100%",
                    padding: "7px",
                    border: "1px solid  #10384F",
                  }}
                  handleClick={(e: any) => {
                    e.preventDefault();
                    this.login();
                  }}
                ></CustomButton>
              </div>
            </div>
          </form>
        </div>
      </AUX>
    );
  }
}

export { Login };
