import React , {Component } from 'react';
import Dropdown from '../../../utility/widgets/dropdown';
import Stepper from "../../../container/components/stepper/Stepper";
// import { TabProvider, Tab, TabPanel, TabList } from 'react-web-tabs';
import { Input } from '../../../utility/widgets/input';
import '../../../assets/scss/users.scss';
import { toastSuccess } from '../../../utility/widgets/toaster';

const options = [
    { value: "father", text: "Father" },
    { value: "son", text: "Son" },
    { value: "spirit", text: "Holy Spirit" },
];
const stepsArray = [
    "Personal Information",
    "Geographical Mapping"
];
const countryList = [
    { value: '001', text: "India" },
    { value: '002', text: "London" },
    { value: "003", text: "Australia" },
];
const stateList = [
    { value: '001', text: "Tamil Nadu" },
    { value: '002', text: "Kerala" },
    { value: "003", text: "Bangalore" },
];
const districtList = [
    { value: '001', text: "Vellore" },
    { value: '002', text: "Chengalpattu" },
    { value: "003", text: "kancheepuram" },
];
const subDistrictList = [
    { value: '001', text: "aaa" },
    { value: '002', text: "bbb" },
    { value: "003", text: "ccc" },
];
const villageList = [
    { value: '001', text: "village1" },
    { value: '002', text: "village2" },
    { value: "003", text: "village3" },
];

