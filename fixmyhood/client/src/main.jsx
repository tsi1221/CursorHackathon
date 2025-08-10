import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './index.css';
import App from './pages/HomeFeed.jsx';
import ReportIssue from './pages/ReportIssue.jsx';
import MapPage from './pages/MapPage.jsx';
import IssueDetail from './pages/IssueDetail.jsx';
import Shell from './shell/Shell.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true, element: <App /> },
      { path: 'report', element: <ReportIssue /> },
      { path: 'map', element: <MapPage /> },
      { path: 'issue/:id', element: <IssueDetail /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);