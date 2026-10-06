import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="status-message glass-panel page-fade-in">
      <h2>404 - Wild Missingno Appeared!</h2>
      <p>There's nothing here.</p>
      <Link to="/" className="btn-back">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Flee back to safety
      </Link>
    </div>
  );
}

export default NotFoundPage;
