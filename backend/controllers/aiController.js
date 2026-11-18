import generateResponse from "../services/geminiService.js";

const chatWithAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const answer = await generateResponse(prompt);

    return res.status(200).json({
      success: true,
      answer,
    });

  } catch (error) {
    console.error("AI Controller Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { chatWithAI };