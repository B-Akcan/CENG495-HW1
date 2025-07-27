import React, { useEffect, useState } from "react";
import {Box,Typography,Card,CardContent,List,ListItem,ListItemText,Rating,Divider,Stack,CircularProgress} from "@mui/material";
import axios from "axios";

function UserPage() {
  const [userRatings, setUserRatings] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const phoneNumber = localStorage.getItem("phoneNumber");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const [ratingsRes, reviewsRes] = await Promise.all([
          axios.get(`https://ceng-495-hw-1-steel.vercel.app/users/${user}/ratings`, config),
          axios.get(`https://ceng-495-hw-1-steel.vercel.app/users/${user}/reviews`, config),
        ]).finally(() => {
          setLoading(false);
        })
        setUserRatings(ratingsRes.data);
        setUserReviews(reviewsRes.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [token]);

  if (loading) {
      return (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "70vh" }}>
          <CircularProgress size={60} />
          <Typography variant="h6" mt={2}>Loading profile...</Typography>
        </Stack>
      );
    }

  const averageRating =
    userRatings.length > 0
      ? userRatings.reduce((acc, r) => acc + r.rating, 0) / userRatings.length
      : null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        👤 User Profile
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Username: {user}</Typography>
          <Typography variant="h6">Phone Number: {phoneNumber}</Typography>
          <Typography variant="body1" mt={2}>
            Average Rating Given:
          </Typography>
          {averageRating !== null ? (
            <>
              <Rating value={averageRating} precision={0.5} max={10} readOnly />
              <Typography variant="body2" color="textSecondary">
                Average: {averageRating.toFixed(2)}
              </Typography>
            </>
          ) : (
            <Typography variant="body2">No ratings yet.</Typography>
          )}
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        📝 Your Reviews
      </Typography>
      {userReviews.length > 0 ? (
        <List>
          {userReviews.map((review) => (
            <React.Fragment key={review._id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`${review.itemName || "Unknown Item"}`}
                  secondary={review.review}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography>No reviews written yet.</Typography>
      )}
    </Box>
  );
}

export default UserPage;