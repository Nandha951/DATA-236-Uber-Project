import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';



import { Provider } from 'react-redux';
import store, { persistor } from './store'; // updated import
import { PersistGate } from 'redux-persist/integration/react';

// Initialize the styletron engine

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
  loading={
    <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '1.2rem', color: '#555' }}>
      Loading App...
    </div>
  }
  persistor={persistor}
>
      <App />
</PersistGate>
    </Provider>
  </StrictMode>
);