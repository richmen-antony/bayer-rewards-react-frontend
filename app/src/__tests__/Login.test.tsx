import {Login} from "../components/auth/login";
import {render, fireEvent, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('allows the user to login successfully', async () => {
    render(<Login />)

    // fill out the form
  fireEvent.change(screen.getByLabelText(/username/i), {
    target: {value: 'Admin'},
  })
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: {value: 'admin'},
  })

})

test("shows all required input fields with empty values", () => {
    render(<Login />)
    const usernameInput:any = screen.getByLabelText(/username/i);
    const passwordInput :any= screen.getByLabelText(/password/i);
    const text = ''
    userEvent.type(usernameInput, text)
    userEvent.type(passwordInput, text)
    expect(usernameInput.value).toBe("");
    expect(passwordInput.value).toBe("");
  });

  test("shows all required  username input fields with empty values and password has values", () => {
    render(<Login />)
    const usernameInput:any = screen.getByLabelText(/username/i);
    const text = ''
    userEvent.type(usernameInput, text)
    expect(usernameInput.value).toBe("");
    const passwordInput :any= screen.getByLabelText(/password/i);
    const passwordText="admin@123"
    userEvent.type(passwordInput, passwordText)
    expect(passwordInput.value).toBe("admin@123");
  });

  test("shows all required  password input fields with empty values and username has values", () => {
    render(<Login />)
    const usernameInput:any = screen.getByLabelText(/username/i);
    const text = 'admin'
    userEvent.type(usernameInput, text)
    expect(usernameInput.value).toBe("admin");
    const passwordInput :any= screen.getByLabelText(/password/i);
    const passwordText=""
    userEvent.type(passwordInput, passwordText)
    expect(passwordInput.value).toBe("");
  });