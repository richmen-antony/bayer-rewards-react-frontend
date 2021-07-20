import React from 'react';
import ReactDom from "react-dom";
import { fireEvent, screen } from '@testing-library/react';
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
})