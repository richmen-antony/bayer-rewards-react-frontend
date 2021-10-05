import * as React from "react";
import * as ReactDOM from "react-dom";
import { screen,cleanup } from "@testing-library/react";
import Sidebar from "../containers/layout/SideBar";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("Sidebar component tests", () => {
	let container: HTMLDivElement;

	beforeEach(() => {
		container = document.createElement("div");
		document.body.appendChild(container);
		ReactDOM.render(
			<BrowserRouter>
				<Sidebar />
			</BrowserRouter>,
			container
		);
	});

	afterEach(() => {
		document.body.removeChild(container);
		container.remove();
        cleanup();
	});

	it("Check sidebar menu is Logout,check <link> tag elements pathname attribute", () => {
        userEvent.click(screen.getByText(/Logout/i));
		const isLogutDomElement: any = screen.getByText(/Logout/i);
		expect(isLogutDomElement).toBeInTheDocument();
        expect(screen.getByText(/Logout/i).closest('a')).toHaveAttribute('href', '/landing')
	});
    it("Check sidebar menu is dashboard,check <link> tag elements pathname attribute", () => {
        //dashboard
	    userEvent.click(screen.getByText(/dashboard/i));
		const isDashboardElement: any = screen.getByText(/Dashboard/i);
		expect(isDashboardElement).toBeInTheDocument();
        expect(screen.getByText(/dashboard/i).closest('a')).toHaveAttribute('href', '/dashboard')
	});
   
    it('Dashboard must have src = "/home_icon.svg" and alt = "dashboard"', () => {
        const incrediblesPosterImg = screen.getByAltText(/dashboard/i)
        expect(incrediblesPosterImg).toHaveAttribute('alt', 'dashboard');
        expect(incrediblesPosterImg).toHaveAttribute('src', 'home_icon.svg');
    });
    it('Logout must have src = "/logout_icon.svg" and alt = "logout"', () => {
        const incrediblesPosterImg = screen.getByAltText(/Logout/i)
        expect(incrediblesPosterImg).toHaveAttribute('alt', 'logout');
        expect(incrediblesPosterImg).toHaveAttribute('src', 'logout_icon.svg');
    });
});
