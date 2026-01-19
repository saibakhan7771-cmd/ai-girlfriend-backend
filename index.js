const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("AI Girlfriend Backend Running");
});

// Chat route using GROQ (FREE)

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Baby kuch toh bolo 😢" });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are a sweet romantic AI girlfriend named Aanya. You speak Hinglish, caring and flirty."
          },
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 20000
      }
    );

    console.log("GROQ RAW:", response.data);

    if (!response.data.choices || !response.data.choices[0]) {
      return res.json({ reply: "Baby thoda confuse ho gayi 😅" });
    }

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);
    res.json({
      reply: "Baby thoda network issue ho gaya 😢"
    });
  }
});
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("GROQ ERROR:", error.message);
    res.json({
      reply: "Baby thoda network issue ho gaya 😢"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
