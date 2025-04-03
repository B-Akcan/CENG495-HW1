import React, { useState, useEffect } from "react";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

function HomePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get("/items").then((response) => {
      setItems(response.data);
    });
  }, []);

  if (!Array.isArray(items)) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={3} sx={{ mt: 3 }}>
      {items.map((item) => (
        <Grid item key={item._id} xs={12} sm={6} md={4} lg={3}>
          <Card>
            <Link to={`/items/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.name}
              />
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body1">${item.price}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Sold by: {item.seller}
                </Typography>
              </CardContent>
            </Link>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default HomePage;