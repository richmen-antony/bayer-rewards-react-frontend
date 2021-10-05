import React from "react";
import ReactDom from "react-dom";
import { fireEvent, screen, within } from "@testing-library/react";
import InternalUser from "../components/users/userList/InternalUser";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
describe("User List component tests", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    ReactDom.render(
      <BrowserRouter>
        <InternalUser />
      </BrowserRouter>,
      container
    );
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  it("check the table header column values", () => {
    const table = screen.getByRole("table");
    const [columnNames, ...rows] = within(table).getAllByRole("rowgroup");
    within(columnNames).getByText("USER NAME");
    within(columnNames).getByText("MOBILE#");
    within(columnNames).getByText("FULL NAME");
    within(columnNames).getByText("MAIL ID");
    within(columnNames).getByText("REGION");
    within(columnNames).getByText("STATUS");
    within(columnNames).getByText("REGION MAPPED");
    within(columnNames).getByText("UPDATED BY");
  });
});
