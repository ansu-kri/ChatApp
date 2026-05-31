import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
    children:ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

    const token = localStorage.getItem("token");

    if(!token) {
        return <Navigate to="/" />  
    }
    return children;
}

export default ProtectedRoute