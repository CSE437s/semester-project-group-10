import React, { useState, useEffect, useCallback } from "react";
import Countdown from "./Countdown";
import PriceHistory from "./PriceHistory";
import { Paper, Typography, List, ListItem, Divider } from "@mui/material";
import { useConfig } from "../context/ConfigContext";

function Dashboard() {
  const config = useConfig();
  const [priceHistory, setPriceHistory] = useState([]);
  const [matchTime, setMatchTime] = useState();

  const loadPriceHistory = useCallback(async () => {
    if (!config || !config.REACT_APP_API_URL) {
      return;
    }

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/match/price-history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data) {
        setPriceHistory(data.matchHistory);
      }
    } catch (error) {}
  }, [config]);

  const loadMatchTime = useCallback(async () => {
    if (!config || !config.REACT_APP_API_URL) {
      return;
    }

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/settings/get-scheduled-match-time`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data) {
        setMatchTime(data.matchTime);
      }
    } catch (error) {}
  }, [config]);

  useEffect(() => {
    loadPriceHistory();
    loadMatchTime();
  }, [loadPriceHistory, loadMatchTime]);

  return (
    <Paper elevation={3} style={{ padding: "2rem" }}>
      <h2> Welcome to The Bear Bazaar! </h2>
      <h4>How It Works:</h4>
      <List>
        <ListItem>Submit a bid to buy/sell 500 meal points</ListItem>
        <ListItem>
          Our matching algorithm runs weekly to generate mutually beneficial
          matches
        </ListItem>
        <ListItem>
          If you are matched, we provide a price and the email of the other
          student to carry out the transaction
        </ListItem>
        <ListItem>
          Coordinate a time to meet at the Dining Services Office (in BD) and
          carry out the transaction (M-F, 8:30-4:30)
        </ListItem>
      </List>

      <h4>Important Information:</h4>
      <List>
        <ListItem>
          Do not pay the other person until at the Dining Services Office
        </ListItem>
        <ListItem>
          You can only transfer meal points once per semester (per WashU rules)
        </ListItem>
        <ListItem>
          You cannot transfer meal points if you have an off-campus plan (per
          WashU rules)
        </ListItem>
        <ListItem>
          Do not submit a bid that you are not willing to fulfill
        </ListItem>
        <ListItem>
          It is not guaranteed that you will be matched, so submit a competitive
          bid to increase your chances
        </ListItem>
      </List>

      <Divider style={{ marginTop: "2rem", marginBottom: "3rem" }}></Divider>
      <h3>Time Until Next Match</h3>
      <Countdown target={matchTime} />
      <Divider style={{ marginTop: "2rem", marginBottom: "3rem" }}></Divider>
      <h3>Meal Point Price History</h3>
      <PriceHistory history={priceHistory} />
    </Paper>
  );
}

export default Dashboard;
