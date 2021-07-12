import * as ReactDOM from 'react-dom';
import React from 'react';
import {screen ,within,cleanup} from '@testing-library/react';
import OrderHistroy from "../components/order";
import userEvent from '@testing-library/user-event';
describe('Order Histroy component tests', () => { 
    let container: HTMLDivElement

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        ReactDOM.render(<OrderHistroy />, container);
    })

    afterEach(() => {
        document.body.removeChild(container);
        container.remove();
        cleanup();
    })

    it('Renders correctly initial document', () => { 
        const inputs = container.querySelectorAll('input');
        // how many input used for components
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
        within(columnNames).getByText("ORDERED QTY");
        within(columnNames).getByText("TOTAL COST");
        within(columnNames).getByText("ADVISOR NAME/ID");
        within(columnNames).getByText("FARMER NAME/ID");
        within(columnNames).getByText("STATUS");


    })
  

})