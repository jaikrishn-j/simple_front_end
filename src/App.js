import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './authentication/Login'
import Dashboard from './dashboard/dashboard'
import Token from './dashboard/Token'
import LogsData from './dashboard/LogsData'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/token' element={<Token/>}/>
        <Route path='/logs' element={<LogsData/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App