class CreateUser extends Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            selectedValue : '',
            currentStep: 1,
            isActive: false,
            fromDateErr: '',
            toDateErr: '',
            userTypeErr: '',
            userIdErr:'',
            firstNameErr:'',
            lastNameErr:'',
            phoneErr:'',
            countryErr:'',
            stateErr: '',
            districtErr: '',
            subDistrictErr: '',
            villageErr: '',
            userData : {
                'fromDate' : new Date().toISOString().substr(0, 10),
                'toDate' : new Date().toISOString().substr(0, 10),
                'userType' : '',
                'userId' : '',
                'firstName' : '',
                'lastName' : '',
                'phone'  : '',
                'country': '',
                'state':'',
                'district':'',
                'subDistrict': '',
                'village':''
            },
            allUserDatas : []
        }
    }

    handleClick(clickType: any) {
        let formValid=true, geographicFormValid=true;
        if (clickType === "next"){
            formValid = this.checkValidation();
        } else if (clickType === "createUser"){
            geographicFormValid = this.geographicValidation();
            formValid = false;
        }
        const { currentStep } = this.state;
        let newStep = currentStep;
        clickType === "next" ? newStep++ : newStep--;

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
                toastSuccess('User Created Successfully');
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
        if (userData.userId === "" || userData.userId === null) {
            this.setState({ userIdErr: 'Please enter the user ID' });
            formValid = false;
        } else {
            this.setState({ userIdErr : '' });
        }
        if (userData.firstName === "" || userData.firstName === null) {
            this.setState({ firstNameErr: 'Please enter the first name' });
            formValid = false;
        }  else {
            this.setState({ firstNameErr : '' });
        }
        if (userData.lastName === "" || userData.lastName === null) {
            this.setState({ lastNameErr: 'Please enter the last name' });
            formValid = false;
        } else {
            this.setState({ lastNameErr : '' });
        }
        if (userData.phone === "" || userData.phone === null) {
            this.setState({ phoneErr: 'Please enter the phone' });
            formValid = false;
        } else {
            this.setState({ phoneErr : '' });
        }
        return formValid;
    }

    geographicValidation = () => {
        let geographicFormValid = true;
        let userData = this.state.userData;
        if (userData.country === "" || userData.country === null) {
            this.setState({ countryErr : 'Please enter the Country' });
            geographicFormValid = false;
        } else {
            this.setState({ countryErr : '' });
        }
        if (userData.state === "" || userData.state === null) {
            this.setState({ stateErr : 'Please enter the State' });
            geographicFormValid = false;
        } else {
            this.setState({ stateErr : '' });
        }
        if (userData.district === "" || userData.district === null) {
            this.setState({ districtErr : 'Please enter the District' });
            geographicFormValid = false;
        } else {
            this.setState({ districtErr : '' });
        }
        if (userData.subDistrict === "" || userData.subDistrict === null) {
            this.setState({ subDistrictErr : 'Please enter the Sub District' });
            geographicFormValid = false;
        } else {
            this.setState({ subDistrictErr : '' });
        }
        if (userData.village === "" || userData.village === null) {
            this.setState({ villageErr : 'Please enter the village' });
            geographicFormValid = false;
        } else {
            this.setState({ villageErr : '' });
        }
        return geographicFormValid;
    }

    reset =() => {
        this.setState({ 
            userData : {
                fromDate: '',
                toDate: '',
                userId: '',
                userType:'',
                firstName:'',
                lastName:'',
                phone:''
            }
        });
    }
 
    render(){
        const { currentStep,userData, fromDateErr, toDateErr, userIdErr,userTypeErr,firstNameErr,lastNameErr,phoneErr, countryErr,stateErr,districtErr,subDistrictErr,villageErr} = this.state;
        console.log('sttae', this.state);
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
                <div className="col-md-10">
                    <label className="font-weight-bold pt-4">{stepsArray[currentStep-1]}</label>
                    <div className="container">
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
                        {currentStep == 1 ? (
                        <div className="personal">
                            <div className="row age form-group">
                                <div className="col-sm-3">
                                    <Dropdown
                                    name="userType" 
                                    label="User Type"
                                    options={options}
                                    handleChange={this.handlePersonalChange}
                                    value={userData.userType} />
                                    {userTypeErr && <span className="error">{ userTypeErr } </span>}
                                </div>
                                <div className="col-sm-3">
                                    <Input type="text" className="form-control" name="userId" placeHolder="User Id" value={userData.userId} onChange={(e: any)=>this.handlePersonalChange(e)} />
                                    {userIdErr && <span className="error">{ userIdErr } </span>}
                                </div>
                            </div>
                            <div className="row age form-group">
                                <div className="col-sm-3">
                                    <Input type="text" className="form-control" name="firstName" placeHolder="First Name" value={userData.firstName} onChange={this.handlePersonalChange} />
                                    {firstNameErr && <span className="error">{ firstNameErr } </span>}
                                </div>
                                <div className="col-sm-3">
                                    <Input type="text" className="form-control" name="lastName" placeHolder="Last Name" value={userData.lastName} onChange={(e: any)=>this.handlePersonalChange(e)} />
                                    {lastNameErr && <span className="error">{ lastNameErr } </span>}
                                </div>
                                <div className="col-sm-3">
                                    <Input type="number" className="form-control" name="phone" placeHolder="Mobile Number" value={userData.phone} onChange={(e: any)=>this.handlePersonalChange(e)} />
                                    {phoneErr && <span className="error">{ phoneErr } </span>}
                                </div>
                            </div>
                        </div>) : (
                        <div className="geographical">
                            <div className="row age" style={{marginBottom: '14px'}}>
                                <div className="col-sm-3">
                                    <Dropdown
                                        name="country"  
                                        label="Country"
                                        options={countryList}
                                        handleChange={this.handlePersonalChange}
                                        value={userData.country} />
                                        {countryErr && <span className="error">{ countryErr } </span>}
                                </div>
                            </div>
                            <div className="row age">
                                <div className="col-sm-3">
                                    <Dropdown
                                        name="state"  
                                        label="State"
                                        options={stateList}
                                        handleChange={this.handlePersonalChange}
                                        value={userData.state} />
                                        {stateErr && <span className="error">{ stateErr } </span>}
                                </div>
                                <div className=" col-sm-3">
                                    <Dropdown
                                    name="district"  
                                    label="District"
                                    options={districtList}
                                    handleChange={this.handlePersonalChange}
                                    value={userData.district} />
                                    {districtErr && <span className="error">{ districtErr } </span>}
                                </div>
                                <div className="col-sm-3">
                                    <Dropdown
                                        name="subdistrict"  
                                        label="Sub District"
                                        options={subDistrictList}
                                        handleChange={this.handlePersonalChange}
                                        value={userData.subDistrict} />
                                        {subDistrictErr && <span className="error">{ subDistrictErr } </span>}
                                </div>
                                <div className="col-sm-3">
                                    <Dropdown
                                        name="village"  
                                        label="Village"
                                        options={villageList}
                                        handleChange={this.handlePersonalChange}
                                        value={userData.village} />
                                        {villageErr && <span className="error">{ villageErr } </span>} 
                                </div>
                            </div> 
                        </div>)}
                    </div>
                    <div className="submit">
                        <div className="">
                            {this.state.currentStep == 1 && <button className="btn btn-outline-secondary buttonStyle" onClick={()=>this.reset()}> Cancel</button>}
                            {stepsArray.length == this.state.currentStep &&
                            <button className="btn btn-outline-secondary buttonStyle" onClick={() => this.handleClick('back')}>Back</button>}
                        </div>
                        <div className="">
                            <button className={currentStep === stepsArray.length ? 'btn buttonColor createBtn' : 'btn buttonStyle buttonColor'} onClick={() => this.handleClick(currentStep === stepsArray.length ? "createUser" : 'next')}>{currentStep === stepsArray.length ? 'Create User' : 'Next'}</button> 
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { CreateUser };