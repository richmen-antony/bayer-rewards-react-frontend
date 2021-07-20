import React from 'react';
import ReactDom from "react-dom";
import { fireEvent, screen} from '@testing-library/react';
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

})