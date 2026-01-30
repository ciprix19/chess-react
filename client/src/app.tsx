import './app.css'
import './styles/variables.css'
import Header from './layout/header/header'
import Footer from './layout/footer/footer'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import SignUp from './layout/signup/signup'
import Login from './layout/login/login'
import { AuthProvider } from './utils/provider/authProvider'
import Play from './layout/play/play'

function App() {
    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                    <div className='content'>
                        <Header></Header>
                            <Routes>
                                <Route path='/' element={<Play />}/>
                                <Route path='/login' element={<Login />} />
                                <Route path='/signup' element={<SignUp />} />
                            </Routes>
                    </div>
                    <Footer></Footer>
                </AuthProvider>
            </BrowserRouter>
        </>
    )
}

export default App
