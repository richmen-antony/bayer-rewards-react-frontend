import React from 'react';
import ReactDom from "react-dom";
import { fireEvent, screen, within} from '@testing-library/react';
import Sidebar from "../container/Layout/SideBar";
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

describe('User List component tests', () => { 
    let container: HTMLDivElement

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        ReactDom.render(
            <BrowserRouter>
              <Sidebar />
            </BrowserRouter>, 
          container);
    })

    afterEach(() => {
        document.body.removeChild(container);
        container.remove();
    })

    test('Image logo must have src = "/logo.svg" and alt = "Logo"', () => {
        const logo = screen.getByTestId('left-logo');
        expect(logo).toHaveAttribute('src', 'large_logo_holder.svg');
        expect(logo).toHaveAttribute('alt', 'no_image.svg');
    });
    
    test('Dashboard logo must have src = "/ex.svg" and alt = "Ex"', () => {
        const dashboardIcon = screen.getByTestId('dashboard-icon');
        expect(dashboardIcon).toHaveAttribute('src', 'home_icon.svg');
        expect(dashboardIcon).toHaveAttribute('alt', 'no_image.svg');
    });
    test('Logout User logo must have src = "/ex.svg" and alt = "Ex"', () => {
        const logoutIcon = screen.getByTestId('logout-icon');
        expect(logoutIcon).toHaveAttribute('src', 'logout_icon.svg');
        expect(logoutIcon).toHaveAttribute('alt', 'no_image.svg');
    });
})