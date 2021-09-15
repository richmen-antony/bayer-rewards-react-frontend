import React, { Component } from 'react';
// import { CSVLink } from "react-csv";


class CSVDownload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    
    this.csvLinkEl = React.createRef();
    this.headers = props.headers;
    this.data = props.data;
    this.filename = props.filename;
    this.label = props.label;
    this.className = props.className;
  }

  downloadReport = async () => {
    const data = this.data;
    console.log(data);
    this.setState({ data: data }, () => {
      setTimeout(() => {
        this.csvLinkEl.current.link.click();
      });
    });
  }

  render() {
    const { data } = this.state;

    return (
      <div>
        <button className={this.className} value={this.label} onClick={this.downloadReport} >
          <i className="fa fa-download mr-2"></i> <span>{this.label}</span>
        </button>
        {/* <CSVLink
          headers={this.headers}
          filename={this.filename}
          data={this.data}
          ref={this.csvLinkEl}
        /> */}
      </div>
    );
  }
}

export default CSVDownload;