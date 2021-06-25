import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import successIcon from "../../../assets/icons/success.svg";
import errorIcon from "../../../assets/icons/error.svg";
import infoIcon from "../../../assets/icons/info.svg";
import warningIcon from "../../../assets/icons/warning.svg";
import NoImageCircle from "../../../assets/images/no-image-circle.jpg";

export const toastError = (msg: any) =>
  toast.error(msg, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 3000,
    hideProgressBar: true,
  });
export const toastSuccess = (msg: any) =>
  toast.success(msg, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 3000,
    hideProgressBar: true,
  });

export const toastWarning = (msg: any) =>
  toast.warning(msg, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 3000,
    hideProgressBar: true,
  });

export const toastInfo = (msg: any) =>
  toast.info(msg, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 3000,
    hideProgressBar: true,
  });

export const Alert = (type: any, message: any) => {
  switch (type) {
    case "warning":
      return toast.warning(
        <div>
          <td style={{ verticalAlign:'middle', height: 'auto'}}><img src={warningIcon} width="30" alt={NoImageCircle} /></td>
          <td style={{ paddingLeft: '10px',verticalAlign:'middle'}}>{message}</td>
        </div>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: true,
        }
      );
    case "error":
      return toast.error(
        <div>
          <td style={{ verticalAlign:'middle', height: 'auto'}}><img src={errorIcon} width="30" alt={NoImageCircle} /></td>
          <td style={{ paddingLeft: '10px', verticalAlign:'middle'}}>{message}</td>
        </div>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: true,
        }
      );
    case "success":
      return toast.success(
        <div>
          <td style={{ verticalAlign:'middle', height: 'auto'}}><img src={successIcon} width="30" alt={NoImageCircle} /></td>
          <td style={{ paddingLeft: '10px',verticalAlign:'middle'}}>{message}</td>
        </div>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: true,
        }
      );
    case "info":
      return toast.info(
        <div>
          <td style={{verticalAlign:'middle', height: 'auto'}}><img src={infoIcon} width="30" alt={NoImageCircle} /></td>
          <td style={{ paddingLeft: '10px', verticalAlign:'middle'}}>{message}</td>
        </div>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: true,
        }
      );
    case "dark":
      return toast.dark(message);
    default:
      return toast(message);
  }
};
