import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Publications from './components/Publications';
import Patents from './components/Patents';
import Fundprop from './components/Fundprop';
import Login from './components/Login';
import Register from './components/Register';
import RootLayout from './layouts/RootLayout';
import StartPage from './components/StartPage';
import ViewTable from './components/ViewTable'
import EditData from './components/EditData';
import DataExport from './components/DataExport';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {path:'/',element:<StartPage/>},
        {path:'/editdata',element:<EditData/>},
        { path: 'register', element: <Register /> },
        { path: 'exportData', element:<DataExport/>},
        {path:'/viewdata',element:<ViewTable/>},
        { path: '/home', element: <Home /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'publications', element: <Publications /> },
        { path: 'patents', element: <Patents /> },
        { path: 'fundingproposals', element: <Fundprop /> },
        { path: 'login', element: <Login /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
