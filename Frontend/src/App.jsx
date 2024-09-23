import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Inventory from './pages/inventory/Inventory'
import Home from './pages/navbar/Home'
import Soldering from './pages/soldering/Soldering';
import Packaging from './pages/packaging/Packaging';
import Painting from './pages/painting/Painting';
import { Login } from './pages/login/Login';
import Worker from './pages/worker/Worker';
import ManagerDashboard from './pages/manager/Manager';
import { Toaster } from "@/components/ui/toaster"
import ProtectedRoute from './pages/protected/ProtectedRoute';
import NotFound from './pages/notfound/NotFound';
function App() {
  return (
    <>
    
     <Router>
      <Routes>
     
      <Route path='' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      {/* <Route element={<ProtectedRoute/>}> */}
          <Route path='/workers/:userId' element={<Worker/>}/>
          <Route path='/inventory' element={<Inventory/>}/>
          <Route path='/soldering' element={<Soldering/>}/>
          <Route path="/manager" element= {<ManagerDashboard/>} />
          <Route path='/packaging' element={<Packaging/>}/>
          <Route path='/painting' element={<Painting/>}/>
      {/* </Route> */}
      <Route path="*" element={<NotFound/>} />
      </Routes>
     </Router>
     <Toaster/>
   </>
  )
}

export default App
