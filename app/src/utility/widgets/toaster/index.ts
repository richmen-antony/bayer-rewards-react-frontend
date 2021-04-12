  

import { toast } from 'react-toastify';

export const toastError = (msg: any) => toast.error(msg, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 3000,
    hideProgressBar: true
});
export const toastSuccess = (msg: any) => toast.error(msg, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 3000,
    hideProgressBar: true
});
