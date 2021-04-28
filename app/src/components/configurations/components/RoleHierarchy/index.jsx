import React from "react";

class RoleHierarchy extends React.Component {
  state = {
    rows: [{}],
    dpList: [{}],
    valSelected: ''
  };

  handleDropdownChange = (event) => {
    this.setState({ valSelected: event.target.value });
  }

  handleChange = idx => e => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];
    rows[idx] = {
      [name]: value
    };
    this.setState({
      rows
    });
  };

  handleAddRow = () => {
    const item = {
      rolelevel: "",
      roleccode: "",
      role: "",
      rolectype: "",
      parentrole: ""
    };

    this.setState({
      rows: [...this.state.rows, item],
      dpList: [...this.state.rows, item],
    });

    console.log(this.state.rows);
    console.log(this.state.dpList);
  };

  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.state.rows]
    rows.splice(idx, 1)
    this.setState({ rows })

    const dpList = [...this.state.dpList]
    dpList.splice(idx, 1)
    this.setState({ dpList })
  }

  render() {
    const dpstyle = { width: 185, height: 35 };
    const btncircle = { width: 40, height: 40, borderRadius: 20, marginTop: 10, marginLeft: 20 };

    const tableStyle = { border: "none", textAlign: "center", width: 185, height: 35 };
    const tableHeaderStyle = { border: "none", textAlign: "Left", width: 185 };
    const tablebtnStyle = { border: "none", width: 35, height: 35 };
    const tableScrollStyle = { maxHeight: "280px", overflowY: "auto", overflowX: "hidden" };
    const btnStyleAdd = {
      color: "white", background: "#89D329 0% 0% no-repeat padding-box",
      boxshadow: " 0px 3px 6px #00000029", opacity: 1,
      fontSize: "17px", fontweight: "bold", textalign: "center",
      width: 35, height: 35, borderRadius: 20, color: "white"
    }

    const btnStyleRemove = {
      color: "white", background: "#C1C1C1 0% 0% no-repeat padding-box",
      boxshadow: " 0px 3px 6px #00000029", opacity: 1,
      fontSize: "17px", fontweight: "bold", textalign: "center",
      width: 35, height: 35, borderRadius: 20, color: "white"
    }

    // const btnStyleAdd = {
    //   background: "#89D329 0% 0% no-repeat padding-box",
    //   boxshadow: " 0px 3px 6px #00000029",
    //   opacity: 1,
    //   width: "35px",
    //   height: "35px",
    //   borderradius: "50%",
    //   fontSize: "17px",
    //   fontweight: "bold",
    //   textalign: "center",
    //   color: "white"
    // };

    // const btnStyleRemove = {
    //   background: "#C1C1C1 0% 0% no-repeat padding-box",
    //   boxshadow: " 0px 3px 6px #00000029",
    //   opacity: 1,
    //   width: "35px",
    //   height: "35px",
    //   borderradius: "50%",
    //   fontSize: "17px",
    //   fontweight: "bold",
    //   textalign: "center",
    //   color: "white"
    // };

    return (
      <div className="col-md-10">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-12 column" style={tableScrollStyle}>
              <table className="table" id="tab_logic">
                <thead style={tableStyle} >
                  <tr>
                    <th style={tableStyle} className="text-center">Role Level</th>
                    <th style={tableHeaderStyle}>Role Code</th>
                    <th style={tableHeaderStyle}>Role</th>
                    <th style={tableHeaderStyle}>Role Type</th>
                    <th style={tableHeaderStyle}>Parent Role</th>
                    <th style={tablebtnStyle} />
                  </tr>
                </thead>
                <tbody>
                  {this.state.rows.map((item, idx) => (
                    <tr id="addr0" key={idx}>
                      <td style={tableStyle} >{idx}</td>
                      <td style={tableHeaderStyle}>
                        <input style={dpstyle}
                          type="text"
                          name="rolecode"
                          value={this.state.rows[idx].roleccode}
                          onChange={this.handleChange(idx)}
                          className="form-control"
                        />
                      </td>
                      <td style={tableHeaderStyle}>
                        <input style={dpstyle}
                          type="text"
                          name="role"
                          value={this.state.rows[idx].role}
                          className="form-control"
                        />
                      </td>
                      <td style={tableHeaderStyle}>
                        <select style={dpstyle} id="dropdown" onChange={(event) => this.handleDropdownChange(event)}>
                          <option value="Internal" key="Internal">Internal</option>
                          <option value="External" key="External">External</option>
                          {/* {idx > 0 && this.state.dpList.length > 0 && (
                          this.state.dpList.map(({ locationhierarchy }) => (
                            <option value={locationhierarchy} key={locationhierarchy}>
                              {locationhierarchy}
                            </option>
                          ))
                        )} */}
                        </select>
                      </td>
                      <td style={tableHeaderStyle}>
                        <select style={dpstyle} id="dropdown" value={this.state.valSelected} onChange={(event) => this.handleDropdownChange(event)}>
                          <option value="" key="">NA</option>
                          {idx > 0 && this.state.rows.length > 0 && (
                            this.state.rows.map(({ rolecode }) => (
                              <option value={rolecode} key={rolecode}>
                                {rolecode}
                              </option>
                            ))
                          )}
                        </select>
                      </td>
                      <td style={tablebtnStyle}>
                        {idx === this.state.rows.length - 1 ? (
                          <button className="btn" style={btnStyleAdd} onClick={this.handleAddRow}>+</button>
                        ) : (
                            <button className="btn" style={btnStyleRemove} onClick={this.handleRemoveSpecificRow(idx)}> - </button>
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
  }
}

export { RoleHierarchy };
