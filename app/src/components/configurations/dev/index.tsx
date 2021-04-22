import React, { useState } from "react";
import PencilEditImg from "../../../assets/images/pencil.svg";
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

  const handleButton = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    setAccordion(!accordion);
    setAccordionId(id);
  };
  return (
    <div className="dev-container">
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
              <div className="card" key={index}>
                <div className="card-header" id="headingOne">
                  <h5 className="mb-0">
                    <button
                      onClick={(e) => handleButton(e, list.id)}
                      className="btn btn-link"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      {list.title}
                    </button>
                  </h5>
                  <div className="base-url">
                    <span>Base Url:</span> {list.baseUrl}
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
                          <th>NAME</th>
                          <th>Url</th>
                          <th>Type</th>
                          <th>Params</th>
                          <th>Created By</th>
                          <th>Last Modified date-time</th>
                          <th>Last Modified By</th>
                          <th>Is Active</th>
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
                              <td>{value.parmas.values()}</td>
                              <td>{value.createdBy}</td>
                              <td>{value.lastModifedAt}</td>
                              <td>{value.lastMidifiedBy}</td>
                              <td>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="flexCheckChecked"
                                    checked={value.isActive}
                                  />
                                </div>
                              </td>
                              <td><img className="pencilEditImg" src={PencilEditImg}></img></td>
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
