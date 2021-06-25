import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Input } from '../../../../utility/widgets/input';

const dpstyle = {
  width: 185,
  height: 35
};

export const CountrySetup = (props) => {
  const { selectedCountryDetails } = props;
  const [countryISO, setCountryISO] = useState('');
  const [countryCurrency, setcountryCurrency] = useState([]);
  const [currencyDesc, setcurrencyDesc] = useState('');

  const countryDetails = selectedCountryDetails.length > 0 ? selectedCountryDetails : [];

  const handleDropdownChange = (event) => {
    _retriveCountryCode(event.target.value);
  }


  const _retriveCountryCode = (countryValue) => {
    const countryName = countryDetails.filter(function (result) {
      return result.name === countryValue;
    });
    const countryISO = countryName[0].isoCode;
    const currencyDesc = countryName[0].currencyDesc;
    setcurrencyDesc(currencyDesc);
    setCountryISO(countryISO);
    setcountryCurrency(countryName);
  }




  return (
    <div className="col-md-10">
      <div className="container">
        <div className="row effectiveDate fo  rm-group">
          <div className="col-sm-3">
            <div><label className="font-weight-bold pt-4">Country</label></div>
            <div>
              <select style={dpstyle} id="dropdown" onChange={(event) => handleDropdownChange(event)}>
                {countryDetails.length > 0 ? (
                  countryDetails.map(({ name }) => (
                    <option value={name} key={name}>
                      {name}
                    </option>
                  ))
                ) : (
                    <option value="" key="">No country found</option>
                  )}
              </select>
            </div>
          </div>
          <div className="col-sm-3">
            <div><label className="font-weight-bold pt-4">Country Code</label></div>
            <div>
              <Input style={dpstyle} type="text" className="form-control" name="Currency" readOnly value={countryISO} />
            </div>
          </div>
          <div className="col-sm-3">
            <div><label className="font-weight-bold pt-4">Currency Code</label></div>
            <div>
              {/* <select style={dpstyle} id="dropdown" onChange={(event) => handleDropdownChangeCurrency(event)} disabled>
                {countryCurrency.length > 0 ? (
                  countryCurrency.map(({ currency }) => (<option value={currency} key={currency}>{currency}</option>))
                ) : (
                    <option value="" key="">No currency found</option>
                  )}
              </select> */}

              <Input style={dpstyle} type="text" className="form-control" name="Currency" readOnly value={countryCurrency.map(({ currency }) => (currency))} />

              {/* <select style={dpstyle} id="dropdown" className="form-control">
                  <option>---select---</option>
                    {
                    countryCurrency && countryCurrency.currency.map((h, i) => 
                    (<option key={i} value={h.currency}>{h.CurrencyDescription}</option>))
                    }
              </select> */}

              {/* {
                console.log(countryCurrency);
                countryCurrency.map((item)=>
               <div>{item.countryName}</div>
               )
              } */}


            </div>
          </div>

          <div className="col-sm-3">
            <div><label className="font-weight-bold pt-4">Currency</label></div>
            <div>
              <Input style={dpstyle} type="text" className="form-control" name="Currency" value={currencyDesc} readOnly />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

CountrySetup.propTypes = {
  selectedPrestations: PropTypes.array,
  onChangeActiveStep: PropTypes.func.isRequired
};