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
		cleanup();
		document.body.removeChild(container);
		container.remove();
       
	});

	it("check the label text", () => {
		expect(screen.getByText(/Ordered date/i)).toBeInTheDocument();
		expect(screen.getByText(/Advisor ID & Name/i)).toBeInTheDocument();
		expect(screen.getByText(/Farmer ID & Name/i)).toBeInTheDocument();
	});
	
	
});
