import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useConfig } from "../context/ConfigContext";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import ListFeedbacks from "./ListFeedbacks";

function AdminPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [matchSuccess, setMatchSuccess] = useState("");
  const [matchError, setMatchError] = useState("");
  const [openDeleteBidsDialog, setOpenDeleteBidsDialog] = useState(false);
  const [openDeleteMatchesDialog, setOpenDeleteMatchesDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [changeTimeError, setChangeTimeError] = useState("");
  const [changeTimeSuccess, setChangeTimeSuccess] = useState("");

  const config = useConfig();
  const { authToken } = useAuth();
  dayjs.extend(utc);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.REACT_APP_API_URL}/v1/faq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ question, answer }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setSuccess("");
      } else {
        setSuccess(data.message);
        setError("");

        setQuestion("");
        setAnswer("");
      }
    } catch (error) {
      setError("An error occurred");
      setSuccess("");
    }
  };

  const runMatches = async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/bids/match`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMatchError(data.message);
        setMatchSuccess("");
      } else {
        setMatchSuccess(data.message);
        setMatchError("");
      }
    } catch (error) {
      setMatchError("An error occurred");
      setMatchSuccess("");
    }
  };

  const handleDeleteBids = async () => {
    try {
      const response = await fetch(`${config.REACT_APP_API_URL}/v1/bids`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        console.log("Error deleting bids");
      } else {
        alert("All bids deleted");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMatches = async () => {
    try {
      const response = await fetch(`${config.REACT_APP_API_URL}/v1/match`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        console.log("Error deleting matches");
      } else {
        alert("All matches deleted");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateMatchTime = async (e) => {
    e.preventDefault();

    if (!selectedDay || !selectedTime) {
      setChangeTimeError("Enter a day and time");
      return;
    }

    const formattedDate = dayjs().day(selectedDay).format("YYYY-MM-DD");
    const formattedTime = selectedTime.format("HH:mm") + ":00";
    const targetDate = new Date(formattedDate + "T" + formattedTime);
    const matchTime =
      targetDate.getUTCDay() * 86400 +
      targetDate.getUTCHours() * 3600 +
      targetDate.getUTCMinutes() * 60;

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/settings/set-scheduled-match-time`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            matchTime: matchTime,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setChangeTimeError(data.message);
        setChangeTimeSuccess("");
      } else {
        setChangeTimeSuccess(data.message);
        setChangeTimeError("");
      }
    } catch (error) {
      setChangeTimeError("An error occurred");
      setChangeTimeSuccess("");
    }
  };

  const handleOpenDeleteBidsDialog = () => {
    setOpenDeleteBidsDialog(true);
  };

  const handleCloseDeleteBidsDialog = () => {
    setOpenDeleteBidsDialog(false);
  };

  const handleOpenDeleteMatchesDialog = () => {
    setOpenDeleteMatchesDialog(true);
  };

  const handleCloseDeleteMatchesDialog = () => {
    setOpenDeleteMatchesDialog(false);
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  return (
    <Paper elevation={3} style={{ padding: "2rem" }}>
      <h3>Post New FAQ</h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <TextField
          label="Question"
          variant="outlined"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <TextField
          label="Answer"
          variant="outlined"
          multiline
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Button type="submit" variant="contained" color="primary">
          Post FAQ
        </Button>
      </form>
      <Divider style={{ marginTop: "2rem", marginBottom: "2rem" }}></Divider>
      <h3>Run Matches</h3>
      <Button
        variant="contained"
        color="primary"
        onClick={runMatches}
        style={{ marginBottom: "1rem" }}
      >
        Run Matches
      </Button>
      {matchError && <Alert severity="error">{matchError}</Alert>}
      {matchSuccess && <Alert severity="success">{matchSuccess}</Alert>}
      <Divider style={{ marginTop: "2rem", marginBottom: "2rem" }}></Divider>
      <h3>Change Match Day and Time</h3>
      <form onSubmit={updateMatchTime}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="day-label">Day</InputLabel>
              <Select
                labelId="day-label"
                id="day"
                value={selectedDay}
                onChange={handleDayChange}
              >
                <MenuItem value="1">Monday</MenuItem>
                <MenuItem value="2">Tuesday</MenuItem>
                <MenuItem value="3">Wednesday</MenuItem>
                <MenuItem value="4">Thursday</MenuItem>
                <MenuItem value="5">Friday</MenuItem>
                <MenuItem value="6">Saturday</MenuItem>
                <MenuItem value="0">Sunday</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl fullWidth>
                <TimePicker
                  label="Time"
                  value={selectedTime}
                  onChange={handleTimeChange}
                />
              </FormControl>
            </LocalizationProvider>
          </Grid>
        </Grid>
        {changeTimeError && <Alert severity="error">{changeTimeError}</Alert>}
        {changeTimeSuccess && (
          <Alert severity="success">{changeTimeSuccess}</Alert>
        )}
        <div className="btn-wrapper">
          <Button variant="contained" color="primary" type="submit">
            Change Match Time
          </Button>
        </div>
      </form>
      <Divider style={{ marginTop: "2rem", marginBottom: "2rem" }}></Divider>
      <h3>Reset Functions</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDeleteBidsDialog}
        >
          Delete Bids
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDeleteMatchesDialog}
        >
          Delete Matches
        </Button>
      </div>
      <Divider style={{ marginTop: "2rem", marginBottom: "2rem" }}></Divider>
      <ListFeedbacks />

      {/* Delete Bids Dialog */}
      <Dialog
        open={openDeleteBidsDialog}
        onClose={handleCloseDeleteBidsDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete All Bids"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteBidsDialog}>Cancel</Button>
          <Button
            onClick={() => {
              handleDeleteBids();
              handleCloseDeleteBidsDialog();
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Matches Dialog */}
      <Dialog
        open={openDeleteMatchesDialog}
        onClose={handleCloseDeleteMatchesDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete All Matches"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteMatchesDialog}>Cancel</Button>
          <Button
            onClick={() => {
              handleDeleteMatches();
              handleCloseDeleteMatchesDialog();
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default AdminPage;
