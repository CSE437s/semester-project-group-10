import React, { useState, useEffect, useCallback } from "react";
import { useConfig } from "../../context/ConfigContext";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import moment from "moment-timezone";

function formatDate(isoString) {
  const date = moment.utc(isoString);
  return date.local().format("MM/DD/YYYY");
}

function ListMatch() {
  const [matches, setMatches] = useState([]);
  const config = useConfig();
  const { authToken } = useAuth();

  const fetchMatches = useCallback(async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/match/get-match`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data) {
        setMatches(data.matches);
      }
    } catch (error) {}
  }, [authToken, config]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <Box>
      <p className="text-xl font-bold my-4 text-gray-900">Matches</p>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Buyer</TableCell>
              <TableCell>Seller</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{match.buyerid}</TableCell>
                <TableCell>{match.sellerid}</TableCell>
                <TableCell>{match.price}</TableCell>
                <TableCell>{formatDate(match.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ListMatch;
