import React, { Component } from 'react';
import Dropdown from '../../../utility/widgets/dropdown';
import Stepper from "../../../container/components/stepper/Stepper";
// import { TabProvider, Tab, TabPanel, TabList } from 'react-web-tabs';
import { Input } from '../../../utility/widgets/input';
import '../../../assets/scss/users.scss';
import { toastSuccess } from '../../../utility/widgets/toaster';
import { setLocalStorageData } from '../../../utility/base/localStore';
import filterIcon from "../../assets/icons/filter_icon.svg";
import CustomSwitch from '../../../container/components/switch';
import CountryJson from '../../../utility/lib/country.json';
import { apiURL } from "../../../utility/base/utils/config";
import {
    invokeGetAuthService,
    invokeGetService,
    invokePostService
} from "../../../utility/base/service";

const options = [
    // { value: "salesagent", text: "Area Sales Agent" },
    { value: "retailer", text: "Retailer" },
    { value: "distributor", text: "Distributor" },
];

const getStoreData = {
    country: 'MAL',
    Language: 'EN-US'
}

class CreateUser extends Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            geographicFields: [],
            dynamicFields: [],
            withHolding: [],
            countryList: [],
            hierarchyList: [],
            isRendered: false,
            geographicalValues: [],
            withHoldingValues: [],
            success: false,
            selectedValue: '',
            currentStep: 1,
            fromDateErr: '',
            toDateErr: '',
            userTypeErr: '',
            userNameErr: '',
            accNameErr: '',
            ownerNameErr: '',
            phoneErr: '',
            emailErr: '',
            postalCodeErr: '',
            postalCodeTaxErr: '',
            taxIdErr: '',
            countryErr: '',
            stateErr: '',
            districtErr: '',
            subDistrictErr: '',
            villageErr: '',
            stepsArray: [
                "Personal Information",
                "Geographical Mapping",
                "With-Holding tax"
            ],
            userData: {
                'fromDate': new Date().toISOString().substr(0, 10),
                'toDate': new Date().toISOString().substr(0, 10),
                'activateUser': true,
                'userType': options[0].value,
                'userName': '',
                'accName': '',
                'ownerName': '',
                'phone': '',
                'email': '',
                'postalCode': '',
                'postalCodeTax': '',
                'address': '',
                'addressTax': '',
                'taxId': ''
            },
            accInfo: true,
            allUserDatas: [],
            regionList: []
        }
    }

    componentDidMount() {

        // this.getRegion();

        ///API to get country and language settings
        this.getCountryList();
        this.getGeographicFields();
        this.getNextHierarchy(getStoreData.country, this.state.geographicFields[1]);
        setTimeout(() => {
            this.getDynamicOptionFields();
        }, 0);
    }

    getRegion() {
        // let newData = [];
        // newData.push(CountryJson);
        let regions: any = [];
        let regionObj: any = {};
        console.log('regionList', CountryJson);
        // let new = newData[region];
        CountryJson.region.map((list: any, i: number) => {
            regionObj['value'] = list.id;
            regionObj['text'] = list.name;
            regions.push({ ...regionObj });
        });
        this.setState({ regionList: regions });
        console.log('regionList', regions);
    }

    getCountryList() {
        //service call
        let res = [{ value: 'IND', text: 'INDIA' }, { value: 'MAL', text: 'Malawi' }];
        this.setState({ countryList: res });
    }
    getNextHierarchy(country: any, nextLevel: any) {
        //API to get state options for initial set since mal is default option in country
        const data = {
            type: country,
            id: nextLevel
        }

        // let stateResponse = [{}];
        let nextHierarchyResponse = [{ text: 'Central', value: 'Central' }, { text: 'Northern', value: 'Northern' }, { text: 'Western', value: 'Western' }, { text: 'Eastern', value: 'Eastern' }];
        this.setState({ hierarchyList: nextHierarchyResponse });
    }
    getGeographicFields() {
        //service call to get dynamic fields
        // servicesVersion().then((res: any) => {
        //     let res = ['country', 'state', 'district', 'village'];
        // }).catch((err: any) => {
        // })

        let res = ['Country', 'Region', 'District', 'EPA', 'Village'];
        setTimeout(() => {
            this.setState({ geographicFields: res });
        }, 0)
    }
    getDynamicOptionFields() {
        let setFormArray: any = [];
        this.state.geographicFields.map((list: any, i: number) => {
            setFormArray.push({
                name: list,
                placeHolder: true,
                value: list === 'Country' ? getStoreData.country : '',
                options: list === 'Country' ? this.state.countryList : (i == 1) ? this.state.hierarchyList : '',
                error: ''
            });
        })
        this.setState({ dynamicFields: setFormArray });
    }

    getOptionLists = (e: any, index: any) => {
        // let nextHierarchyName = '';
        // if ( index !==  this.state.dynamicFields.length-1) {
        //     nextHierarchyName = this.state.dynamicFields[index+1]['name'];
        // }

        //API to get options
        //params 
        // if ( index !==  this.state.dynamicFields.length-1) {
        //     const data = { 
        //         type: e.target.name,  // region, 
        //         id: e.target.name,
        //         nextHierarchy: nextHierarchyName
        //     }
        // }
        // let res = [{}];
        let regionResponse = [{ text: 'Central', value: 'central' }, { text: 'Bangalore', value: 'Bangalore' }];
        let districtResponse = [{ text: 'Balaka', value: 'Balaka' }, { text: 'Blantyre', value: 'Blantyre' }];
        let epaResponse = [{ text: 'EPA1', value: 'epa1' }, { text: 'EPA2', value: 'epa2' }];
        let villageResponse = [{ text: 'Village1', value: 'Village1' }, { text: 'Village2', value: 'Village2' }];

        if (this.state.currentStep == 2) {
            this.state.dynamicFields.map((list: any) => {
                // if(list.name === nextHierarchyName){
                //     list.options = stateResponse; 
                // }
                if (list.name === 'Region') {
                    list.options = this.state.hierarchyList;
                    // let district = CountryJson.region.filter((list: any)=>  value === list.id );
                    // list.options = '';

                    // let disOptions = district[0].district.map((res) => {
                    //     res['value'] = res.id;
                    //     res['value'] = res.name;
                    // });

                } else if (list.name === 'District') {
                    list.options = districtResponse;
                } else if (list.name === 'EPA') {
                    list.options = epaResponse;
                } else if (list.name === 'Village') {
                    list.options = villageResponse;
                }
            })
        } else if (this.state.currentStep == 3) {
            this.state.withHolding.map((list: any) => {
                if (list.name === 'Region') {
                    list.options = this.state.hierarchyList;
                } else if (list.name === 'District') {
                    list.options = districtResponse;
                } else if (list.name === 'EPA') {
                    list.options = epaResponse;
                } else if (list.name === 'Village') {
                    list.options = villageResponse;
                }
            })
        }
    }

    handleClick(clickType: any) {
        let formValid = true, geographicFormValid = true;
        if (clickType === "personalNext") {
            formValid = this.checkValidation();
        } else if (clickType === "geographicNext") {
            formValid = this.geographicValidation();
            if (formValid) {
                if (this.state.accInfo) {
                    this.setState({ withHolding: this.state.dynamicFields });
                }

            }
        } else if (clickType === "createUser") {
            formValid = this.geographicValidation();
        }
        const { currentStep } = this.state;
        let newStep = currentStep;
        if (clickType == "personalNext" || clickType == "geographicNext") {
            newStep = newStep + 1;
        } else {
            newStep = newStep - 1;
        }

        if (newStep > 0 && newStep <= this.state.stepsArray.length) {
            if (formValid) {
                this.setState({
                    currentStep: newStep
                });
            }
        }
        if (clickType === "createUser") {
            alert('hello');
            if (formValid) {
                alert('hi')
                let geoValues = {};
                this.state.dynamicFields.map((list: any, i: number) => {
                    let newPropsGeo = {
                        [list.name]: list.value
                    };
                    return Object.assign(geoValues, newPropsGeo);
                });

                this.state.geographicalValues.push(geoValues);

                this.setState({ geographicalValues: this.state.geographicalValues });


                let withValues = {};
                this.state.withHolding.map((list: any, i: number) => {
                    let newPropsTax = {
                        [list.name]: list.value
                    };
                    return Object.assign(withValues, newPropsTax);
                });
                this.state.withHoldingValues.push(withValues);

                // this.setState({
                //     allUserDatas: [...this.state.allUserDatas, this.state.userData, this.state.geographicalValues, this.state.withHoldingValues]
                // });
                this.submitUserDatas();

                // if(this.state.success){
                //     toastSuccess('User Created Successfully');
                //     this.props.history.push('/userList');
                // }
            } else {
                alert('fail');
            }
        }
    }
    submitUserDatas = () => {
        const { retailerCreation } = apiURL;
        this.setState({ isLoader: true });
        let personalData = this.state.userData;
        let geoData = this.state.geographicalValues;
        let taxData = this.state.withHoldingValues;
        const data = {
            "username": personalData['ownerName'],
            "firstname": personalData['ownerName'],
            "lastname": personalData['ownerName'],
            "accountname": personalData['ownerName'],
            "ownername": personalData['ownerName'],
            "mobilenumber": personalData['phone'],
            "email": personalData['email'],
            "address": personalData['address'],
            "postalcode": personalData['postalCode'],
            "region": geoData[0]['Region'],
            "district": geoData[0]['District'],
            "epa": geoData[0]['EPA'],
            "village": geoData[0]['Village'],
            "taxid": personalData['taxId'],
            "whtownername": personalData['ownerName'],
            "whtaccountname": personalData['ownerName'],
            "whtaddress": personalData['addressTax'],
            "whtpostalcode": this.state.accInfo ? personalData['postalCode'] : personalData['postalCodeTax'],
            "whtregion": taxData[0]['Region'],
            "whtdistrict": taxData[0]['District'],
            "whtepa": taxData[0]['EPA'],
            "whtvillage": taxData[0]['Village'],
        };
        invokePostService(retailerCreation, data)
            .then((response: any) => {
                this.setState({
                    isLoader: false,
                });
                toastSuccess('User Created Successfully');
                this.props.history.push('/userList');

            })
            .catch((error: any) => {
                this.setState({ isLoader: false });
                console.log(error, "error");
            });
    }
    handlePersonalChange = (e: any) => {
        let val = this.state.userData;
        if (e.target.name === 'activateUser') {
            val[e.target.name] = e.target.checked
        }
        else if (e.target.name === 'accInfo') {
            if (!e.target.checked) {
                let setFormArray: any = [];
                this.state.geographicFields.map((list: any, i: number) => {
                    setFormArray.push({
                        name: list,
                        placeHolder: true,
                        value: list === 'Country' ? getStoreData.country : '',
                        options: list === 'Country' ? this.state.countryList : (i == 1) ? this.state.hierarchyList : '',
                        error: ''
                    });
                })
                this.setState({ withHolding: setFormArray });
            } else {
                this.setState({ accInfo: e.target.checked });
                this.setState({ withHolding: this.state.dynamicFields });
            }
            this.setState({ accInfo: e.target.checked });
        } else {
            val[e.target.name] = e.target.value;
        }
        // if (e.target.name === 'userType') {
        //     let steps = this.state.stepsArray;
        //     this.setState({stepsArray : steps });
        //     if(e.target.value !== 'salesagent' ) {
        //         steps.splice(2,1,'With-Holding Tax');
        //         this.setState({stepsArray : steps });
        //     } else {
        //         steps.splice(2,1,'User Mappings');
        //         this.setState({stepsArray : steps});
        //     }
        // }
        let dateVal = this.dateValidation(e);
        if (dateVal) {
            this.setState({ userData: val });
        }
    }

    dateValidation = (e: any) => {
        let dateValid = true;
        let usersState = this.state.userData;
        if (e.target.name === "fromDate") {
            if (e.target.value < new Date().toISOString().substr(0, 10)) {
                this.setState({ fromDateErr: 'From Date should be greater than todays date' });
                dateValid = false;
            }
            else if (e.target.value > usersState.toDate) {
                this.setState({ fromDateErr: 'From Date should be lesser than To date' });
                dateValid = false;
            } else if (e.target.value < usersState.toDate) {
                this.setState({ toDateErr: '', fromDateErr: '' });
            }
            else {
                this.setState({ fromDateErr: '' });
            }
        }
        if (e.target.name === "toDate") {
            if (e.target.value < new Date().toISOString().substr(0, 10)) {
                this.setState({ toDateErr: 'To Date should be greater than todays date' });
                dateValid = false;
            }
            else if (e.target.value < usersState.fromDate) {
                this.setState({ toDateErr: 'To Date should be greater than From date' });
                dateValid = false;
            } else if (e.target.value > usersState.fromDate) {
                this.setState({ fromDateErr: '', toDateErr: '' });
            }
            else {
                this.setState({ toDateErr: '' });
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
            this.setState({ userTypeErr: '' });
        }
        if (userData.userName === "" || userData.userName === null) {
            this.setState({ userNameErr: 'Please enter the user Name' });
            formValid = false;
        } else {
            this.setState({ userNameErr: '' });
        }
        if (userData.accName === "" || userData.accName === null) {
            this.setState({ accNameErr: 'Please enter the Account Name' });
            formValid = false;
        } else {
            this.setState({ accNameErr: '' });
        }
        if (userData.ownerName === "" || userData.ownerName === null) {
            this.setState({ ownerNameErr: 'Please enter the Owner name' });
            formValid = false;
        } else {
            this.setState({ ownerNameErr: '' });
        }
        if (userData.phone === "" || userData.phone === null) {
            this.setState({ phoneErr: 'Please enter the phone' });
            formValid = false;
        } else {
            this.setState({ phoneErr: '' });
        }
        if (userData.email === "" || userData.lastName === null) {
            this.setState({ emailErr: 'Please enter the Email' });
            formValid = false;
        } else {
            this.setState({ emailErr: '' });
        }
        return formValid;
    }

    geographicValidation = () => {
        let userData = this.state.userData;
        let currentStep = this.state.currentStep;
        let geographicFormValid = true;
        if (userData.postalCode === "" || userData.postalCode === null) {
            this.setState({ postalCodeErr: 'Please enter Postal Code' });
            geographicFormValid = false;
        } else {
            this.setState({ postalCodeErr: '' });
        }
        if (currentStep == 3) {
            if (userData.taxId === "" || userData.taxId === null) {
                this.setState({ taxIdErr: 'Please enter Tax Id' });
                geographicFormValid = false;
            } else {
                this.setState({ taxIdErr: '' });
            }
        }
        let fields = (currentStep == 2) ? this.state.dynamicFields : this.state.withHolding;
        fields.map((list: any) => {
            if (list.value === '') {
                list.error = 'Please enter the ' + list.name;
                geographicFormValid = false;
            } else {
                list.error = '';
            }
            this.setState({ isRendered: true });
        })
        return geographicFormValid;
    }

    reset = () => {
        let currentStep = this.state.currentStep;
        if (currentStep === 1) {
            this.setState({
                userData: {
                    fromDate: '',
                    toDate: '',
                    userName: '',
                    accName: '',
                    userType: '',
                    ownerName: '',
                    email: '',
                    phone: ''
                }
            });
        } else if (currentStep === 2) {
            let data: any = this.state.dynamicFields;
            data.map((list: any) => {
                list.value = '';
            });

            this.setState({
                dynamicFields: data,
                userData: {
                    postalCode: '',
                    address: ''
                }
            })
        } else if (currentStep === 3) {
            let data: any = this.state.withHolding;
            data.map((list: any) => {
                list.value = '';
            });
            this.setState({

                userData: {
                    postalCodeTax: '',
                    addressTax: ''
                },
            })
        }
    }

    testingChange = (e: any, data: any) => {
        data.value = e.target.value;
    }

    render() {
        const dpstyle = {
            width: 220,
            height: 40
        };

        const { currentStep, userData, fromDateErr, toDateErr, userNameErr, accNameErr, userTypeErr, ownerNameErr, phoneErr, emailErr, countryErr, stateErr, districtErr, subDistrictErr, postalCodeErr, villageErr, taxIdErr, postalCodeTaxErr, geographicFields, country, state, district, subdistrict, village, stepsArray } = this.state;

        // console.log('allUserDatas', this.state.allUserDatas);
        // console.log('allUserDatas', this.state.dynamicFields);

        const fields = (currentStep == 2) ? this.state.dynamicFields : this.state.withHolding;
        const locationList = fields ?.map((list: any, index: number) => {
            return (
                <>
                    <div className={index === 0 ? 'col-sm-12 country' : 'col-sm-3'}>
                        <div className='row'>
                            <div className="col-sm-3">
                                <Dropdown
                                    name={list.name}
                                    label={list.name}
                                    options={list.options}
                                    handleChange={(e: any) => {
                                        list.value = e.target.value;
                                        this.setState({ isRendered: true });
                                        this.getOptionLists(e, index);
                                    }}
                                    value={list.value}
                                    isPlaceholder
                                    isDisabled={(this.state.currentStep === 3 && this.state.accInfo) ? true : false} />
                            </div>

                            {index === 0 &&
                                <>
                                    {currentStep == 2 ?
                                        <div className="col-sm-3">
                                            <Input style={dpstyle} type="text" className="form-control" name="postalCode" placeHolder="Postal Code" value={userData.postalCode} onChange={(e: any) => this.handlePersonalChange(e)} />
                                            {postalCodeErr && <span className="error">{postalCodeErr} </span>}

                                        </div> :
                                        <div className="col-sm-3">
                                            <Input style={dpstyle} type="text" className="form-control" name="postalCodeTax" placeHolder="Postal Code" onChange={(e: any) => this.handlePersonalChange(e)} disabled={this.state.accInfo ? true : false} value={this.state.accInfo ? userData.postalCode : userData.postalCodeTax} />
                                            {postalCodeTaxErr && <span className="error">{postalCodeTaxErr} </span>}
                                        </div>}
                                </>
                            }
                        </div>
                        {list.error && <span className="error">{list.error}</span>}

                    </div>
                </>
            )
        });

        let nextButton;
        if (currentStep === 1) {
            nextButton = <button className='btn buttonColor buttonStyle' onClick={() => this.handleClick('personalNext')}>Next</button>
        } else if (currentStep === 2) {
            nextButton = <button className='btn buttonColor buttonStyle' onClick={() => this.handleClick('geographicNext')}>Next</button>
        } else {
            nextButton = <button className='btn buttonColor createBtn' onClick={() => this.handleClick('createUser')}>Create User</button>
        }
        const togglePosition = { top: 20 }
        const sub_div = { position: "absolute", bottom: 100, marginLeft: 350 }

        return (
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
                    <label className="font-weight-bold pt-4">{stepsArray[currentStep - 1]}</label>
                    <div className="container">
                        {currentStep == 1 && (
                            <>
                                <div className="row effectiveDate form-group">
                                    <div className="col-sm-3">
                                        <label className="font-weight-bold pt-4">Effective From</label>
                                        <input type="date" name="fromDate" className="form-control" onChange={(e) => this.handlePersonalChange(e)} value={userData.fromDate} />
                                        {fromDateErr && <span className="error">{fromDateErr} </span>}
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="font-weight-bold pt-4">Effective To</label>
                                        <input type="date" name="toDate" className="form-control" onChange={(e) => this.handlePersonalChange(e)} value={userData.toDate} />
                                        {toDateErr && <span className="error">{toDateErr} </span>}
                                    </div>
                                    <div className="col-sm-3" style={togglePosition}>
                                        <label className="pt-4">isActive?</label>
                                        <CustomSwitch checked={userData.activateUser} onChange={(e: any) => this.handlePersonalChange(e)} name="activateUser" />
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
                                            {userTypeErr && <span className="error">{userTypeErr} </span>}
                                        </div>
                                        <div className="col-sm-3">
                                            <Input type="text" className="form-control" name="userName" placeHolder="First Name" value={userData.userName} onChange={(e: any) => this.handlePersonalChange(e)} />
                                            {userNameErr && <span className="error">{userNameErr} </span>}
                                        </div>
                                        <div className="col-sm-3">
                                            <Input type="text" className="form-control" name="accName" placeHolder="Last name" value={userData.accName} onChange={(e: any) => this.handlePersonalChange(e)} />
                                            {accNameErr && <span className="error">{accNameErr} </span>}
                                        </div>
                                    </div>
                                    <div className="row age form-group">
                                        <div className="col-sm-3">
                                            <Input type="text" className="form-control" name="ownerName" placeHolder="Account Name" value={userData.ownerName} onChange={this.handlePersonalChange} />
                                            {ownerNameErr && <span className="error">{ownerNameErr} </span>}
                                        </div>
                                        <div className="col-sm-3">
                                            <Input type="text" className="form-control" name="phone" placeHolder="Mobile Number" value={userData.phone} onChange={(e: any) => this.handlePersonalChange(e)} />
                                            {phoneErr && <span className="error">{phoneErr} </span>}
                                        </div>
                                        <div className="col-sm-3">
                                            <Input type="text" className="form-control" name="email" placeHolder="Email" value={userData.email} onChange={(e: any) => this.handlePersonalChange(e)} />
                                            {emailErr && <span className="error">{emailErr} </span>}
                                        </div>
                                    </div>
                                </div>
                            </>)}

                        <div className="geographical">
                            {currentStep == 3 &&
                                <div className="row age form-group">
                                    <div className="col-sm-3">
                                        <Input type="text" className="form-control" name="taxId" placeHolder="Tax Id" value={userData.taxId} onChange={(e: any) => this.handlePersonalChange(e)} />
                                        {taxIdErr && <span className="error">{taxIdErr} </span>}
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="pt-4">Same as Account Info</label>
                                        <CustomSwitch checked={this.state.accInfo} onChange={(e: any) => this.handlePersonalChange(e)} name="accInfo" />
                                    </div>
                                </div>}
                            {(currentStep == 2 || currentStep == 3) &&
                                (<>
                                    <div className="row age form-group">
                                        {locationList}
                                    </div>
                                </>
                                )}
                            {currentStep == 2 && (
                                <>
                                    <div className="row age" style={{ marginBottom: '14px', marginLeft: '0px' }}>
                                        <textarea name='address' rows={4} cols={40} placeholder='Address' value={userData.address} onChange={(e: any) => this.handlePersonalChange(e)} />
                                    </div>
                                </>)
                            }
                            {currentStep == 3 && (
                                <>

                                    <div className="row age" style={{ marginBottom: '14px', marginLeft: '0px' }}>
                                        <textarea name='addressTax' rows={4} cols={40} placeholder='Address' value={userData.addressTax} onChange={(e: any) => this.handlePersonalChange(e)} />
                                    </div>
                                </>)
                            }
                        </div>
                    </div>
                </div>

                <div className="submit" style={sub_div}>
                    <div className="">
                        {(currentStep !== 1) &&
                            <button className="btn btn-outline-secondary buttonStyle" style={{ marginRight: '30px' }} onClick={() => this.handleClick('back')}>Back</button>}
                        <button className="btn btn-outline-secondary buttonStyle" onClick={() => this.reset()}>Reset</button>
                    </div>
                    <div className="">
                        {nextButton}
                    </div>
                </div>
            </div>
        );
    }
}

export { CreateUser };