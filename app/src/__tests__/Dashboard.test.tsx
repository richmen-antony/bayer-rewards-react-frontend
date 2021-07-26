import * as React from "react";
import * as ReactDOM from "react-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../components/dashboard";

describe("Dashboard component tests", () => {
	let container: HTMLDivElement;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
		ReactDOM.render(<Dashboard />, container);
	});

	afterEach(() => {
		document.body.removeChild(container);
		container.remove();
	});

	it("Renders correctly initial document", () => {
		const isDashboardDomElement: any = screen.getByTestId("dashboard");
	     expect(isDashboardDomElement).toBeInTheDocument();
	});
    
})