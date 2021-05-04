import React , {Component, Fragment } from 'react';

import AUX from '../../../hoc/Aux_';
import '../../../assets/scss/pagination.scss';
import { Input } from '../../../utility/widgets/input';

type Props = {
    pageNo: number;
    totalData: number;
    rowsPerPage: number;
    previous: Function;
    next: Function;
    pageNumberClick: Function;
    handlePaginationChange: Function;
}
type States = {
    startIndex: number,
    endIndex: number,
}

class Pagination extends Component<Props,States>{
    constructor(props:any){
        super(props);
        this.state = {
            startIndex: 1,
            endIndex: 5
        }
    }

    fastBackward = () => {
        this.setState({startIndex: this.state.startIndex - 3, endIndex: this.state.endIndex - 3})
    }
    fastForward = () => {
        this.setState({startIndex: this.state.startIndex + 3, endIndex: this.state.endIndex + 3})
    }

    render(){
        const {pageNo, previous, next, pageNumberClick,handlePaginationChange,rowsPerPage,totalData} = this.props;
        const pageNumbers = [];
        const pageData = Math.ceil(totalData / rowsPerPage);
        for (let i = 1; i <= pageData ; i++) {
            pageNumbers.push(i);
        }
        console.log('pageNumbers',pageNumbers);
        const renderPageNumbers = pageNumbers?.map((number,index) => {
            return (
                <>
                    { (index >= this.state.startIndex && index <= this.state.endIndex && index != pageData-1) 
                    &&
                        <span>
                            <a href="#" className={pageNo == number ? "active" : ''} onClick={()=>pageNumberClick(number)}>{number}</a>
                        </span>
                    }
                </>
            );
        });
        console.log('startIndex', this.state.startIndex)
        console.log('endIndex', this.state.endIndex)
        console.log('pageData', pageData)
        return(
            <div className='col-sm-12'>
                <div className='row'>
                    <div className='col-sm-6' style={{display: 'flex',justifyContent: 'flex-start', fontSize: '13px',alignItems: "center",padding: "0"}}>
                        <div className='col-sm-3 pl-0'>
                            Total Sales: {totalData}
                        </div>
                        <div className='col-sm-5'>
                            <div style={{display: 'flex',alignItems: "center"}}>
                                <span style={{marginRight: "10px"}}>Rows Per Page</span>
                                <span style={{width: '25%'}}><Input type="text" className="form-control" name="perpage" value={rowsPerPage} onChange={(e: any)=>handlePaginationChange(e)} /></span>
                            </div>
                        </div>
                        <div className='col-sm-4'>
                        <div style={{display: 'flex',alignItems: "center"}}>
                            <span style={{marginRight: "10px"}}>Go to Page</span>
                            <span style={{width: '25%'}}><Input type="text" className="form-control" name="gotopage" value={pageNo} onChange={(e: any)=>handlePaginationChange(e)} /></span>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6' style={{ display: 'flex',justifyContent: 'flex-end'}}>
                    <div className="paginationNumber">
                        <div>
                            <a href="#" className="" onClick={()=>previous(pageNo)} style={{ pointerEvents : pageNo == 1 ? 'none' : 'auto'}}>
                            <i className="fa fa-backward"></i>
                            </a>
                        </div>
            
                        {/* <div style={{ pointerEvents : this.state.startIndex != 1 ? 'auto' : 'none'}}>
                            <i className="fa fa-fast-backward" onClick={()=>this.fastBackward()}></i>
                        </div> */}
                        {pageNumbers.length > 1 &&
                        <div>
                            <a href="#" className={pageNo == 1 ? "active" : ''} onClick={()=>pageNumberClick(1)}>1</a>
                        </div> }
                        
                        {this.state.startIndex != 1 ? 
                        <div>
                            <i className="" onClick={()=>this.fastBackward()}>...</i>
                        </div> : ''}
                        <div>
                            {renderPageNumbers}
                        </div>
                        {(pageData != this.state.endIndex) && (pageData > 5) && 
                        <div>
                            <i className="" onClick={()=>this.fastForward()}>...</i>
                        </div> }
                        {pageNumbers.length > 1 && <div className={pageNo == pageData ? "active" : ''} onClick={()=>pageNumberClick(pageData)}>
                            {pageData}
                        </div> }
                        {/* <div style={{ pointerEvents : (pageData != this.state.endIndex) && (pageData > 5) ? 'auto' : 'none'}}>
                            <i className="fa fa-fast-forward" onClick={()=>this.fastForward()}></i>
                        </div> */}
                        <div>
                            <a href="#" onClick={()=>next(pageNo)} style={{ pointerEvents: pageNo == pageData ? 'none' : 'auto'}}>
                                <i className="fa fa-forward"></i>
                            </a>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { Pagination };