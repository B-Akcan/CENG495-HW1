import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {Typography,Box,Card,CardContent,TextField,Button,Rating,Divider,Alert} from "@mui/material";

const ItemPage = ({auth}) => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState([]);

  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");

  const [ratingSuccess, setRatingSuccess] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`https://ceng-495-hw-1-steel.vercel.app/items/${id}`).then((res) => setItem(res.data));
    axios.get(`https://ceng-495-hw-1-steel.vercel.app/items/${id}/ratings`).then((res) => setRatings(res.data));
    axios.get(`https://ceng-495-hw-1-steel.vercel.app/items/${id}/reviews`).then((res) => setReviews(res.data));
  }, [id]);

  const setRatingsHelper = (data) => {
    const newRatings = ratings
    const exists = newRatings.filter(r => r.username === data.username).length === 1
    if (exists) {
      for (let i=0; i<newRatings.length; i++) {
        if (newRatings[i].username === data.username) {
          newRatings[i] = data
          break
        }
      }
    } else {
      newRatings.push(data)
    }
    
    return newRatings
  }

  const handleSubmitRating = async () => {
    if (!auth.user) return setError("You must be logged in to rate.");
    try {
      const res = await axios.put(
        `https://ceng-495-hw-1-steel.vercel.app/items/${id}/ratings`,
        { rating: newRating },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setRatings(setRatingsHelper(res.data));
      setNewRating(0);
      setRatingSuccess("Rating submitted!");
      setError(null);
    } catch {
      setError("Failed to submit rating.");
    }
  };

  const setReviewsHelper = (data) => {
    const newReviews = reviews
    const exists = newReviews.filter(r => r.username === data.username).length === 1
    if (exists) {
      for (let i=0; i<newReviews.length; i++) {
        if (newReviews[i].username === data.username) {
          newReviews[i] = data
          break
        }
      }
    } else {
      newReviews.push(data)
    }
    
    return newReviews
  }

  const handleSubmitReview = async () => {
    if (!auth.user) return setError("You must be logged in to review.");
    try {
      const res = await axios.put(
        `https://ceng-495-hw-1-steel.vercel.app/items/${id}/reviews`,
        { review: newReview },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setReviews(setReviewsHelper(res.data));
      setNewReview("");
      setReviewSuccess("Review submitted!");
      setError(null);
    } catch {
      setError("Failed to submit review.");
    }
  };

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

  if (!item) return <Typography>Loading...</Typography>;

  return (
    <Box mt={4}>
      {item && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h4">{item.name}</Typography>
            <Typography variant="h5">Sold by: {item.seller}</Typography>
            {item.image && (
              <Box
                component="img"
                src={item.image}
                alt={item.name}
                sx={{
                  width: "100%",
                  maxWidth: 400,
                  height: "auto",
                  borderRadius: 2,
                  mt: 2,
                  mb: 2,
                }}
              />
            )}
            <Typography variant="body1" color="textSecondary" mb={1}>
              {item.description}
            </Typography>

            <Typography variant="h6" color="primary">
              ${item.price?.toFixed(2)}
            </Typography>

            {item.batteryLife && (
              <Typography variant="body2">🔋 Battery Life: {item.batteryLife} hours</Typography>
            )}
            {item.age && (
              <Typography variant="body2">📅 Age: {item.age} years</Typography>
            )}
            {item.size && (
              <Typography variant="body2">📏 Size: {item.size}</Typography>
            )}
            {item.material && (
              <Typography variant="body2">🧵 Material: {item.material}</Typography>
            )}

            <Box mt={2}>
              <Rating value={averageRating} readOnly precision={0.5} max={10} />
              <Typography variant="body2" color="textSecondary">
                Average: {averageRating.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ({ratings.length} ratings)
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Divider sx={{ my: 4 }} />

      {reviews && reviews.length !== 0 && (
        <Typography variant="h5" gutterBottom>
          Reviews
        </Typography>
      )}

      {reviews.map((review, idx) => (
        <Card key={idx} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2">{review.username}</Typography>
            <Typography variant="body2">{review.review}</Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(review.createdAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {auth.user && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6">Rate This Item</Typography>
          {ratingSuccess && <Alert severity="success">{ratingSuccess}</Alert>}
          <Rating
            value={newRating}
            onChange={(e, val) => setNewRating(val)}
            sx={{ mt: 1 }}
            max={10}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            disabled={newRating === 0}
            onClick={handleSubmitRating}
          >
            Submit Rating
          </Button>

          <Divider sx={{ my: 4 }} />
          <Typography variant="h6">Leave a Review</Typography>
          {reviewSuccess && <Alert severity="success">{reviewSuccess}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Comment"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            disabled={!newReview}
            onClick={handleSubmitReview}
          >
            Submit Review
          </Button>
        </>
      )}
    </Box>
  );
};

export default ItemPage;