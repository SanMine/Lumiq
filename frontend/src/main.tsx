import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './routes'
import { ThemeProvider } from './components/shared/theme-provider'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'sonner'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './api/query'

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router />
        <Toaster richColors />
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
)
