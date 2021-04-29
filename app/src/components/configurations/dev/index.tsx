import React, { useState } from "react";
import PencilEditImg from "../../../assets/images/pencil.svg";
import CheckBoxImg from "../../../assets/images/check-1.svg";
import UnCheckImg from "../../../assets/images/unchecked.svg";


const systemList = [
  {
    title: "Points Redemption",
    id: "1",
    baseUrl: "https://redemptionurl.com/api",
  },
  {
    title: "Advisor Order Management system",
    id: "2",
    baseUrl: "https://redemptionurl.com/api",
  },
  {
    title: "Location Details",
    id: "3",
    baseUrl: "https://redemptionurl.com/api",
  },
];
const tableData = [
  {
    name: "Get redeemp",
    url: "get/categologue",
    type: "GET",
    parmas: ["userId", "tokenId", "pageNo"],
    createdBy: "Jas don",
    lastModifedAt: "24/12/2021 16:43:20",
    lastMidifiedBy: "Arun",
    isActive: true,
  },
  {
    name: "User Points",
    url: "update/categologue",
    type: "UPDATE",
    parmas: ["userId", "tokenId", "pageNo"],
    createdBy: "Jas don",
    lastModifedAt: "24/12/2021 16:43:20",
    lastMidifiedBy: "Arun",
    isActive: true,
  },
  {
    name: "Get user history",
    url: "get/history",
    type: "GET",
    parmas: ["userId", "tokenId"],
    createdBy: "Jas don",
    lastModifedAt: "24/12/2021 16:43:20",
    lastMidifiedBy: "Arun",
    isActive: false,
  },
];
/**
 * Dev Configuration Functional Component
 * @param props
 * @returns
 */
const DevConfiguration: React.FC = (props) => {
  const [accordion, setAccordion] = useState(false);
  const [accordionId, setAccordionId] = useState("");

  const handleButton = (id: string) => {
    setAccordion(!accordion);
    setAccordionId(id);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setState({ ...state, [event.target.name]: event.target.checked });
  };
  return (
    <div className="dev-container card">
      <div className="dev-header">
        <div className="dev-header title">Integration Settings</div>
        <button>
          <i className="fa fa-plus" aria-hidden="true"></i> Add New System
        </button>
      </div>
      <div id="accordion">
        {systemList &&
          systemList.map((list, index) => {
            return (
              <div className="card dev" key={index}>
                <div
                  className="card-header"
                  id="headingOne"
                  onClick={() => handleButton(list.id)}
                >
                  <h5 className="mb-0">
                    <p className="title">{list.title}</p>
                  </h5>
                  <div className="base-url">
                    <span>Base URL</span> {list.baseUrl}
                  </div>
                  <div className="expand-icon">
                    <i
                      className={`fa ${
                        accordion ? "fas fa-caret-down" : "fas fa-caret-up"
                      } `}
                    ></i>
                  </div>
                </div>

                <div
                  id="collapseOne"
                  className={`collapse ${
                    accordion && list.id === accordionId && "show"
                  }`}
                  aria-labelledby="headingOne"
                  data-parent="#accordion"
                >
                  <div className="card-body">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Url</th>
                          <th>Type</th>
                          <th>Params</th>
                          <th>Created By</th>
                          <th>Last Modified date-time</th>
                          <th>Last Modified By</th>
                          <th>Is Active?</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((value, i) => {
                          return (
                            <tr>
                              <td>{value.name}</td>
                              <td>{value.url}</td>
                              <td>{value.type}</td>
                              <td>
                                <div className="total-parms">
                                  <div className="params">
                                    <label>Userid</label>
                                  </div>
                                  <div className="params">
                                    <label>employeeid</label>
                                  </div>
                                  <div className="params">
                                    <label>projectId</label>
                                  </div>
                                </div>

                                {value.parmas.values()}
                              </td>
                              <td>{value.createdBy}</td>
                              <td>{value.lastModifedAt}</td>
                              <td>{value.lastMidifiedBy}</td>
                              <td>
                                   {value.isActive?
                                   <img className="checkbox-tick-icon" src ={CheckBoxImg} /> :
                                   <img src={UnCheckImg} className="checkbox-tick-icon"/>
                                   }
                                  
                              </td>
                              <td>
                                <img
                                  className="pencilEditImg"
                                  src={PencilEditImg}
                                ></img>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

// export name of component
export default DevConfiguration;
