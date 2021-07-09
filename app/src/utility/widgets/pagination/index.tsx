import React, { Component } from "react";
import "../../../assets/scss/pagination.scss";
import Dropdown from "../dropdown";
import {Alert} from "../toaster";
import {withStyles,Theme ,WithStyles } from '@material-ui/core/styles';
import PaginationMUI from '@material-ui/lab/Pagination';

const useStyles = (theme: Theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
    '& .Mui-selected': {
      background: "transparent linear-gradient(90deg, #03BCFB 0%, #025E7E 100%) 0% 0% no-repeat padding-box",
      color:'#FFFFFF',
     },
     '& button':{
      "[aria-label=Go to previous page]": {
        background:" #FFFFFF 0% 0% no-repeat padding-box !important",
        boxShadow: "0px 3px 6px #00000029",
        border:" 0.5px solid #BFBFBF",
        borderRadius: "5px",
      },
     }
      
    
    
  },
});



type States = {
  startIndex: number;
  endIndex: number;
};

const rowPerPageOptions = [
  { value: "5", text: "5" },
  { value: "10", text: "10" },
  { value: "20", text: "20" },
  { value: "50", text: "50" }
 
];
interface Props extends WithStyles<typeof useStyles> {
  pageNo: number;
  totalData: any;
  rowsPerPage: number;
  previous: Function;
  next: Function;
  pageNumberClick: Function;
  handlePaginationChange: Function;
  data: any;
  totalLabel?: any;
}
class Pagination extends Component<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = {
      startIndex: 1,
      endIndex: 5,
    };
  }

  fastBackward = () => {
    this.setState({
      startIndex: this.state.startIndex - 3,
      endIndex: this.state.endIndex - 3,
    });
  };
  fastForward = () => {
    this.setState({
      startIndex: this.state.startIndex + 3,
      endIndex: this.state.endIndex + 3,
    });
  };
  handleGoToPage=()=>{
    !this.props.pageNo&& Alert("error","Go to Page should be greater than 0")

  }
 
  render() {
    const {
      pageNo,
      pageNumberClick,
      handlePaginationChange,
      rowsPerPage,
      totalData,
      data,
      totalLabel,
      classes,
    } = this.props;
    const pageNumbers = [];
    const pageData = Math.ceil(totalData / rowsPerPage);
    for (let i = 1; i <= pageData; i++) {
      pageNumbers.push(i);
    }
    // const renderPageNumbers = pageNumbers?.map((number, index) => {
    //   return (
    //     <>
    //       {index >= this.state.startIndex &&
    //         index <= this.state.endIndex &&
    //         index != pageData - 1 && (
    //           <span>
    //             <a
    //               href="#"
    //               className={pageNo == number ? "active" : ""}
    //               onClick={() => pageNumberClick(number)}
    //             >
    //               {number}
    //             </a>
    //           </span>
    //         )}
    //     </>
    //   );
    // });
    return (
      <>
        {data.length > 0 && (
          <div className="col-sm-12">
            <div className="row">
              <div
                className="col-sm-6"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  fontSize: "13px",
                  alignItems: "center",
                  padding: "0",
                }}
              >
                <div className="col-sm-3 pl-0">
                  Total {totalLabel || "Users"}: {totalData || 0}
                </div>

                <div className="col-sm-5">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "10px" }}>Rows Per Page</span>
                    <span style={{ width: "25%" }}>
                      {/* <input
                        style={{ width: "100%" }}
                        type="text"
                        className="form-control"
                        name="perpage"
                        value={rowsPerPage}
                        onChange={(e: any) => handlePaginationChange(e)}
                      /> */}
                      <Dropdown
                        name="perpage"
                        options={rowPerPageOptions}
                        handleChange={(event: any) =>
                          handlePaginationChange(event)
                        }
                        value={rowsPerPage}
                        isPlaceholder
                        width={50}
                        isDisabled={!pageNo}
                      />
                    </span>
                  </div>
                </div>

                <div className="col-sm-4">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "10px" }}>Go to Page</span>
                    <span style={{ width: "25%" }}>
                      <input
                        style={{ width: "100%" }}
                        type="text"
                        className="form-control"
                        name="gotopage"
                        value={pageNo}
                        onChange={(e: any) => handlePaginationChange(e)}
                        onBlur={this.handleGoToPage}
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="col-sm-6"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingRight: "0px",
                }}
              >
                <div className="paginationNumber">
                <PaginationMUI className={classes?.root}  count={pageData} shape="rounded" page={Number(pageNo)}  onChange={(event,val)=> pageNumberClick(val)}/>
                  {/* <div style={{ marginTop: "8px" }}>
                    <a
                      href="#"
                      className=""
                      onClick={() => previous(pageNo)}
                      style={{ pointerEvents: pageNo == 1 ? "none" : "auto" }}
                    >
                      <img
                        src={pageNo == 1 ? LeftArrowDisabled : LeftArrow}
                        alt={NoImage}
                      />
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      className={pageNo == 1 ? "active" : ""}
                      onClick={() => pageNumberClick(1)}
                    >
                      1
                    </a>
                  </div>

                  {this.state.startIndex != 1 ? (
                    <div>
                      <i className="" onClick={() => this.fastBackward()}>
                        ...
                      </i>
                    </div>
                  ) : (
                    ""
                  )}
                  <div>{renderPageNumbers}</div>
                  {pageData != this.state.endIndex + 1 && pageData > 5 && (
                    <div>
                      <i className="" onClick={() => this.fastForward()}>
                        ...
                      </i>
                    </div>
                  )}
                  {pageNumbers.length > 1 && (
                    <div>
                      <a
                        href="#"
                        className={pageNo == pageData ? "active" : ""}
                        onClick={() => pageNumberClick(pageData)}
                      >
                        {pageData}
                      </a>
                    </div>
                  )}
                  {/* <div style={{ pointerEvents : (pageData != this.state.endIndex) && (pageData > 5) ? 'auto' : 'none'}}>
                            <i className="fa fa-fast-forward" onClick={()=>this.fastForward()}></i>
                        </div> */}
                  {/* <div style={{ marginTop: "8px", marginRight: "-10px" }}>
                    <a
                      href="#"
                      onClick={() => next(pageNo)}
                      style={{
                        pointerEvents: pageNo == pageData ? "none" : "auto",
                      }}
                    >
                      <img
                        src={
                          pageNo == pageData ? RightArrowDisabled : RightArrow
                        }
                        alt={NoImage}
                      />
                    </a>
                  </div> */} 
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
export default withStyles(useStyles)(Pagination)

