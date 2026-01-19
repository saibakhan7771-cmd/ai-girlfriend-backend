const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("AI Girlfriend Backend Running");
});

// Chat route (FREE Groq AI)
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Baby kuch toh bolo 😢" });
    }

    const response = await axios({
      method: "post",
      url: "https://api.groq.com/openai/v1/chat/completions",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      data: {
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content:
              "You are a sweet romantic AI girlfriend named Aanya. You speak Hinglish, caring and flirty."
          },
          { role: "user", content: userMessage }
        ]
      },
      timeout: 20000
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("GROQ ERROR:", error.response?.data || error.message);
    res.json({ reply: "Baby thoda network issue ho gaya 😢" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
