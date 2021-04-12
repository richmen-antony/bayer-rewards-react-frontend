import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {Router} from './router';

function App() {
  return (
    <>
      <ToastContainer />
      <Router />
    </>
  );
}

export default App;

