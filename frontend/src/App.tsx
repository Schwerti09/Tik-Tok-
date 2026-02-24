import AppRouter from './routes/AppRouter'

// Wurzel-Komponente – delegiert an AppRouter (inkl. QueryClient + BrowserRouter)
function App() {
  return <AppRouter />
}

export default App
