import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Home } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="text-center space-y-4 animate-fade-in">
      <p className="text-8xl font-black text-brand-200 dark:text-brand-900">404</p>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Page not found</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
      </p>
      <Link to="/dashboard">
        <Button leftIcon={<Home className="w-4 h-4" />} className="mt-4">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  </div>
);

export default NotFound;
