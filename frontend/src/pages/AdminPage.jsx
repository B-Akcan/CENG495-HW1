import React, { useEffect, useState } from "react";
import {
  Container, Typography, Button, List, ListItem, ListItemText, IconButton, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const AdminPage = () => {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmDeleteItemId, setConfirmDeleteItemId] = useState(null);
  const [confirmDeleteUsername, setConfirmDeleteUsername] = useState(null);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios.get("https://ceng-495-hw-1-steel.vercel.app/items", config).then(res => setItems(res.data));
    axios.get("https://ceng-495-hw-1-steel.vercel.app/users", config).then(res => setUsers(res.data));
  }, []);

  const handleDeleteItem = async () => {
    try {
      await axios.delete(`https://ceng-495-hw-1-steel.vercel.app/items/${confirmDeleteItemId}`, config);
      setItems(items.filter(item => item._id !== confirmDeleteItemId));
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setConfirmDeleteItemId(null);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`https://ceng-495-hw-1-steel.vercel.app/users/${confirmDeleteUsername}`, config);
      setUsers(users.filter(user => user.username !== confirmDeleteUsername));
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setConfirmDeleteUsername(null);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Divider sx={{ my: 2 }} />

      {/* Item Management */}
      <Typography variant="h6">Delete an Item</Typography>
      <List>
        {items.map((item) => (
          <ListItem
            key={item.name}
            secondaryAction={
              <IconButton edge="end" color="error" onClick={() => setConfirmDeleteItemId(item._id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={`${item.name} (${item.category})`} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 4 }} />

      {/* User Management */}
      <Typography variant="h6">Delete a User</Typography>
      <List>
        {users.map(user => (
          <ListItem
            key={user.username}
            secondaryAction={
              <IconButton edge="end" color="error" onClick={() => setConfirmDeleteUsername(user.username)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={user.username} />
          </ListItem>
        ))}
      </List>

      {/* Delete Dialogs */}
      <Dialog open={!!confirmDeleteItemId} onClose={() => setConfirmDeleteItemId(null)}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteItemId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteItem}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmDeleteUsername} onClose={() => setConfirmDeleteUsername(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete user "{confirmDeleteUsername}"?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteUsername(null)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteUser}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Error and Success Messages */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPage;
