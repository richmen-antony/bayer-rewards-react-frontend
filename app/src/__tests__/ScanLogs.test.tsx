import * as ReactDOM from "react-dom";
import React from "react";
import { fireEvent, screen, within,render } from "@testing-library/react";
import ScanLogs from "../components/scanLogs";
import userEvent from "@testing-library/user-event";

describe("Order Histroy component tests", () => {
	let container: HTMLDivElement;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
		ReactDOM.render(<ScanLogs />, container);
	});

	afterEach(() => {
		document.body.removeChild(container);
		container.remove();
	});

	it("Renders correctly initial document", () => {
		const inputs = container.querySelectorAll("input");
		// how many input used for component
		expect(inputs).toHaveLength(5);
		expect(inputs[0].name).toBe("searchText");
	});

	it("validate search input fields", () => {
		const searchInput: any = screen.getByTestId("search-input");
		userEvent.type(searchInput, "Northern");
		expect(searchInput.value).toBe("Northern");
	});
	it("search input fields with empty string", () => {
		const searchInput: any = screen.getByTestId("search-input");
		userEvent.type(searchInput, "");
		expect(searchInput.value).toBe("");
	});

	it("check the right header column values", () => {
		const table = screen.getByRole("table");
		const [columnNames, ...rows] = within(table).getAllByRole("rowgroup");
		within(columnNames).getByText("LABEL/BATCH ID");
		within(columnNames).getByText("CUSTOMER NAME/ID");
		within(columnNames).getByText("PRODUCT NAME");
		within(columnNames).getByText("CHANNEL TYPE");
		within(columnNames).getByText("SCANNED ON");
		within(columnNames).getByText("SCANNED BY");
		within(columnNames).getByText("EXPIRY DATE");

	});
	// it("Date picker selection order date is valid format DD-MM-YYYY", () => {
    //     Object.defineProperty(window, 'getComputedStyle', {
    //         value: () => ({
    //             paddingLeft: 0,
    //             paddingRight: 0,
    //             paddingTop: 0,
    //             paddingBottom: 0,
    //             marginLeft: 0,
    //             marginRight: 0,
    //             marginTop: 0,
    //             marginBottom: 0,
    //             borderBottomWidth: 0,
    //             borderTopWidth: 0,
    //             borderRightWidth: 0,
    //             borderLeftWidth: 0
    //         })
    //     });
    //     const fromDate:any = screen.getByLabelText(/Ordered Date/i);
    //     fireEvent.click(fromDate);
    //     fireEvent.change(fromDate, { target: { value: "29-10-2020" } });
    //     expect(fromDate.value).toBe("29-10-2020");
	// });
	// it("Date picker invalid order date DD/MM/YYYY ", () => {
    //     const fromDate:any = screen.getByLabelText(/Ordered Date/i);
    //     fireEvent.click(fromDate);
    //     fireEvent.change(fromDate, { target: { value: "29/10/2020" } });
    //     expect(fromDate.value).toBe("29/10/2020");
	// });
	// it("Date picker empty value ", () => {
    //     const fromDate:any = screen.getByLabelText(/Ordered Date/i);
    //     fireEvent.click(fromDate);
    //     fireEvent.change(fromDate, { target: { value: "" } });
    //     expect(fromDate.value).toBe("");
	// });
	// it("Ordered Date to check the valid date format DD-MM-YYYY  ", () => {
    //     const fromDate:any = screen.getByLabelText(/Ordered Date/i);
    //     fireEvent.click(fromDate);
	// 	//enter the invalid date format
    //     fireEvent.change(fromDate, { target: { value: "March 29,2021" } });
	// 	//expect valid format
    //     expect(fromDate.value).toBe("29-03-2021");
	// });

	// it("Date picker selection Last updated date is valid format DD-MM-YYYY", () => {
    //     const fromDate:any = screen.getByLabelText(/Last Updated Date/i);
    //     fireEvent.click(fromDate);
    //     fireEvent.change(fromDate, { target: { value: "29-10-2020" } });
    //     expect(fromDate.value).toBe("29-10-2020");
	// });
	// it("Date picker invalid Last updated date DD/MM/YYYY ", () => {
    //     const fromDate:any = screen.getByLabelText(/Last Updated Date/i);
    //     fireEvent.click(fromDate);
    //     fireEvent.change(fromDate, { target: { value: "29/10/2020" } });
    //     expect(fromDate.value).toBe("29/10/2020");
	// });
	// it("Date picker empty value ", () => {
    //     const fromDate:any = screen.getByLabelText(/Last Updated Date/i);
    //     fireEvent.click(fromDate);
    //     fireEvent.change(fromDate, { target: { value: "" } });
    //     expect(fromDate.value).toBe("");
	// });
	// it(" Last Updated Date to check the valid date format DD-MM-YYYY  ", () => {
    //     const fromDate:any = screen.getByLabelText(/Last Updated Date/i);
    //     fireEvent.click(fromDate);
	// 	//enter the invalid date format
    //     fireEvent.change(fromDate, { target: { value: "March 29,2021" } });
	// 	//expect valid format
    //     expect(fromDate.value).toBe("29-03-2021");
	// });
	// it("Check farmer dropdown element is defined",()=>{
	// 	const farmerSelect = screen.getByTestId(/farmer-test/i);
	// 	expect(farmerSelect).toBeDefined();
	// 	// const allOption = screen.getByText(/All/i);
	// 	// userEvent.selectOptions(farmerSelect, [allOption]);
	// })
	// it("Check farmer dropdown element is not null",()=>{
	// 	const farmerSelect = screen.getByTestId(/farmer-test/i);
    //     expect(farmerSelect).not.toBeNull();
	// })
	// it("Check farmer dropdown element is appears",()=>{
	// 	const farmerSelect = screen.getByTestId(/farmer-test/i);
    //     expect(farmerSelect).toBeInTheDocument()
	// })
	// it("Check farmer dropdown element is default value",()=>{
	// 	let options:any = screen.getAllByTestId('ALL')
	// 	expect(options[0].selected).toBeTruthy();
	// })
	
	// Retailer select dropdown
	// it("Check Retailer dropdown element is defined",()=>{
	// 	const retailerSelect = screen.getByTestId(/retailer-test/i);
	// 	expect(retailerSelect).toBeDefined();
	
	// })
	// it("Check Retailer dropdown element is not null",()=>{
	// 	const retailerSelect = screen.getByTestId(/retailer-test/i);
    //     expect(retailerSelect).not.toBeNull();
	// })
	// it("Check Retailer dropdown element is appears",()=>{
	// 	const retailerSelect = screen.getByTestId(/retailer-test/i);
    //     expect(retailerSelect).toBeInTheDocument()
	// })
	// it("Check Retailer dropdown element is default value",()=>{
	// 	let options:any = screen.getAllByTestId('ALL')
	// 	expect(options[0].selected).toBeTruthy();
	// })
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
		expect(btn).toHaveLength(23)
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

});
