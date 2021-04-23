import React , {Component } from 'react';
import Dropdown from '../../../utility/widgets/dropdown';
import Stepper from "../../../container/components/stepper/Stepper";
// import { TabProvider, Tab, TabPanel, TabList } from 'react-web-tabs';
import { Input } from '../../../utility/widgets/input';
import '../../../assets/scss/users.scss';
import { toastSuccess } from '../../../utility/widgets/toaster';
import { setLocalStorageData } from '../../../utility/base/localStore';
import filterIcon from "../../assets/icons/filter_icon.svg";
import { StarRateTwoTone, TrainRounded, TramOutlined } from '@material-ui/icons';
import { convertCompilerOptionsFromJson } from 'typescript';

const options = [
    { value: "father", text: "Father" },
    { value: "son", text: "Son" },
    { value: "spirit", text: "Holy Spirit" },
];
const stepsArray = [
    "Personal Information",
    "Geographical Mapping"
    // "With-Holding Tax"
];

const demo = [
    { value: '001', text: "village1" },
    { value: '002', text: "village2" },
    { value: "003", text: "village3" },
];

const getStoreData = {
    country: 'MAL',
    Language: 'EN-US'
}

class CreateUser extends Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            geographicFields : [],
            dynamicFields : [],
            countryList : [],
            hierarchyList : [],
            isRendered: false,

            selectedValue : '',
            currentStep: 1,
            isActive: false,
            fromDateErr: '',
            toDateErr: '',
            userTypeErr: '',
            userNameErr:'',
            accNameErr: '',
            ownerNameErr:'',
            phoneErr:'',
            emailErr:'',
            postalCodeErr: '',
            countryErr:'',
            stateErr: '',
            districtErr: '',
            subDistrictErr: '',
            villageErr: '',

            userData : {
                'fromDate' : new Date().toISOString().substr(0, 10),
                'toDate' : new Date().toISOString().substr(0, 10),
                'userType' : '',
                'userName' : '',
                'accName' : '',
                'ownerName' : '',
                'phone'  : '',
                'email' : '',
                'postalCode':'',
                'country': '',
                'state':'',
                'district':'',
                'subDistrict': '',
                'village':''
            },
            allUserDatas : [],
            geographicalLocation : ["country", "state", "district","subdistrict", "Village"],
            fileds: [
                'country',
                'state' 
        ],
            country : [
                { value: '001', text: "India" },
                { value: '002', text: "London" },
                { value: "003", text: "Australia" },
            ],
            state : [
                { value: '001', text: "Tamil Nadu" },
                { value: '002', text: "Kerala" },
                { value: "003", text: "Bangalore" },
            ],
            district : [
                { value: '001', text: "Vellore" },
                { value: '002', text: "Chengalpattu" },
                { value: "003", text: "kancheepuram" },
            ],
            subDistrict : [
                { value: '001', text: "thirupathur" },
                { value: '002', text: "bagalore" },
                { value: "003", text: "chennai" },
            ],
            village : [
                { value: '001', text: "village1" },
                { value: '002', text: "village2" },
                { value: "003", text: "village3" },
            ]
        }
    }

    componentDidMount() {
        ///API to get country and language settings
        
        this.getCountryList();
        this.getGeographicFields();
        this.getNextHierarchy(getStoreData.country, this.state.geographicFields[1]);
        setTimeout(() => {
            this.getDynamicOptionFields();
        },0);


    }

    getCountryList() {
         //service call
         let res = [{ value: 'IND', text: 'INDIA'}, { value: 'MAL', text: 'Malawi'}];
         this.setState({countryList: res});
    }
    getNextHierarchy(country: any, nextLevel: any) {
        //API to get state options for initial set since mal is default option in country
           const data = { 
                type: country,
                id: nextLevel
            }

        // let stateResponse = [{}];
        let nextHierarchyResponse = [{text: 'Tamilnadu', value: 'TAMIL'}, {text: 'Bangalore', value: 'BANG'}];
        this.setState({hierarchyList: nextHierarchyResponse});
   }
   getGeographicFields() {
        //service call to get dynamic fields
        // servicesVersion().then((res: any) => {
        //     let res = ['country', 'state', 'district', 'village'];
        // }).catch((err: any) => {
        // })

        let res = ['country', 'state', 'district', 'village'];
        setTimeout(() => {
            this.setState({ geographicFields : res});
        },0)
   }
    getDynamicOptionFields() {
         let setFormArray: any = [];
        this.state.geographicFields.map((list: any, i: number) => {
            setFormArray.push({
                name: list,
                placeHolder: true,
                value: list === 'country' ?  getStoreData.country : '',
                options: list === 'country' ?  this.state.countryList : (i==1) ?  this.state.hierarchyList : '',
                error: ''
            });
        })
        this.setState({dynamicFields: setFormArray});
   }
   getOptionLists = (type: any, value: any, index: any) => {
       let nextHierarchyName = this.state.dynamicFields[index+1]['name'];
       console.log('nextLevel', nextHierarchyName);
       //API to get options
       //params 
        // if ( index !==  this.state.dynamicFields.length-1) {
        //     const data = { 
        //         type: type,  // region, 
        //         id: value,
        //         nextHierarchy: nextHierarchyName
        //     }
        // }
        // let res = [{}];
        let stateResponse = [{text: 'Tamilnadu', value: 'TAMIL'}, {text: 'Bangalore', value: 'BANG'}];
        let districtResponse = [{text: 'vellore', value: 'VEL'}, { text: 'chennai', value: 'CHE'}];
        let villageResponse = [{text: 'demo', value: 'DEM'}, { text: 'demo1', value: 'DEM1'}];

        this.state.dynamicFields.map((list: any) => {
            if(list.name === nextHierarchyName){
                list.options = stateResponse; 
            }
            // } else if(list.name === 'district'){
            //     list.options = districtResponse; 
            // } else if ( list.name === 'village'){
            //     list.options = villageResponse; 
            // }
        })
    }

    handleOptionChange = () => {

    }

    handleClick(clickType: any) {
        let formValid=true, geographicFormValid=true;
        if (clickType === "personalNext"){
            formValid = this.checkValidation();
        } else if (clickType === "createUser") {
            // formValid = this.geographicValidation();
            geographicFormValid = this.geographicValidation();
            formValid = false;
        }
        // }else if (clickType === "createUser"){
        //     geographicFormValid = this.geographicValidation();
        //     formValid = false;
        // }
        const { currentStep } = this.state;
        let newStep = currentStep;
        if  (clickType == "personalNext" || clickType == "geographicNext") {
            newStep = newStep+1;
        } else {
            newStep = newStep-1;
        }
        alert(formValid);

        if (newStep > 0 && newStep <= stepsArray.length) {
            if ( formValid ) {
                this.setState({
                    currentStep: newStep
                });
            }
        }
        if (clickType === "createUser"){
            if (geographicFormValid) {
                this.setState({
                    allUserDatas: [...this.state.allUserDatas, this.state.userData]
                });
                // setLocalStorageData('userData', this.state.allUserDatas);
                toastSuccess('User Created Successfully');
                this.props.history.push('/userList');
            } else {
                alert('fail');
            }
        }
    }

    handlePersonalChange = (e: any) => {
        let val = this.state.userData;
        val[e.target.name] = e.target.value;
        let dateVal =this.dateValidation(e);
        if ( dateVal ) {
            this.setState({ userData : val});
        }
    }

    dateValidation = (e: any) => {
        let dateValid = true;
        let usersState = this.state.userData;
        if ( e.target.name === "fromDate" ){
            if (e.target.value < new Date().toISOString().substr(0, 10)) {
                this.setState({ fromDateErr : 'From Date should be greater than todays date' });
                dateValid = false;
            } 
            else if (e.target.value > usersState.toDate) {
                this.setState({ fromDateErr : 'From Date should be lesser than To date' });
                dateValid = false;
            } else if (e.target.value < usersState.toDate) {
                this.setState({ toDateErr : '', fromDateErr: '' });
            }
            else {
                this.setState({ fromDateErr : '' });
            }
        }
        if (e.target.name === "toDate") {
            if (e.target.value < new Date().toISOString().substr(0, 10)) {
                this.setState({ toDateErr : 'To Date should be greater than todays date' });
                dateValid = false;
            } 
            else if(e.target.value < usersState.fromDate) {
                this.setState({ toDateErr : 'To Date should be greater than From date' });
                dateValid = false;
            } else if (e.target.value > usersState.fromDate) {
                this.setState({ fromDateErr : '', toDateErr: '' });
            }
            else {
                this.setState({ toDateErr : '' });
            }
        }
        return dateValid;
    }

    checkValidation = () => {
        let formValid = true;
        let userData = this.state.userData;
        if (userData.userType === "" || userData.userType === null) {
            this.setState({ userTypeErr: 'Please enter the User type' });
            formValid = false;
        } else {
            this.setState({ userTypeErr : '' });
        }
        if (userData.userName === "" || userData.userName === null) {
            this.setState({ userNameErr: 'Please enter the user Name' });
            formValid = false;
        } else {
            this.setState({ userNameErr : '' });
        }
        if (userData.accName === "" || userData.accName === null) {
            this.setState({ accNameErr: 'Please enter the Account Name' });
            formValid = false;
        } else {
            this.setState({ accNameErr : '' });
        }
        if (userData.ownerName === "" || userData.ownerName === null) {
            this.setState({ ownerNameErr: 'Please enter the Owner name' });
            formValid = false;
        }  else {
            this.setState({ ownerNameErr : '' });
        }
        if (userData.phone === "" || userData.phone === null) {
            this.setState({ phoneErr: 'Please enter the phone' });
            formValid = false;
        } else {
            this.setState({ phoneErr : '' });
        }
        if (userData.email === "" || userData.lastName === null) {
            this.setState({ emailErr: 'Please enter the Email' });
            formValid = false;
        } else {
            this.setState({ emailErr : '' });
        }
        return formValid;
    }

    geographicValidation = () => {
        let geographicFormValid = true;
        let userData = this.state.userData;
        let errMsg ='';

        this.state.geographicalLocation.map((location: any) => {
            let locationLower = location.toLowerCase();
            let userDatas = userData+'.'+locationLower;
            errMsg = locationLower+'Err';
            alert(userDatas);
            if ( userDatas === '' || userDatas === null){
                alert('hi');
                this.setState({ errMsg : 'Please enter the'+ locationLower });
                geographicFormValid = false;
            } else {
                this.setState({ errMsg : '' });
            }
        })

        // if (userData.country === "" || userData.country === null) {
        //     this.setState({ countryErr : 'Please enter the Country' });
        //     geographicFormValid = false;
        // } else {
        //     this.setState({ countryErr : '' });
        // }
        // if (userData.state === "" || userData.state === null) {
        //     this.setState({ stateErr : 'Please enter the State' });
        //     geographicFormValid = false;
        // } else {
        //     this.setState({ stateErr : '' });
        // }
        // if (userData.district === "" || userData.district === null) {
        //     this.setState({ districtErr : 'Please enter the District' });
        //     geographicFormValid = false;
        // } else {
        //     this.setState({ districtErr : '' });
        // }
        // if (userData.subDistrict === "" || userData.subDistrict === null) {
        //     this.setState({ subDistrictErr : 'Please enter the Sub District' });
        //     geographicFormValid = false;
        // } else {
        //     this.setState({ subDistrictErr : '' });
        // }
        // if (userData.village === "" || userData.village === null) {
        //     this.setState({ villageErr : 'Please enter the village' });
        //     geographicFormValid = false;
        // } else {
        //     this.setState({ villageErr : '' });
        // }
        return geographicFormValid;
    }

    reset =() => {
        this.setState({ 
            userData : {
                fromDate: '',
                toDate: '',
                userName: '',
                accName: '',
                userType:'',
                ownerName:'',
                email:'',
                phone:''
            }
        });
    }

    testingChange = (e: any,data: any) => {
        data.value = e.target.value;
    }

    render(){
        const { currentStep,userData, fromDateErr, toDateErr, userNameErr,accNameErr, userTypeErr,ownerNameErr,phoneErr,emailErr,countryErr,stateErr,districtErr,subDistrictErr,villageErr,geographicalLocation, country,state,district,subdistrict,village} = this.state;

        const locationList = geographicalLocation?.map((location: any, index:number) => {
            let locationLower = location.toLowerCase();
            let value = userData+'.'+locationLower;
            return (
                <>
                    {(index != 0) &&
                        <div className={index === 0 ? 'col-sm-12' : 'col-sm-3'}>
                        <Dropdown
                        name={locationLower}
                        label={locationLower}  
                        options={state}
                        handleChange={this.handlePersonalChange}
                        value={value}
                        isPlaceholder />
                        {locationLower+'Err' && <span className="error">{ locationLower+'Err' } </span>}
                    </div>
                    }
                </>
            );
        });

        let nextButton;
        if ( currentStep === 1) {
            nextButton = <button className='btn buttonColor createBtn' onClick={()=>this.handleClick('personalNext')}>Next</button>
        } else if (currentStep === 2) {
            nextButton = <button className='btn buttonColor createBtn' onClick={()=>this.handleClick('createUser')}>Create User</button>
        }
        // } else {
        //     nextButton = <button className='btn buttonColor createBtn' onClick={()=>this.handleClick('createUser')}>Create User</button>
        // }
      
        return(
            <div>
                <div className="stepper-container-horizontal">
                    <Stepper
                        direction="horizontal"
                        currentStepNumber={currentStep - 1}
                        steps={stepsArray}
                        stepColor="#555555"
                    />
                </div>
                <>
                
                <div className='row'>
                   { this.state.dynamicFields.map((list: any, index: number) =>
                    <>
                        <div className={index === 0 ? 'col-sm-12' : 'col-sm-3'}>

                            <Dropdown
                            name={list.name}
                            options={list.options}
                            handleChange={(list: any) => {
                                list.value = list.value;
                                this.setState({isRendered : true});
                                this.getOptionLists(list.name, list.value, index);
                            }}
                            value={list.value}
                            isPlaceholder />
                            { list.error && <span className="error">{list.error}</span> }
                        </div>
                    </>
                    )}
                </div>
                
                </>
                <div className="col-md-10">
                    <label className="font-weight-bold pt-4">{stepsArray[currentStep-1]}</label>
                    <div className="container">
                    {currentStep == 1 ? (
                        <>
                        <div className="row effectiveDate form-group">
                                <div className="col-sm-3">
                                    <label className="font-weight-bold pt-4">Effective From</label>
                                    <input type="date" name="fromDate" className="form-control" onChange={(e)=>this.handlePersonalChange(e)} value={userData.fromDate} />
                                    {fromDateErr && <span className="error">{ fromDateErr } </span>}
                                </div>
                                <div className="col-sm-3">
                                    <label className="font-weight-bold pt-4">Effective To</label>
                                    <input type="date" name="toDate" className="form-control" onChange={(e)=>this.handlePersonalChange(e)}  value={userData.toDate} />
                                    {toDateErr && <span className="error">{ toDateErr } </span>}
                                </div>
                        </div>
                       
                        <div className="personal">
                            <div className="row age form-group">
                                <div className="col-sm-3">
                                    <Dropdown
                                    name="userType" 
                                    label="User Type"
                                    options={options}
                                    handleChange={this.handlePersonalChange}
                                    value={userData.userType}
                                    isPlaceholder />
                                    {userTypeErr && <span className="error">{ userTypeErr } </span>}
                                </div>
                                <div className="col-sm-3">
                                    <Input type="text" className="form-control" name="userName" placeHolder="User Name" value={userData.userName} onChange={(e: any)=>this.handlePersonalChange(e)} />
                                    {userNameErr && <span className="error">{ userNameErr } </span>}
                                </div>
                                <div className="col-sm-3">
                                    <Input type="text" className="form-control" name="accName" placeHolder="Account name" value={userData.accName} onChange={(e: any)=>this.handlePersonalChange(e)} />
                                    {accNameErr && <span className="error">{ accNameErr } </span>}
                                </div>
                            </div>
                            <div className="row age form-group">
                                <div className="col-sm-3">
                                    <Input type="text" className="form-control" name="ownerName" placeHolder="Owner Name" value={userData.ownerName} onChange={this.handlePersonalChange} />
                                    {ownerNameErr && <span className="error">{ ownerNameErr } </span>}
                                </div>
                                <div className="col-sm-3">
                                    <Input type="number" className="form-control" name="phone" placeHolder="Mobile Number" value={userData.phone} onChange={(e: any)=>this.handlePersonalChange(e)} />
                                    {phoneErr && <span className="error">{ phoneErr } </span>}
                                </div>
                                <div className="col-sm-3">
                                    <Input type="text" className="form-control" name="email" placeHolder="EMail" value={userData.email} onChange={(e: any)=>this.handlePersonalChange(e)} />
                                    {emailErr && <span className="error">{ emailErr } </span>}
                                </div>
                            </div>
                        </div>
                        </>) : (
                        <div className="geographical">
                            <div className="row age" style={{marginBottom: '14px'}}>
                                {geographicalLocation.length > 0 &&
                                <div className="col-sm-3">
                                    <Dropdown
                                        name={geographicalLocation[0]}  
                                        label={geographicalLocation[0]}
                                        options={country}
                                        handleChange={this.handlePersonalChange}
                                        value={userData.country}
                                        isPlaceholder />
                                        {geographicalLocation[0]+'Err' && <span className="error">{ geographicalLocation[0]+'Err' } </span>}
                                </div> }
                                <div className="col-sm-3">
                                    <Input type="number" className="form-control" name="postalCode" placeHolder="Postal Code" value={userData.postalCode} onChange={(e: any)=>this.handlePersonalChange(e)} />
                                    {/* {postalCodeErr && <span className="error">{ postalCodeErr } </span>} */}
                                </div>
                            </div>
                            {geographicalLocation.length > 1 &&
                                <div className="row age">
                                    {locationList}
                                </div> 
                            }
                            {/* <div className="row age" style={{marginBottom: '14px'}}>
                               <textarea rows:number='5' cols:number='20' />
                            </div> */}
                        </div>)}
                    </div>
                    <div className="submit">
                        <div className="">
                            {this.state.currentStep == 1 && <button className="btn btn-outline-secondary buttonStyle" onClick={()=>this.reset()}> Cancel</button>}
                            {(this.state.currentStep !==1 ) &&
                            <button className="btn btn-outline-secondary buttonStyle" onClick={() => this.handleClick('back')}>Back</button>}
                        </div>
                        <div className="">
                            {nextButton}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { CreateUser };