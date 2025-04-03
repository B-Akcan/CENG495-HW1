import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, Button } from "@mui/material";
import axios from "axios";

const ItemPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios
      .get(`/items/${id}`)
      .then((response) => {
        setItem(response.data);
      })
      .catch((error) => {
        console.error("Error fetching item data:", error);
      });
  }, [id]);

  if (!item) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Box>
        <Typography variant="h4">{item.name}</Typography>
        <Typography variant="h6">Price: ${item.price}</Typography>
        <Typography>{item.description}</Typography>
        <Typography variant="subtitle1">Average Rating: {item.averageRating}</Typography>
        <img src={item.image} alt={item.name} style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }} />
        <Button variant="contained" color="primary">
          Add to Cart
        </Button>
      </Box>
    </Container>
  );
};

export default ItemPage;