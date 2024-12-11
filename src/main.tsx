// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Theme } from '@radix-ui/themes'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

/* createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
) */
  const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
 /*  <StrictMode> */
 
    <Theme appearance="dark">
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>  
    </Theme>
      
   /*  </StrictMode> */
)
