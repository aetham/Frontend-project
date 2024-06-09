import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainMenu from './components/mainmenu/mainmenu.jsx';
import ArticlePage from './pages/article/articlepage.jsx';
import TablePage from './pages/table/tablepage.jsx';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainMenu />,
    children: [
      {
        path: '/article',
        element: <ArticlePage />
      },
      {
        path: '/article/:id',
        element: <ArticlePage />
      },
      {
        path: '/table',
        element: <TablePage />
      },
      {
        path: '/*',
        element: <div>Error 404 page not found</div>
      }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;