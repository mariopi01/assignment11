import { useAppSelector } from '../store/hooks';
import { selectCurrentToken } from '../store/slices/authSlice';

export const useAuth = () => {
  const token = useAppSelector(selectCurrentToken);
  
  // Mengembalikan true jika ada token, false jika tidak
  return { isLoggedIn: !!token };
};