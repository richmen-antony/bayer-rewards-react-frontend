import * as React from 'react';

class TnTFlow extends React.Component {
  state = {
    rows: [{}],
  };

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
      level: "",
      code: "",
      position: ""
    };

    this.setState({
      rows: [...this.state.rows, item],
    });
  };

  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.state.rows]
    rows.splice(idx, 1)
    this.setState({ rows })
  }

  render() {
    const tableStyle = {
      border: "none",
      textAlign: "center",
      width: 185,
      height: 35
    };

    const tableHeaderStyle = {
      border: "none",
      textAlign: "Left",
      width: 185
    };

    const tablebtnStyle = {
      border: "none",
      width: 35,
      height: 35
    };

    const dpstyle = {
      width: 185,
      height: 35
    };

    const btnStyleAdd = {
      color: "white", background: "#89D329 0% 0% no-repeat padding-box",
      boxshadow: " 0px 3px 6px #00000029", opacity: 1,
      fontSize: "17px", fontweight: "bold", textalign: "center",
      width: 35, height: 35, borderRadius: 20
    };

    const btnStyleRemove = {
      color: "white", background: "#C1C1C1 0% 0% no-repeat padding-box",
      boxshadow: " 0px 3px 6px #00000029", opacity: 1,
      fontSize: "17px", fontweight: "bold", textalign: "center",
      width: 35, height: 35, borderRadius: 20
    };


    const tableScrollStyle = {
      maxHeight: "280px",
      overflowY: "auto"
    }

    return (
      <div className="col-md-10" >
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-8  column" style={tableScrollStyle}>
              <table className="table" id="tab_logic">
                <thead style={tableStyle} >
                  <tr>
                    <th style={tableStyle} className="text-center">Level</th>
                    <th style={tableHeaderStyle}>Code</th>
                    <th style={tableHeaderStyle}>Position</th>
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
                          name="code"
                          value={this.state.rows[idx].code}
                          onChange={this.handleChange(idx)}
                          className="form-control"
                        />
                      </td>

                      <td style={tableHeaderStyle}>
                        <input style={dpstyle}
                          type="text"
                          name="position"
                          value={this.state.rows[idx].position}
                          onChange={this.handleChange(idx)}
                          className="form-control"
                        />
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
    )
  }
};

export { TnTFlow };
