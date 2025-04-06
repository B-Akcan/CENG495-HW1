import React, { useEffect, useState } from "react";
import {
  Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, MenuItem, Grid, Divider,
  Select, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const AdminPage = ({ auth }) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: 0, category: "", description: "", seller: "", image: "" });
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmDeleteItemId, setConfirmDeleteItemId] = useState(null);
  const [confirmDeleteUsername, setConfirmDeleteUsername] = useState(null);

  const config = {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  };

  useEffect(() => {
    axios.get("/items", config).then(res => setItems(res.data));
    axios.get("/users", config).then(res => setUsers(res.data));
  }, [newItem, newUser]);

  const handleAddItem = async () => {
    try {
      await axios.post("/items", newItem, config);
      setNewItem({ name: "", price: 0, category: "", description: "", seller: "", image: "" });
      setSuccess("Item added successfully.");
    } catch (error) {
      setError("Failed to add item. Please check the input fields.");
      console.error("Error adding item:", error);
    }
  };

  const handleDeleteItem = async () => {
    try {
      await axios.delete(`/items/${confirmDeleteItemId}`, config);
      setItems(items.filter(item => item._id !== confirmDeleteItemId));
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setConfirmDeleteItemId(null);
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post("/users", newUser);
      setUsers([...users, newUser]);
      setNewUser({ username: "", password: "" });
      setSuccess("User added successfully.");
    } catch (error) {
      setError("Failed to add user. Please check the input fields.");
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`/users/${confirmDeleteUsername}`, config);
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
      <Typography variant="h6">Add New Item</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField label="Name" fullWidth margin="normal" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
          <TextField label="Price" fullWidth margin="normal" type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={newItem.category}
              label="Category"
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            >
              <MenuItem value="Vinyls">Vinyls</MenuItem>
              <MenuItem value="Antique Furniture">Antique Furniture</MenuItem>
              <MenuItem value="GPS Sport Watches">GPS Sport Watches</MenuItem>
              <MenuItem value="Running Shoes">Running Shoes</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Description" fullWidth margin="normal" multiline rows={3} value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
          <TextField label="Seller" fullWidth margin="normal" value={newItem.seller} onChange={(e) => setNewItem({ ...newItem, seller: e.target.value })} />
          <TextField label="Image URL" fullWidth margin="normal" value={newItem.image} onChange={(e) => setNewItem({ ...newItem, image: e.target.value })} />
          <Button variant="contained" onClick={handleAddItem}>Add Item</Button>
        </Grid>
      </Grid>

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
      <Typography variant="h6">Add New User</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <TextField fullWidth label="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
        </Grid>
        <Grid item xs={4}>
          <TextField fullWidth type="password" label="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" onClick={handleAddUser}>Add User</Button>
        </Grid>
      </Grid>

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
