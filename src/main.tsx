import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom'
import DTRoutes from './dt-routes';
import "./style.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <DTRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
