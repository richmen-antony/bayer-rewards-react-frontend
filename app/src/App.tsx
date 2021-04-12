import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {Router} from './router';
import * as React from 'react';

// Define Type html tag section declaration
declare global {
  namespace JSX {
      interface IntrinsicElements {
          'h8': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
          'h7': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      }
  }
}
function App() {
  return (
    <>
      <ToastContainer />
      <Router />
    </>
  );
}



// interface PersonInfoProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {

 
// }
export default App;

