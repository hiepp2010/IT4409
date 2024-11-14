import NavItem from "./nav-item"
import { Button } from "@/components/ui/button"


export default function NavBar() {
  return (
    <nav className="bg-white  shadow">
      <ul className="flex space-x-4 justify-center p-4">
        <NavItem>Home</NavItem>
        <NavItem
          dropdownContent={
            <>
              <Button variant="ghost" className="w-full justify-start">Profile</Button>
              <Button variant="ghost" className="w-full justify-start">Settings</Button>
              <Button variant="ghost" className="w-full justify-start">Logout</Button>
            </>
          }
        >
          Account
        </NavItem>
        <NavItem>About</NavItem>
        <NavItem>Contact</NavItem>
      </ul>
    </nav>
  )
}