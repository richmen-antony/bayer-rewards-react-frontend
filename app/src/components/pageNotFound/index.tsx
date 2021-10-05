import { useLocation } from "react-router-dom";
import "../../../src/assets/scss/pageNotFound.scss";

export default function PageNotFound() {
  const { pathname } = useLocation();
  return (
    <div className="page-content">
      <p className="page-desc">
        The page <i>{pathname}</i> was not found
      </p>
      <a
        class="btn btn-primary btn-lg go-back-home-button"
        href="/"
        role="button"
      >
        Return To Dashboard
      </a>
    </div>
  );
}
