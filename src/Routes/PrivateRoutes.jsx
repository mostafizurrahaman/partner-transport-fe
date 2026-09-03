
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useGetAdminProfileQuery } from '../redux/api/authApi';
import Loading from '../Components/Loading/Loading';

const ALLOWED_ROLES = ["ADMIN", "SUPER_ADMIN"];

const PrivateRoutes = ({children}) => {
    const location = useLocation();
    const {data :  getAdminProfile , isError, isLoading } = useGetAdminProfileQuery()

    if(isLoading){
        return <Loading fullPage />
    }

    const role = getAdminProfile?.data?.authId?.role;

    if(isError || !ALLOWED_ROLES.includes(role)){
        localStorage.removeItem('token');
        return <Navigate to={'/auth/login'} state={{from  : location}} replace />
    }
  return ( <>{children}</>);
}

export default PrivateRoutes;
