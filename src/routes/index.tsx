import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import React from "react";
import Home from "../pages/Home";


const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: <Home />
            }
        ]
    },
    {
        path: '*',
        element: <div>Not found</div>
    }
])

export default router;