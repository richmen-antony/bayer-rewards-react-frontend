import React , {Component } from 'react';
import AUX from '../../../hoc/Aux_';
import footerImg from '../../../assets/icons/blue_footer.svg';
import content1 from '../../../assets/icons/image_1.svg';
import content2 from '../../../assets/icons/image_2.svg';
import rewardsLogo from '../../../assets/icons/logo.svg';
import bayerLogo from '../../../assets/icons/bayer_logo.svg';
import { Link } from 'react-router-dom';
import '../../../assets/scss/landing.scss';
import { getLocalStorageData, clearLocalStorageData } from '../../../utility/base/localStore';
import {Login} from '../login';

import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption
  } from 'reactstrap';
  
  const items = [
    {
        id: 1,
        src: content1,
        content: "first"
        
    },
    {
        id: 2,
        src: content2,
        content: "second"

    }
  ];

class LandingPage extends Component<any,any>{
    constructor(props: any){
        super(props);
        this.state = {
            isLoggedOut: getLocalStorageData('isLoggedOut') ? true : false,
            animating: false,
            activeIndex: 0,
            isLogin: false
        }
    }
    componentDidMount(){
        if(getLocalStorageData('isLoggedOut')){
            setTimeout(() => {
                this.setState({isLoggedOut: false});
                clearLocalStorageData('isLoggedOut')
            },1800);
        }
    }


    next = () => {
        if (this.state.animating) return;
        const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({
            activeIndex: nextIndex
        });
    }
    
    previous = () => {
        if (this.state.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
        this.setState({
            activeIndex: nextIndex
        });
    }
    
    goToIndex = (newIndex: any) => {
        if (this.state.animating) return;
        this.setState({
            activeIndex: newIndex
        });
    }
    toLogin = () => {
        this.setState({isLogin: true});
    }

render(){
    console.log(this.props, 'this.props');
    const { activeIndex, isLogin } = this.state;
    
    return(
            <AUX>
                <div className="headerBG">
                    <div className="headerbg1">

                        <div className="row" >
                            <div className="col-8 col-sm-6 col-lg-8">
                                <img className="logoAuth" src={bayerLogo} alt="Logo" />
                            </div>
                            <div className="col-4 col-sm-6 col-lg-4 headerRight">

                                <h4 className="title">
                                    Contact us
                                    {/* <div className={ isLogin ? "activeLine" : ""} > </div> */}
                                </h4>
                                <h4 className="title" onClick={this.toLogin}>
                                    Sign in
                                    <div className={ isLogin ? "activeLine" : ""} > </div>
                                </h4>
                            </div>
                            
                        </div>
                    </div>
                    
                    
                    <div className="contentsec">
                        <div className="row ">
                            <div className="col-12  col-sm-8 col-md-6 col-lg-8 d-flex justify-content-center aligin-item-center content1Img">
                                <Carousel
                                        activeIndex={activeIndex}
                                        next={this.next}
                                        previous={this.previous}
                                        // keyboard={false}
                                        pause="hover"
                                        ride="carousel"
                                        direction="left"

                                    >
                                        <CarouselIndicators  items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                                        {
                                            items.map((item: any) => {
                                                return (
                                                <CarouselItem
                                                    // className="custom-tag"
                                                    // tag="div"
                                                    key={item.id}
                                                    onExiting={() => this.setState({animating: true})}
                                                    onExited={() => this.setState({animating: false})}
                                                >
                                                    <img className="content1Img" src={item.src} alt={item.content} />
                                                </CarouselItem>
                                                );
                                            })
                                        }
                                        <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                                        <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                                    </Carousel>
                            
                            
                            
                            </div>
                            <div className="col-12 col-md-6 col-lg-4 formRow">
                                { !isLogin ?
                                    <div className=" col-md-12 ~form pt-4 pb-2 pl-2 pr-4">
                                        <div className="text-center">
                                            <img src={rewardsLogo} width="140" alt="Content2" />
                                        </div>
                                        { this.state.isLoggedOut ? 
                                            <div className="mt-5 logoutContent">
                                                <h4>Thank you</h4>
                                                <h4>You've successfully logged out</h4>
                                            </div>
                                            :
                                            <>
                                                <div className="pt-4 pl-1 pb-4">
                                                    <h4>Welcome to Bayer Rewards</h4>
                                                    <p className="mt-3">
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.                                        </p>
                                                                                        
                                                </div>
                                                <div className="form-group row getStartedBtnRow" onClick={this.toLogin}>
                                                    <div className="col-sm-5 text-left">
                                                        <button className="btn btn-secondary getStartedBtn form-control w-md waves-effect waves-light" type="button">Get started</button>
                                                    </div>
                                                </div>
                                            </>
                                            
                                        }
                                        
                                    </div>
                                    :
                                    <Login {...this.props} />
                                }
                            </div>
                        
                        </div>
                           
                    </div>
                    <div className="row footerimg">
                        <div className="col-12">

                            <div className="">
                                <img src={footerImg} alt="Footer" />

                            </div>
                        </div>
                    </div>
                </div>
            </AUX>
        );
    }
}



export { LandingPage };