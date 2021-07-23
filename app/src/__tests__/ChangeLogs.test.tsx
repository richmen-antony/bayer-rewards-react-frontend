import React from 'react';
import ReactDom from "react-dom";
import { fireEvent, screen, within} from '@testing-library/react';
import ChangeLogs from "../components/users/userList/changeLogs";
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';

const props = {
    backToUsersList:()=> {},
    state:  ()=> {},
    previous:  ()=> {},
    next:  ()=> {},
    pageNumberClick: ()=> {},
    handlePaginationChange:()=>{}
};
describe('User List component tests', () => { 
    let container: HTMLDivElement

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        ReactDOM.render(<ChangeLogs {...props} />, container);
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
    test('render change log is available in the document', () => {
        const changelog = screen.getByText("CHANGE LOGS");
        expect(changelog).toBeInTheDocument();
    });
    it("check the right header column values", () => {
		const table = screen.getByRole("table");
		const [columnNames, ...rows] = within(table).getAllByRole("rowgroup");
		within(columnNames).getByText("User Name");
		within(columnNames).getByText("Field");
		within(columnNames).getByText("Old Value");
		within(columnNames).getByText("New Value");
		within(columnNames).getByText("Modified Date");
		within(columnNames).getByText("Modified Time");
	});
})