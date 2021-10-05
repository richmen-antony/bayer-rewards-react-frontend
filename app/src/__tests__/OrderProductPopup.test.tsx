import * as ReactDOM from "react-dom";
import React from "react";
import { screen,cleanup } from "@testing-library/react";
import OrderProductPopup from "../components/order/OrderProductPopup";
const props = {
	open: true,
	close: () => {},
	data: [],
};
describe("Order Histroy Product Popup component tests", () => {
	let container: HTMLDivElement;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
		ReactDOM.render(<OrderProductPopup {...props} />, container);
	});

	afterEach(() => {
		document.body.removeChild(container);
		container.remove();
		cleanup();
       
	});

	it("check the label text", () => {
		expect(screen.getByText(/Ordered date/i)).toBeInTheDocument();
		expect(screen.getByText(/Advisor ID & Name/i)).toBeInTheDocument();
		expect(screen.getByText(/Farmer ID & Name/i)).toBeInTheDocument();
	});
	it("check the no data found text", () => {
		expect(screen.getAllByText(/No Data Found/i)[0]).toBeInTheDocument();
		expect(
			screen.getAllByText((_content:any, el:any) => el.textContent === 'No Data Found'),
		 ).toHaveLength(6)
	});
	
	
	
});
