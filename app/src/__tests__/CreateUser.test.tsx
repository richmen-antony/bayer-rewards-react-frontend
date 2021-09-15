import * as ReactDOM from 'react-dom';
import React from 'react';
import {screen , fireEvent, within,cleanup, render, getAllByRole} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateUser from "../components/users/createUser";
import {Dropdown} from "../utility/widgets/dropdown";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { store } from "../redux/store/index";
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
const props = {
    open: true,
    close: () => {},
    data: [],
};
const options = [
    { value: "retailer", text: "Retailer" },
    { value: "distributor", text: "Distributor" },
    { value: "ara sales manager", text: "Area Sales Manager" },
];
describe('Create User component tests', () => { 
    let container: HTMLDivElement

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        ReactDOM.render(
            <Provider store={store}>
            <BrowserRouter>
              <CreateUser />
            </BrowserRouter>
            </Provider>, 
          container);
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
     //Email starts
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
    //Email Ends
    test("shows first and last name required input fields with empty values", () => {
      const firstnameInput:any = screen.getByTestId("owner-firstname");
      const lastnameInput:any = screen.getByTestId("owner-lastname");
      userEvent.type(firstnameInput, "")
      userEvent.type(lastnameInput, "")
      expect(screen.getByTestId("owner-firstname")).toHaveValue("");
      expect(screen.getByTestId("owner-lastname")).toHaveValue("");
    });
    test("shows first name required input fields with values", () => {
      const firstname:any = screen.getByLabelText("owner-firstname");
      userEvent.type(firstname, "v")
      expect(firstname.value).toBe("v");
    });
    //Dropdown
    it('can change the value of the dropdown', () => {
        const dropdown = screen.getByTestId('dropdown');
        const display = dropdown.children[0];
        expect(display.textContent).toBe(options[0].text);
        fireEvent.click(dropdown);
    });
	it("Check dropdown is defined",()=>{
		const dropdownSelect = screen.getByTestId(/dropdown/i);
		expect(dropdownSelect).toBeDefined();
	})
	it("Check dropdown is not null",()=>{
		const dropdownSelect = screen.getByTestId(/dropdown/i);
        expect(dropdownSelect).not.toBeNull();
	})
	it("Check dropdown appears",()=>{
		const dropdownSelect = screen.getByTestId(/dropdown/i);
        expect(dropdownSelect).toBeInTheDocument()
	})
    it("check the right owner header column values", () => {
		const table = screen.getByTestId("table");
		const [columnNames, ...rows] = within(table).getAllByRole("rowgroup");
		within(columnNames).getByText("Type");
		within(columnNames).getByText("First Name");
		within(columnNames).getByText("Last Name");
		within(columnNames).getByText("Mobile Number");
		within(columnNames).getByText("Email(Optional)");
		within(columnNames).getByText("Active?");
	});
    test('Logo must have src = "/logo.svg" and alt = "Logo"', () => {
        const arrowIcon = screen.getByTestId('ArrowIcon');
        const buttonIcon = screen.getByTestId('RtButton');
        expect(arrowIcon).toHaveAttribute('src', 'dark bg.svg');
        expect(arrowIcon).toHaveAttribute('alt', 'no_image.svg');
        expect(buttonIcon).toHaveAttribute('src', 'right_btn.svg');
        expect(buttonIcon).toHaveAttribute('alt', 'no_image.svg');

    });
    
    // it("check the popup label text", async () => {
    //     // expect(screen.getByText(/Are you sure you want to delete store's staff?/i)).toBeInTheDocument();
    //     const title = await screen.findByText(/Are you sure you want to delete store's staff?/i);
    //     expect(title).toBeInTheDocument();
    // });
    

    // it('Table header is in the document', async () => {
    //     const button = screen.getByTestId("personal-next");
    //     fireEvent.click(button);
    //     const title = await screen.findByText(/Address information/i);
    //     expect(title).toBeInTheDocument();
    // });
    
    // it('Checkbox element', async () => {
    //     const storestaffcheckbox:any = screen.getByTestId("storestaff");
    //     userEvent.click(storestaffcheckbox)
    //     const staff = await screen.findByText(/Store Staffs/i);
    //     expect(staff).toBeInTheDocument();
    //   });

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

})


