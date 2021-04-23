import React , {Component } from 'react';

import AUX from "../../hoc/Aux_";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import leftArrow from "../../assets/icons/left_arrow.svg";
import "../../assets/scss/rsmDashboard.scss";

type Props={
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

    action = {
        fontSize: 14,
        marginTop: '95px',
        marginLeft: '16px'
    };
    iconStyle = {
        marginLeft: '173px',
        marginTop: '20px'
    };
    cardOutline1 = {
        width: '250px',
        height: '250px',
        borderRadius: '4px',
        border :  '1px solid #FFA343',
        backgroundColor: '#FFF4E7'
    }
    cardOutline2 = {
        width: '250px',
        height: '250px',
        borderRadius: '4px',
        border :  '1px solid #206BDD',
        backgroundColor: '#DFE8FA'
    }

render(){
    return(
            <AUX>
                <div style={{display: 'flex'}}>
                    {/* <Card icon={leftArrow} outlineColor='green'>
                        <div>{this.state.scanLogCount}</div>
                        <div>Scan Logs</div>
                    </Card> */}
                    <div style={{marginRight: '30px'}}>
                        <Card style={this.cardOutline1}>
                            <CardContent>
                                    <img style={this.iconStyle} src={leftArrow} width="30" alt=""/>

                            </CardContent>
                            <CardActions>
                            <div style={this.action}>
                                    <div style={{fontSize : '24px'}}>{this.state.scanLogCount}</div>
                                    <div style={{fontSize : '18px'}}>Scan Logs</div>
                                </div>
                            </CardActions>
                        </Card>
                    </div>
                    <div>
                    <Card style={this.cardOutline2}>
                        <CardContent>
                                <img style={this.iconStyle} src={leftArrow} width="30" alt=""/>
                        </CardContent>
                        <CardActions>
                            <div style={this.action}>
                                <div style={{fontSize : '24px'}}>{this.state.scanLogCount}</div>
                                <div style={{fontSize : '18px'}}>Total Users</div>
                            </div>
                        </CardActions>
                    </Card>
                    </div>
                </div>
            </AUX>
        );
    }
}

export  { Dashboard };   