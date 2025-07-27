import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = ({ handleLogout }) => {
  const user = localStorage.getItem("user");
  const isAdmin = localStorage.getItem("isAdmin");

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Container>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            E-Commerce App
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/user">
                Profile
              </Button>
              <Button color="inherit" component={Link} to="/new-item">
                New Item
              </Button>
              {isAdmin ? (
                <Button color="inherit" component={Link} to="/admin">
                Admin
                </Button>
              ) : (<></>)}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;