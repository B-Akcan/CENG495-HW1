import React, { useState, useEffect } from "react";
import { Grid, Card, CardMedia, CardContent, Typography, Box, FormControl, Select, MenuItem, InputLabel, CircularProgress, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

function HomePage() {
  const categories = [
    "Vinyls",
    "Antique Furniture",
    "GPS Sport Watches",
    "Running Shoes",
  ];

  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://ceng-495-hw-1-steel.vercel.app/items")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch items:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "70vh" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" mt={2}>Loading items...</Typography>
      </Stack>
    );
  }

  return (
    <Box mt={4}>
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Filter by Category</InputLabel>
        <Select
          value={selectedCategory}
          label="Filter by Category"
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={2}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              <Link to={`/items/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                {item.image && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image}
                    alt={item.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${item.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {item.category}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HomePage;