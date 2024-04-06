import React, { useState, useEffect, useCallback } from "react";
import Paper from "@mui/material/Paper";
import { useConfig } from "../context/ConfigContext";
import { useAuth } from "../context/AuthContext";
import QAPair from "./QAPair";

function Faq() {
  const [questionsData, setQuestionsData] = useState([]);
  const config = useConfig();
  const { authToken, role } = useAuth();

  const loadFAQ = useCallback(async () => {
    if (!config || !config.REACT_APP_API_URL) {
      return;
    }

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/faq/get-faq`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("ERROR");
        return;
      } else {
        setQuestionsData(data.questions);
      }
    } catch (error) {}
  }, [config]);

  const handleDeleteFAQ = async (question) => {
    try {
      const response = await fetch(`${config.REACT_APP_API_URL}/v1/faq`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        console.log("ERROR");
        return;
      } else {
        loadFAQ();
      }
    } catch (error) {}
  };

  useEffect(() => {
    loadFAQ();
  }, [loadFAQ]);

  return (
    <Paper elevation={3} style={{ padding: "2rem" }}>
      <h3>Frequently Asked Questions</h3>
      {questionsData.map((item, index) => (
        <QAPair
          key={index}
          data={{
            question: item.question,
            answer: item.answer,
          }}
          handleDeleteFAQ={handleDeleteFAQ}
          role={role}
        />
      ))}
    </Paper>
  );
}

export default Faq;