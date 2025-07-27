import { useState } from "react";
import {Container,Typography,TextField,Button,Grid,MenuItem,Select,InputLabel,FormControl,Snackbar,Alert} from "@mui/material";
import axios from "axios";

const NewItem = () => {
  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    category: "",
    description: "",
    seller: "",
    image: "",
  });

  const [batteryLife, setBatteryLife] = useState("");
  const [age, setAge] = useState("");
  const [size, setSize] = useState("");
  const [material, setMaterial] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const showBatteryLife = newItem.category === "GPS Sport Watches";
  const showAge = newItem.category === "Antique Furniture" || newItem.category === "Vinyls";
  const showSize = newItem.category === "Running Shoes";
  const showMaterial = newItem.category === "Antique Furniture" || newItem.category === "Running Shoes";

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleAddItem = async () => {
    try {
      const requestBody = newItem

      if (showBatteryLife && batteryLife) requestBody.batteryLife = parseInt(batteryLife);
      if (showAge && age) requestBody.age = parseInt(age);
      if (showSize && size) requestBody.size = parseInt(size);
      if (showMaterial && material.trim()) requestBody.material = material.trim();

      await axios.post("https://ceng-495-hw-1-steel.vercel.app/items", requestBody, config);
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
            required
            fullWidth
            margin="normal"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <TextField
            label="Price"
            required
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

          {showBatteryLife && (
            <TextField
              label="Battery Life (hours, minimum 1)"
              type="number"
              inputProps={{ min: 1 }}
              value={batteryLife}
              onChange={(e) => setBatteryLife(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
          )}

          {showAge && (
            <TextField
              label="Age (years, minimum 0)"
              type="number"
              inputProps={{ min: 0 }}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
          )}

          {showSize && (
            <TextField
              label="Size (minimum 30, maximum 50)"
              type="number"
              inputProps={{ min: 30, max: 50 }}
              value={size}
              onChange={(e) => setSize(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
          )}

          {showMaterial && (
            <TextField
              label="Material"
              inputProps={{ maxLength: 30 }}
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
          )}

          <TextField
            label="Description"
            required
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <TextField
            label="Seller"
            required
            fullWidth
            margin="normal"
            value={newItem.seller}
            onChange={(e) => setNewItem({ ...newItem, seller: e.target.value })}
          />
          <TextField
            label="Image URL"
            required
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
