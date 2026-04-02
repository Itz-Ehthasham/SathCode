import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { Signup } from './pages/Signup'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route
        path="/home"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
    </Routes>
  )
}

export default App
