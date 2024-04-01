import React, { useState, useEffect } from "react";
import { Button, TextField, Alert, Box } from "@mui/material";
import { useConfig } from "../context/ConfigContext";
import { useAuth } from "../context/AuthContext";

function PhoneNum() {
  const config = useConfig();
  const { authToken } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, "");

    const chars = numbers.split("");
    let formattedNumber = "";

    for (let i = 0; i < chars.length; i++) {
      if (i === 3 || i === 6) {
        formattedNumber += "-";
      }
      formattedNumber += chars[i];
    }

    return formattedNumber.slice(0, 12);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phoneNum = data.get("phoneNum");

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/users/phone-num`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ phoneNum }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setError("");
        setPhoneNumber(phoneNum);
        setHasPhoneNumber(true);
      } else {
        setError(data.message);
        setSuccess("");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      setSuccess("");
    }
  };

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const response = await fetch(
          `${config.REACT_APP_API_URL}/v1/users/phone-num`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setPhoneNumber(data.phoneNum);
          setHasPhoneNumber(true);
        }
      } catch (error) {}
    };
    fetchPhoneNumber();
  }, [config, authToken]);

  return (
    <div>
      <h4>Phone Number</h4>
      {hasPhoneNumber ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>Your phone Number:</p>
          <p>{phoneNumber}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              label="Phone Number"
              variant="outlined"
              name="phoneNum"
              onChange={(e) =>
                setPhoneNumber(formatPhoneNumber(e.target.value))
              }
              value={phoneNumber}
              sx={{ flexGrow: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              add phone number
            </Button>
          </Box>
        </form>
      )}
      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ marginTop: 2 }}>
          {success}
        </Alert>
      )}
    </div>
  );
}

export default PhoneNum;
