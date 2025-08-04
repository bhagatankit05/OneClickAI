import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    appearance={{
      layout: {
        socialButtonsPlacement: 'bottom',
        socialButtonsVariant: 'iconButton',
      },
      variables: {
        colorPrimary: '#2563EB',        // Blue for primary
        colorText: '#1F2937',           // Dark gray text
        colorTextOnPrimaryBackground: '#FFFFFF',
        colorBackground: '#F9FAFB',
        colorInputText: '#111827',
        colorInputBackground: '#FFFFFF',
        colorAlphaShade: '#E0F2FE',     // Light blue shadow/hover
        colorDanger: '#DC2626',         // Optional: red for error
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
      },
      elements: {
        card: 'shadow-xl border border-gray-200 rounded-xl p-6',
        formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md py-2 px-4',
        headerTitle: 'text-xl font-bold text-gray-800',
      },
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);
