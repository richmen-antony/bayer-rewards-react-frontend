import * as React from "react";
import { render as rtlRender, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, Route, BrowserRouter as Router, Switch, useLocation } from "react-router-dom";
import Dashboard from "../components/dashboard";
import { Login } from "../components/auth/login";

const Home = () => <div>You are home</div>;
const NoMatch = () => <div>No match</div>;

const LocationDisplay = () => {
	const location = useLocation();

	return <div data-testid="location-display">{location.pathname}</div>;
};

const App = () => (
	<div>
		<Link to="/">Home</Link>

		<Link to="/dashboard">Dashboard</Link>
		<Link to="/login">Login</Link>

		<Switch>
			<Route exact path="/">
				<Home />
			</Route>
			<Route path="/dashboard">
				<Dashboard />
			</Route>
			<Route path="/login">
				<Login />
			</Route>

			<Route>
				<NoMatch />
			</Route>
		</Switch>

		<LocationDisplay />
	</div>
);

// Ok, so here's what your tests might look like

// this is a handy function that I would utilize for any component
// that relies on the router being in context
const render = (ui: any, { route = "/" } = {}) => {
	window.history.pushState({}, "Test page", route);

	return rtlRender(ui, { wrapper: Router });
};

test("full app rendering/navigating", () => {
	render(<App />);
	//home
	expect(screen.getByText(/you are home/i)).toBeInTheDocument();

	//dashboard
	userEvent.click(screen.getByText(/dashboard/i));
	const isDashboardDomElement: any = screen.getByTestId("dashboard");
	expect(isDashboardDomElement).toBeInTheDocument();

	//login
	userEvent.click(screen.getByText(/login/i));
	const usernameInput: any = screen.getByLabelText(/username/i);
	expect(usernameInput).toBeInTheDocument();
});

test("Dashboard component rendering/navigating", () => {
	render(<App />);
	//dashboard
	userEvent.click(screen.getByText(/dashboard/i));
	const isDashboardDomElement: any = screen.getByTestId("dashboard");
	expect(isDashboardDomElement).toBeInTheDocument();
});

test("Login component rendering/navigating", () => {
	render(<App />);
	//login
	userEvent.click(screen.getByText(/login/i));
	const usernameInput: any = screen.getByLabelText(/username/i);
	expect(usernameInput).toBeInTheDocument();
});

test("landing on a bad page", () => {
	render(<App />, { route: "/something-that-does-not-match" });
	expect(screen.getByText(/no match/i)).toBeInTheDocument();
});

test("rendering a component that uses useLocation", () => {
	const route = "/some-route";
	render(<LocationDisplay />, { route });

	// avoid using test IDs when you can
	expect(screen.getByTestId("location-display")).toHaveTextContent(route);
});
