import React , {Component } from 'react';

import AUX from "../../hoc/Aux_";
import leftArrow from "../../assets/icons/left_arrow.svg";
import CustomCard from "../../container/components/card";
import "../../assets/scss/rsmDashboard.scss";

type Props={
    location?: any;
    history?: any;
}

type States={
    scanLogCount: number;
    usersCount: number;
    isLoader: boolean;
}

class Dashboard extends Component<Props, States>{
    constructor(props:any){
        super(props);
        this.state={
            scanLogCount : 0,
            usersCount : 0,
            isLoader: false
        }
    }
    componentDidMount() {
        this.getScanLogsCount();
        this.getUsersCount();
    }
    getScanLogsCount = () => {
        // const { scanLogCount } = apiURL;
        // this.setState({ isLoader: true });
        // invokeGetAuthService(scanLogCount).then((response) => {
        //   this.setState({
        //     scanLogCount: response,
        //   });
        // });
        this.setState({scanLogCount : 254});
    }
    getUsersCount = () => {
        // const { usersCount } = apiURL;
        // this.setState({ isLoader: true });
        // invokeGetAuthService(usersCount).then((response) => {
        //   this.setState({
        //     usersCount: response,
        //   });
        // });
        this.setState({usersCount : 32});
    }

    cardClick = () => {
        this.props.history.push('./scanlogs');
    }

render(){
    return(
            <AUX>
                <div style={{display: 'flex'}}>
                    <div style={{marginRight: '16px'}}>
                    <CustomCard icon={leftArrow} border='1px solid #FFA343' background='#FFF4E7' cardClick={this.cardClick}>
                        <div style={{fontSize : '24px'}}>{this.state.scanLogCount}</div>
                        <div style={{fontSize : '18px'}}>Scan Logs</div>
                    </CustomCard>
                    </div>
                    <div>
                    <CustomCard icon={leftArrow} border = '1px solid #206BDD' background='#DFE8FA'>
                        <div style={{fontSize : '24px'}}>{this.state.usersCount}</div>
                        <div style={{fontSize : '18px'}}>Total Users</div>
                    </CustomCard>
                    </div>
                </div>
            </AUX>
        );
    }
}

export  { Dashboard };   