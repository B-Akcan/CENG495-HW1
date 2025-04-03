import React, { useState, useEffect } from "react";
import { Container, Typography, Button, TextField, Grid, Card, CardContent, CardActions } from "@mui/material";
import axios from "axios";

function AdminPage({ auth }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "", description: "", seller: "", image: "" });

  useEffect(() => {
    axios.get("/items").then((response) => {
      setItems(response.data);
    });
  }, []);

  const handleAddItem = async () => {
    try {
      await axios.post("/items", newItem, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setNewItem({ name: "", price: "", category: "", description: "", seller: "", image: "" });
      axios.get("/items").then((response) => setItems(response.data));
    } catch (error) {
      console.error("Failed to add item", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`/items/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Add New Item</Typography>
          <TextField label="Name" fullWidth margin="normal" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
          <TextField label="Price" fullWidth margin="normal" type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
          <TextField label="Category" fullWidth margin="normal" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} />
          <TextField label="Description" fullWidth margin="normal" multiline rows={3} value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
          <TextField label="Seller" fullWidth margin="normal" value={newItem.seller} onChange={(e) => setNewItem({ ...newItem, seller: e.target.value })} />
          <TextField label="Image URL" fullWidth margin="normal" value={newItem.image} onChange={(e) => setNewItem({ ...newItem, image: e.target.value })} />
          <Button variant="contained" color="primary" onClick={handleAddItem}>
            Add Item
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Manage Items</Typography>
          {items.map((item) => (
            <Card key={item._id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body1">Price: ${item.price}</Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteItem(item._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminPage;