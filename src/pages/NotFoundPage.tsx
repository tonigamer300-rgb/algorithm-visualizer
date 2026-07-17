import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="text-7xl font-extrabold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold text-white">Page not found</h1>
      <p className="mt-2 text-slate-400">The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary mt-8 inline-flex">
        Back home
      </Link>
    </div>
  );
}

export default NotFoundPage;
