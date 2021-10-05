import * as ReactDOM from 'react-dom';
import React from 'react';
import {screen ,within,cleanup,fireEvent,render} from '@testing-library/react';
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
        within(columnNames).getByText("FARMER NAME/PHONE");
        within(columnNames).getByText("STATUS");


    })
    it("Date picker selection order date is valid format DD-MM-YYYY", () => {
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
        const fromDate:any = screen.getByLabelText(/Ordered Date/i);
        fireEvent.click(fromDate);
        fireEvent.change(fromDate, { target: { value: "29-10-2020" } });
        expect(fromDate.value).toBe("29-10-2020");
	});
    it("Date picker invalid order date DD/MM/YYYY ", () => {
        const fromDate:any = screen.getByLabelText(/Ordered Date/i);
        fireEvent.click(fromDate);
        fireEvent.change(fromDate, { target: { value: "29/10/2020" } });
        expect(fromDate.value).toBe("29/10/2020");
	});
	it("Date picker empty value ", () => {
        const fromDate:any = screen.getByLabelText(/Ordered Date/i);
        fireEvent.click(fromDate);
        fireEvent.change(fromDate, { target: { value: "" } });
        expect(fromDate.value).toBe("");
	});
    it("Date picker selection Last updated date is valid format DD-MM-YYYY", () => {
        const fromDate:any = screen.getByLabelText(/Last Updated Date/i);
        fireEvent.click(fromDate);
        fireEvent.change(fromDate, { target: { value: "29-10-2020" } });
        expect(fromDate.value).toBe("29-10-2020");
	});
	it("Date picker invalid Last updated date DD/MM/YYYY ", () => {
        const fromDate:any = screen.getByLabelText(/Last Updated Date/i);
        fireEvent.click(fromDate);
        fireEvent.change(fromDate, { target: { value: "29/10/2020" } });
        expect(fromDate.value).toBe("29/10/2020");
	});
	it("Date picker empty value ", () => {
        const fromDate:any = screen.getByLabelText(/Last Updated Date/i);
        fireEvent.click(fromDate);
        fireEvent.change(fromDate, { target: { value: "" } });
        expect(fromDate.value).toBe("");
	});
	it(" Last Updated Date to check the valid date format DD-MM-YYYY  ", () => {
        const fromDate:any = screen.getByLabelText(/Last Updated Date/i);
        fireEvent.click(fromDate);
		//enter the invalid date format
        fireEvent.change(fromDate, { target: { value: "March 29,2021" } });
		//expect valid format
        expect(fromDate.value).toBe("29-03-2021");
	});
    it("Check region dropdown element is defined",()=>{
		const regionSelect = screen.getByTestId(/region-test/i);
		expect(regionSelect).toBeDefined();
	})
    it("Check region dropdown element is not null",()=>{
		const regionSelect = screen.getByTestId(/region-test/i);
        expect(regionSelect).not.toBeNull();
	})
	it("Check region dropdown element is appears",()=>{
			const regionSelect = screen.getByTestId(/region-test/i);
        expect(regionSelect).toBeInTheDocument()
	})
	it("Check region dropdown element is default value",()=>{
		let options:any = screen.getAllByTestId('ALL')
		expect(options[0].selected).toBeTruthy();
	})
	it('Download button is in the document', async () => {
		Object.defineProperty(window, 'getComputedStyle', {
			value: () => ({
				getPropertyValue: () => {
					return '';
				}
			})
		});
        const downloadBtn:any = screen.getByRole('button', { name: /download/i });
        fireEvent.click(downloadBtn);
		expect(screen.getByText(/download/i)).toBeInTheDocument()
		// check buttom  is not disabled
		expect(screen.getByText(/download/i).closest('button')).not.toBeDisabled();
		// check button type is not submit 
		expect(downloadBtn).not.toHaveAttribute('type', 'submit')
        
    });
	it('Download button is in the document attrubute', async () => {
        const downloadBtn:any = screen.getByRole('button', { name: /download/i });
		expect(downloadBtn.tagName).toBe('BUTTON')
        
    });
    it('renders all buttons', async () => {
		const btn = container.querySelectorAll("button");
		expect(btn).toHaveLength(9)
	  })
	  it('Reset all button is in the document', async () => {
		const resetAllBtn = screen.getByTestId("reset-all");
	   fireEvent.click(resetAllBtn);
		expect(resetAllBtn).toBeDefined();
		expect(screen.getByText(/Reset All/i)).toBeInTheDocument()
		// // check buttom  is not disabled
		expect(screen.getByText(/Reset All/i).closest('button')).not.toBeDisabled();
		// // check button type is not submit 
		expect(resetAllBtn).not.toHaveAttribute('type', 'submit')
	    
    });
	it('Reset all button is in the document attrubute', async () => {
        const resetAllBtn = screen.getByTestId("reset-all");
		expect(resetAllBtn.tagName).toBe('BUTTON')
        
    });
	// apply btn unit test cases
	it('Apply button is in the document', async () => {
		const applyBtn = screen.getByTestId("apply");
	   fireEvent.click(applyBtn);
		expect(applyBtn).toBeDefined();
		expect(screen.getByText(/Apply/i)).toBeInTheDocument()
		// // check buttom  is not disabled
		expect(screen.getByText(/Apply/i).closest('button')).not.toBeDisabled();
		// // check button type is not submit 
		expect(applyBtn).not.toHaveAttribute('type', 'submit')
	    
    });
	it('Apply button is in the document attrubute', async () => {
        const resetAllBtn = screen.getByTestId("apply");
		expect(resetAllBtn.tagName).toBe('BUTTON')
        
    });
    it('Fulfilled button is in the document', async () => {
        const fulfilledBtn:any = screen.getByRole('button', { name: /FULFILLED/i });
        fireEvent.click(fulfilledBtn);
		expect(screen.getByText(/FULFILLED/i)).toBeInTheDocument()
		// check buttom  is not disabled
		expect(screen.getByText(/FULFILLED/i).closest('button')).not.toBeDisabled();
		// check button type is not submit 
		expect(fulfilledBtn).not.toHaveAttribute('type', 'submit')
        
    });
    it('Fulfilled button is in the document attrubute', async () => {
        const fulfilledBtn:any = screen.getByRole('button', { name: /FULFILLED/i });
		expect(fulfilledBtn.tagName).toBe('BUTTON')
        
    });
    it('PENDING button is in the document', async () => {
        const pendingBtn:any = screen.getByRole('button', { name: /PENDING/i });
        fireEvent.click(pendingBtn);
		expect(screen.getByText(/PENDING/i)).toBeInTheDocument()
		// check buttom  is not disabled
		expect(screen.getByText(/PENDING/i).closest('button')).not.toBeDisabled();
		// check button type is not submit 
		expect(pendingBtn).not.toHaveAttribute('type', 'submit')
        
    });
    it('PENDING button is in the document attrubute', async () => {
        const pendingBtn:any = screen.getByRole('button', { name: /PENDING/i });
		expect(pendingBtn.tagName).toBe('BUTTON')
        
    });
    it('CANCELLED button is in the document', async () => {
        const cancelledBtn:any = screen.getByRole('button', { name: "CANCELLED" });
        fireEvent.click(cancelledBtn);
		expect(screen.getByText("CANCELLED")).toBeInTheDocument()
		// check buttom  is not disabled
		expect(screen.getByText("CANCELLED").closest('button')).not.toBeDisabled();
		// check button type is not submit 
		expect(cancelledBtn).not.toHaveAttribute('type', 'submit')
        
    });
    it('CANCELLED button is in the document attrubute', async () => {
        const cancelledBtn:any = screen.getByRole('button', { name: "CANCELLED" });
		expect(cancelledBtn.tagName).toBe('BUTTON')
        
    });
    it('EXPIRED button is in the document', async () => {
        const expiredBtn:any = screen.getByRole('button', { name: "EXPIRED" });
        fireEvent.click(expiredBtn);
		expect(screen.getByText("EXPIRED")).toBeInTheDocument()
		// check buttom  is not disabled
		expect(screen.getByText("EXPIRED").closest('button')).not.toBeDisabled();
		// check button type is not submit 
		expect(expiredBtn).not.toHaveAttribute('type', 'submit')
        
    });
    it('EXPIRED button is in the document attrubute', async () => {
        const expiredBtn:any = screen.getByRole('button', { name: "EXPIRED" });
		expect(expiredBtn.tagName).toBe('BUTTON')
        
    });
    

})