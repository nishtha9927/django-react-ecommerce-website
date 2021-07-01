import React,{useState,useEffect} from "react";
import { Navbar, Nav, Container, Row, NavDropdown,Image } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import SearchBox from "../components/SearchBox";
import { logout } from "../actions/userActions";
import Message from './Message'
import icon from './icon.png';

function Header({location}) {
  const userLogin = useSelector((state) => state.userLogin);
  const [Logout, setlogout] = useState(false)
  const dispatch = useDispatch();
  const { userInfo } = userLogin;
  const logoutHandler = () => {
    dispatch(logout());
    setlogout(true)
    setTimeout(() => {
      setlogout(false)
    }, 1000);

  };
  
  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
        
          <LinkContainer to="/">
          
            <Navbar.Brand><Image src={icon} style={{"vertical-align": "top"}}></Image>Get-It-All</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox/>
            <Nav className="ml-auto" style={{"margin-left":"auto"}}>
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i>Cart
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/myorders">
                    <NavDropdown.Item>My Orders</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i>Login
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="username">
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {Logout && <Message variant="info">Sucessfully Logged Out!</Message>}
    </header>
  );
}

export default Header;
