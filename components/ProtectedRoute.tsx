import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

const ProtectedRoute = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to access this page');
        setTimeout(() => {
          router.replace('/auth/login');
        }, 2500);
      } else {
        toast.success('Welcome back!');
        setIsAuthenticated(true);
      }
    }, [router]);

    if (!isAuthenticated) {
      return (
        <div>
          <Toaster richColors position="top-center" />
        </div>
      );
    }

    return (
      <div>
        <Toaster richColors position="top-center" />
        <WrappedComponent {...props} />
      </div>
    );
  };

  return Wrapper;
};

export default ProtectedRoute;
