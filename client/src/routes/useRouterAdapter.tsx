import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

export function useRouterAdapter() {
  const location = useLocation();
  const reactNavigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // Updated navigate function to handle both string and URL
  const navigate = (to: string | URL) => {
    reactNavigate(typeof to === 'string' ? to : to.pathname + to.search);
  };

  return {
    pathname: location.pathname,
    searchParams,
    navigate,
  };
}

export interface Router {
  pathname: string;
  searchParams: URLSearchParams;
  navigate: (to: string | URL) => void;
}