
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { OrderAddress } from '@/types/order';
import { isAuthenticated, getCurrentUser } from '@/utils/auth';

export const enforceCheckoutRequirements = async (
  toast: ReturnType<typeof useToast>['toast'],
  navigate: ReturnType<typeof useNavigate>
) => {
  // Check authentication
  const auth = await isAuthenticated();
  if (!auth) {
    toast({
      title: "Login Required",
      description: "Please log in before proceeding to checkout."
    });
    navigate('/login', { state: { returnUrl: '/checkout' } });
    return { isAllowed: false };
  }

  // Get current user for additional checks if needed
  const { user } = await getCurrentUser();
  
  return { isAllowed: true, userId: user.id };
};

export const generateOrderCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
