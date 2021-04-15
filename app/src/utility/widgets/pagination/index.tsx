import React , {Component, Fragment } from 'react';

import AUX from '../../../hoc/Aux_';
import '../../../assets/scss/pagination.scss';

type Props = {
    pageNo: number;
    totalData: number;
    rowsPerPage: number;
    previous: Function;
    next: Function;
    pageNumberClick: Function;
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
        const {pageNo, previous, next, pageNumberClick} = this.props;
        const pageNumbers = [];
        const pageData = Math.ceil(this.props.totalData / this.props.rowsPerPage);
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
        return(
            <div className="paginationNumber">
                <div>
                    <a href="#" className="" onClick={()=>previous(pageNo)} style={{ display: pageNo == 1 ? 'none' : 'block'}}>Prev</a>
                </div>
                {pageNumbers.length > 1 &&
                <div>
                    <a href="#" className={pageNo == 1 ? "active" : ''} onClick={()=>pageNumberClick(1)}>1</a>
                </div> }
                {this.state.startIndex != 1 ? 
                <div>
                    <i className="fa fa-fast-backward" onClick={()=>this.fastBackward()}></i>
                </div> : ''}
                <div>
                    {renderPageNumbers}
                </div>
                {(pageData != this.state.endIndex) && (pageData > 5) && 
                <div>
                    <i className="fa fa-fast-forward" onClick={()=>this.fastForward()}></i>
                </div> }
                {pageNumbers.length > 1 && <div>
                    <a href="#" className={pageNo == pageData ? "active" : ''} onClick={()=>pageNumberClick(pageData)}>{pageData}</a>
                </div> }
                <div>
                    <a href="#" onClick={()=>next(pageNo)} style={{ display: pageNo == pageData ? 'none' : 'block'}}>Next</a>
                </div>
            </div>
        );
    }
}

export { Pagination };