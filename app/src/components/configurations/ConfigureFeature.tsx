import React from "react";

const ConfigureFeature: React.FC = (props) => {
  // const [count, setCount] = React.useState(0) // The useState hook
  return (
    <div className="configure-feature">
      <div className="title mt-2">
        <div className="row align-items-center">
          <div className="col-sm-6 sub-title">
            <p>{"EMEA >  Africa  >Malawi"}</p>
          </div>
          <div className="col-sm-6">
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
      </div>

      <div className="card-body configure">
          <div className="col">

          </div>
   
  </div>
          
     
    </div>
  );
};

export default ConfigureFeature;
