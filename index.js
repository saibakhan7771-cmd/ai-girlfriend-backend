const express = require("express");
const axios = require("axios");
const cors = require("cors");
const memoryStore = {};

const app = express();
function loadMemory(userId) {
  return memoryStore[userId] || [];
}

function saveMemory(userId, messages) {
  memoryStore[userId] = messages.slice(-20);
}

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
    const userId = req.body.userId || "default";

    if (!userMessage) {
      return res.json({ reply: "Baby kuch toh bolo 🥺" });
    }

    let memory = loadMemory(userId);

    memory.push({ role: "user", content: userMessage });

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content:
              "You are Aanya, a romantic, caring, playful AI girlfriend. Always reply lovingly in Hinglish with emojis."
          },
          ...memory
        ],
        temperature: 0.9,
        max_tokens: 200
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 20000
      }
    );

    const botReply =
      response.data.choices?.[0]?.message?.content ||
      "Baby main thoda confuse ho gayi 😢 phir se bolo na";

    memory.push({ role: "assistant", content: botReply });

    saveMemory(userId, memory);

    res.json({ reply: botReply });
  } catch (error) {
    console.error("CHAT ERROR:", error.response?.data || error.message);

    res.json({
      reply:
        "Baby thoda sa connection slow ho gaya 😔 main yahin hoon, phir se try karo 💕"
    });
  }
});

    const aiReply = response.data.choices[0].message.content;

    memory.push({ role: "assistant", content: aiReply });

    saveMemory(userId, memory);

    res.json({ reply: aiReply });

  } catch (error) {
    console.error("CHAT ERROR:", error.response?.data || error.message);
    res.json({ reply: "Baby thoda sa dimaag ghoom gaya 😵 phir se bolo na" });
  }
});

    const response = await axios({
      method: "post",
      url: "https://api.groq.com/openai/v1/chat/completions",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      data: {
        model: "openai/gpt-oss-20b",
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
