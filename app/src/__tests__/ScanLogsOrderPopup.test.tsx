import * as ReactDOM from "react-dom";
import React from "react";
import { screen,cleanup } from "@testing-library/react";
import OrderTable from "../components/scanLogs/Order";
import { act } from "react-dom/test-utils";
const props = {
	open: true,
	close: () => {},
	data: [],
};
describe("Scanlog Product Popup component tests", () => {
	let container: HTMLDivElement;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
		ReactDOM.render(<OrderTable {...props} />, container);
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
	
	
	
});
