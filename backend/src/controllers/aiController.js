import axios from 'axios';
import dotenv from 'dotenv'

dotenv.config();

export const generateAISuggestions = async (req, res) => {
  try {
    const expenses = req.body.expenses;

    const prompt = `
You are a financial assistant. I the following expenses:

${JSON.stringify(expenses.slice(0, 20), null, 2)}

Suggest 2-3 specific and smart ways to save money based on my spending patterns. Do not use any currency. Limit each point to two lines. 
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );


    const aiMessage = response.data.choices[0].message.content.trim();

    // ✨ Enforce bullet formatting and heading
    const formattedText = `💡 **AI Suggestions:**\n` + aiMessage
      .replace(/^\d+[.)]\s+/gm, '🔹') // 1. → • 
      .replace(/^-\s+/gm, '🔹')      // - → • 
      .replace(/^•\s{2,}/gm, '🔹')   // normalize spacing
      .trim();

    res.json({ suggestions: formattedText });

  } catch (error) {
    console.error("AI generation error:", error.response?.data || error.message);
    res.status(500).json({ message: "AI suggestion generation failed." });
  }
};
