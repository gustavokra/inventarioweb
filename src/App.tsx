import Navigator from './components/router/Navigator'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigator></Navigator>
      <Toaster></Toaster>
    </div>
  )
}

export default App