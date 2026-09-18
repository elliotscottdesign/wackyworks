import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ContentProvider } from './lib/content.jsx'
import { EditModeProvider } from './edit/EditModeProvider.jsx'
import './index.css'

// GitHub Pages custom-domain deploy → routes live at /admin etc.
// on wackyworks.co.uk directly. No basename needed.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <EditModeProvider>
          <App />
        </EditModeProvider>
      </ContentProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
