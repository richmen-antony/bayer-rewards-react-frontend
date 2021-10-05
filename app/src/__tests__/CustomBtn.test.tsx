import * as React from "react";
import * as ReactDOM from "react-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomButton } from "../utility/widgets/button";

describe("Custom Button component tests", () => {
	let container: HTMLDivElement;
	let props = {
		label: "Save",
		style: {
			borderRadius: "30px",
			backgroundColor: "#7eb343",
			width: "190px",
			padding: "7px",
			border: "1px solid  #7eb343",
		},
		handleClick: jest.fn(),
	};

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
		ReactDOM.render(<CustomButton {...props} />, container);
	});

	afterEach(() => {
		document.body.removeChild(container);
		container.remove();
	});

	it("Hanlde click is called on button click", () => {
		userEvent.click(screen.getByRole("button", { name: /Save/i }));
		expect(props.handleClick).toHaveBeenCalledTimes(1);
	});
	it("check button elements", () => {
		const cusBtn: any = screen.getByRole("button", { name: /Save/i });
		userEvent.click(cusBtn);
		expect(screen.getByText(/Save/i)).toBeInTheDocument();
		// check buttom  is not disabled
		expect(screen.getByText(/Save/i).closest("button")).not.toBeDisabled();
		// check button type is not submit
		expect(cusBtn).not.toHaveAttribute("type", "submit");
	});
	it("check button attribute", async () => {
		const cusBtn: any = screen.getByRole("button", { name: /Save/i });
		expect(cusBtn.tagName).toBe("BUTTON");
	});

	it("check button label name", async () => {
		expect(screen.getByText(/Save/i)).toBeInTheDocument();
	});
	it("check button is not disabled", async () => {
		// check buttom  is not disabled
		expect(screen.getByText(/Save/i).closest("button")).not.toBeDisabled();
	});
	it("check button is not submit", async () => {
		const cusBtn: any = screen.getByRole("button", { name: /Save/i });
		userEvent.click(cusBtn);
		// check button type is not submit
		expect(cusBtn).not.toHaveAttribute("type", "submit");
	});
});
