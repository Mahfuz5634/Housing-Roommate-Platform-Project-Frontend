'use client';

import { Toaster } from 'sonner';

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme="light"
      toastOptions={{
        style: {
          borderRadius: '0.75rem',
        },
      }}
    />
  );
}
