// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ContexteProvider } from './contexts/ContextProvider.jsx';
import './index.css'
import router from './router.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContexteProvider >
      <RouterProvider router={router} />    
    </ContexteProvider>
  </StrictMode>,
)
