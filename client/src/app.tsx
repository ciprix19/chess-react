import './app.css'
import './styles/variables.css'
import Header from './layout/header/header'
import Footer from './layout/footer/footer'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Landing from './layout/landing/landing'
import SignUp from './layout/signup/signup'

function App() {

    return (
        <>
            <BrowserRouter>
                <div className='content'>
                    <Header></Header>
                        <Routes>
                            <Route path='/' element={<Landing />}/>
                            {/* <Route path='/login' element={<Login />} /> */}
                            <Route path='/signup' element={<SignUp />} />
                            {/* <Route path='/' element={<Start />} /> */}
                            {/* <Route path='/' element={<Play />} /> */}
                        </Routes>
                </div>
                <Footer></Footer>
            </BrowserRouter>
        </>
    )
}

export default App
