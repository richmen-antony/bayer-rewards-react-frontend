import * as ReactDOM from 'react-dom';
import React from 'react';
import { fireEvent, screen,within } from '@testing-library/react';
import ScanLogs from "../components/scanLogs";
import userEvent from '@testing-library/user-event';
describe('Order Histroy component tests', () => { 
    let container: HTMLDivElement

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        ReactDOM.render(<ScanLogs />, container);
    })

    afterEach(() => {
        document.body.removeChild(container);
        container.remove();
    })

    it('Renders correctly initial document', () => { 
        const inputs = container.querySelectorAll('input');
        // how many input used for component
        expect(inputs).toHaveLength(5);
        expect(inputs[0].name).toBe('searchText');

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
  
    it('check the right header column values', () => { 
        const table = screen.getByRole("table");
        const [columnNames, ...rows] = within(table).getAllByRole("rowgroup");
        within(columnNames).getByText("ORDER ID");
        within(columnNames).getByText("RETAILER NAME/ID");
        within(columnNames).getByText("INTENDED QTY");
        within(columnNames).getByText("ORDERED QTY");
        within(columnNames).getByText("TOTAL COST");
        within(columnNames).getByText("ADVISOR NAME/ID");
        within(columnNames).getByText("FARMER NAME/ID");
        within(columnNames).getByText("STATUS");
        within(columnNames).getByText("UPDATED DATE");


    })
    
})