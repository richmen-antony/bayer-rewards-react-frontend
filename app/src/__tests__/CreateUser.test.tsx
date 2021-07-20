import * as ReactDOM from 'react-dom';
import React from 'react';
import {screen , fireEvent, within,cleanup} from '@testing-library/react';
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
    test('render owner firstname and lastname input', () => {
       const firstnameInput = screen.getByTestId("owner-firstname");
       const lastnameInput = screen.getByTestId("owner-lastname");
        expect(firstnameInput).toBeInTheDocument();
        expect(firstnameInput).toHaveAttribute("type", "text");
        expect(lastnameInput).toBeInTheDocument();
        expect(lastnameInput).toHaveAttribute("type", "text");
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
    test("shows first and last name required input fields with empty values", () => {
      const firstnameInput:any = screen.getByTestId("owner-firstname");
      const lastnameInput:any = screen.getByTestId("owner-lastname");
      userEvent.type(firstnameInput, "")
      userEvent.type(lastnameInput, "")
      expect(screen.getByTestId("owner-firstname")).toHaveValue("");
      expect(screen.getByTestId("owner-lastname")).toHaveValue("");
    });
    test("shows first and last name required input fields with values", () => {
    //   const firstnameInput:any = screen.getByTestId("owner-firstname");
      const title = screen.getByTestId("owner-firstname");
      userEvent.type(title, "demo")
      expect(screen.getByTestId("owner-firstname")).toHaveValue("demo");
    //   const lastnameInput:any = screen.getByTestId("owner-lastname");
    //   userEvent.type(lastnameInput, "s")
    //   expect(screen.getByTestId("owner-lastname")).toHaveValue("s");
    });
    // test('render Delivery and postal input', () => {
    //   const deliverystreetInput = screen.getByTestId("delivery-street");
    //   const deliverypostalInput = screen.getByTestId("delivery-postal");
    //   expect(deliverystreetInput).toBeInTheDocument();
    //   expect(deliverypostalInput).toBeInTheDocument();
    //   expect(deliverystreetInput).toHaveAttribute("type", "text");
    //   expect(deliverypostalInput).toHaveAttribute("type", "text");
    // });
    // test("shows Button actions", async () => {
    //   const button = screen.getByRole('button', { name: 'personal-next' })
    //   fireEvent.click(button)
    //   await screen.findByText('Address information')
    //   // fireEvent.click(button)
    //   // await screen.findByText('Clicked twice')
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

