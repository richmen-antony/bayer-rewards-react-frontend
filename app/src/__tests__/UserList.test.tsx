import React from 'react';
import ReactDom from "react-dom";
import { fireEvent, screen, within} from '@testing-library/react';
import UserList from "../components/users/userList";
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
describe('User List component tests', () => { 
    let container: HTMLDivElement

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        ReactDom.render(
            <BrowserRouter>
              <UserList />
            </BrowserRouter>, 
          container);
        // ReactDOM.render(<UserList />, container);
    })

    afterEach(() => {
        document.body.removeChild(container);
        container.remove();
    })
    it('render Search input', () => {
        const searchInput = screen.getByTestId("search-input");
        expect(searchInput).toBeInTheDocument();
        expect(searchInput).toHaveAttribute("type", "text");
    });

    it('validate search input fields', () => { 
        const searchInput:any = screen.getByTestId('search-input');
        userEvent.type(searchInput, "Northern");
        expect(searchInput.value).toBe("Northern");

    })
    it('search input fields with empty string', () => { 
        const searchInput:any = screen.getByTestId('search-input');
        userEvent.type(searchInput, "")
        expect(searchInput.value).toBe("");
    })
    it('Table header is in the document', async () => {
        const button = screen.getByRole('button', { name: /change logs/i });
        fireEvent.click(button);
        const title = await screen.findByText(/old value/i);
        expect(title).toBeInTheDocument();
    });
    it('Distributor is in the document', async () => {
        const distributorbutton = screen.getByRole('button', { name: /distributor/i });
        fireEvent.click(distributorbutton);
        const title = await screen.findByText(/user name/i);
        expect(title).toBeInTheDocument();
    });
    // it('store staff popup is in the document', async () => {
    //     const editIcon = screen.getByAltText(/edit-icon/i);
    //     fireEvent.click(editIcon);
    //     const title = await screen.findByText(/Personal Information/i);
    //     expect(title).toBeInTheDocument();
    // });
    // it('store staff popup is in the document', async () => {
    //     const staffClick = screen.getByAltText(/expand-window/i);
    //     fireEvent.click(staffClick);
    //     const title = await screen.findByText(/Has store staff?/i);
    //     expect(title).toBeInTheDocument();
    // });
    // it('Status is in the document', async () => {
    //     const activebutton = screen.getByTestId("statusButton");
    //     fireEvent.click(activebutton);
    //     const inactivecontent = await screen.findByText(/Are you sure you want to change/i);
    //     const errorContent = await screen.findByText(/error content/i);
    //     expect(inactivecontent).toBeInTheDocument();
    //     expect(errorContent).not.toBeInTheDocument();
    // });
    it("Date picker invalid order date DD/MM/YYYY", () => {
        Object.defineProperty(window, 'getComputedStyle', {
            value: () => ({
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                marginTop: 0,
                marginBottom: 0,
                borderBottomWidth: 0,
                borderTopWidth: 0,
                borderRightWidth: 0,
                borderLeftWidth: 0
            })
        });
        const fromDate:any = screen.getByLabelText(/Last Modified Date/i);
        fireEvent.click(fromDate);
        fireEvent.change(fromDate, { target: { value: "29/10/2020" } });
        expect(fromDate.value).toBe("29/10/2020");
	});
	it("Date picker empty value", () => {
        const fromDate:any = screen.getByLabelText(/Last Modified Date/i);
        fireEvent.click(fromDate);
        fireEvent.change(fromDate, { target: { value: "" } });
        expect(fromDate.value).toBe("");
	});
	it("Ordered Date to check the valid date format DD-MM-YYYY", () => {
        const fromDate:any = screen.getByLabelText(/Last Modified Date/i);
        fireEvent.click(fromDate);
		//enter the invalid date format
        fireEvent.change(fromDate, { target: { value: "March 29,2021" } });
		//expect valid format
        expect(fromDate.value).toBe("29-03-2021");
	});
    //Dropdown
    // it("Check dropdown is defined",()=>{
    //     const dropdownSelect = screen.getByTestId(/geolevel-test/i);
    //     expect(dropdownSelect).toBeDefined();
    // })
    // it("Check dropdown is not null",()=>{
    //     const dropdownSelect = screen.getByTestId(/geolevel-test/i);
    //     expect(dropdownSelect).not.toBeNull();
    // })
    // it("Check dropdown appears",()=>{
    //     const dropdownSelect = screen.getByTestId(/geolevel-test/i);
    //     expect(dropdownSelect).toBeInTheDocument()
    // })
    it("check the right header column values", () => {
		const table = screen.getByRole("table");
		const [columnNames, ...rows] = within(table).getAllByRole("rowgroup");
		within(columnNames).getByText("USER NAME");
		within(columnNames).getByText("MOBILE#");
		within(columnNames).getByText("ACCOUNT NAME");
		within(columnNames).getByText("OWNER NAME");
		within(columnNames).getByText("STAFF COUNT");
		within(columnNames).getByText("STATUS");
        within(columnNames).getByText("UPDATED BY");
	});
    test('Logo must have src = "/logo.svg" and alt = "Logo"', () => {
        const logo = screen.getByTestId('floating-add');
        expect(logo).toHaveAttribute('src', 'add_btn.svg');
        expect(logo).toHaveAttribute('alt', 'no_image.svg');
    });

})