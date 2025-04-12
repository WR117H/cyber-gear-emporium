
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from '@/utils/adminAuth';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  // Check if admin is authenticated
  const authenticated = isAdminAuthenticated();

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
