import Navbar from '../components/Navbar.jsx'

const AuthLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}

export default AuthLayout


