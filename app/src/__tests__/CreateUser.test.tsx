import * as ReactDOM from 'react-dom';
import React from 'react';
import {screen ,within,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateUser from "../components/users/createUser";
// import getGeographicFields from "../components/users/createUser";


// const stubbedCountries:any = [
//     {
//       numericCode: 1,
//       name: "Slovakia",
//       capital: "Bratislava",
//       region: "Europe",
//       population: 500,
//       flag: "Slovakia flag",
//     },
//   ];
describe('Create User component tests', () => { 
    let container: HTMLDivElement

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        ReactDOM.render(<CreateUser />, container);
    })

    afterEach(() => {
        document.body.removeChild(container);
        container.remove();
        cleanup();
    })
    test('render owner firstname input', () => {
       const firstnameInput = screen.getByTestId("owner-firstname");
        expect(firstnameInput).toBeInTheDocument();
        expect(firstnameInput).toHaveAttribute("type", "text");
    });
    test('render user type input', () => {
        const storestaff = screen.getByTestId("storestaff");
         expect(storestaff).toBeInTheDocument();
         expect(storestaff).toHaveAttribute("type", "checkbox");
     });
    test('render email input', () => {
        const emailinput = screen.getByTestId("email-input");
        expect(emailinput).toBeInTheDocument();
        expect(emailinput).toHaveAttribute("type", "email");
    });

    test('pass valid email to test email input field', () => {
        const emailinput = screen.getByTestId("email-input");
        userEvent.type(emailinput, "test@mail.com");
        expect(screen.getByTestId("email-input")).toHaveValue("test@mail.com");
        expect(screen.queryByTestId("error-msg")).not.toBeInTheDocument();
    });
    test('pass invalid email to test input value', () => {
        const emailinput = screen.getByTestId("email-input");
        userEvent.type(emailinput, "test@mail");
        expect(screen.getByTestId("email-input")).toHaveValue("test@mail");
        expect(screen.queryByTestId("error-msg")).toBeInTheDocument();
        // expect(screen.queryByTestId("error-msg").textContent).toEqual("Please enter a valid email");
    });
    // test("shows all required input fields with empty values", () => {
    //   const firstnameInput:any = screen.getByTestId("owner-firstname");
    //   // const passwordInput :any= screen.getByLabelText(/password/i);
    //   const text = ''
    //   userEvent.type(firstnameInput, text)
    //   // userEvent.type(passwordInput, text)
    //   expect(passwordInput.value).toBe("");
    //   expect(screen.getByTestId("owner-firstname")).toBe("");
    //   // expect(passwordInput.value).toBe("");
    // });
    // it("should return status code 200 and a defined body as response", async () => {
    //     // Mock API
    //     jest.spyOn(global, "fetch").mockImplementation(():any => 
    //       Promise.resolve({
    //         json: () =>
    //           Promise.resolve({
    //             status: 200,
    //             data: stubbedCountries,
    //           }),
    //       })
    //     );
    //     // jest.mock('getGeographicFields', () => jest.fn())
    //     // expect(getGeographicFields).toBe(1);

    //     const result = new getGeographicFields()
    
    //     expect(result.status).toBe(200);
    //     expect(result.data).toBe(stubbedCountries);
    //   });
 


    // it('Renders correctly initial document', () => { 
    //     const inputs = container.querySelectorAll('input');
    //     // how many input used for components
    //     expect(inputs).toHaveLength(5);
    //     expect(inputs[0].name).toBe('searchText');

    // })

    // it('validate search input fields', () => { 
    //     const searchInput:any = screen.getByTestId('search-input');
    //     userEvent.type(searchInput, "Northern");
    //     expect(searchInput.value).toBe("Northern");

    // })
    // it('search input fields with empty string', () => { 
    //     const searchInput:any = screen.getByTestId('search-input');
    //     userEvent.type(searchInput, "")
    //     expect(searchInput.value).toBe("");
    // })
  

})

