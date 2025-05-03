import React, { useState } from "react";
import {Container,Typography,TextField,Button,Grid,MenuItem,Select,InputLabel,FormControl,Snackbar,Alert} from "@mui/material";
import axios from "axios";

const NewItem = ({ auth }) => {
  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    category: "",
    description: "",
    seller: "",
    image: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const config = {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  };

  const handleAddItem = async () => {
    try {
      await axios.post("https://ceng-495-hw-1-steel.vercel.app/items", newItem, config);
      setNewItem({ name: "", price: 0, category: "", description: "", seller: "", image: "" });
      setSuccess("Item added successfully.");
    } catch (error) {
      setError("Failed to add item. Please check the input fields.");
      console.error("Error adding item:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Create New Item</Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <TextField
            label="Price"
            fullWidth
            margin="normal"
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
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
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <TextField
            label="Seller"
            fullWidth
            margin="normal"
            value={newItem.seller}
            onChange={(e) => setNewItem({ ...newItem, seller: e.target.value })}
          />
          <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            value={newItem.image}
            onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
          />
          <Button variant="contained" onClick={handleAddItem}>Add Item</Button>
        </Grid>
      </Grid>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>
    </Container>
  );
};

export default NewItem;
