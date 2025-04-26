const { Groq } = require("groq-sdk");

// Create the Groq instance after checking for API key
function createGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured in environment variables");
  }
  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

async function getGroqRecommendations(prompt) {
  try {
    const groq = createGroqClient();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a recommendation system. Always return valid JSON without any explanations, comments, or special characters. Ensure all strings are properly escaped.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseContent = completion.choices[0].message.content;

    // Clean the response: remove any non-JSON content
    let cleanJson = responseContent
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
      .replace(/\\[rnt]/g, " ") // Replace escape sequences with space
      .replace(/```json/g, "") // Remove markdown code blocks if present
      .replace(/```/g, "")
      .trim();

    // Try to find JSON content between curly braces if there's surrounding text
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }

    try {
      const parsedResponse = JSON.parse(cleanJson);

      // Check if this is a category response
      if (parsedResponse.category) {
        return parsedResponse;
      }

      // Validate recommendation response structure
      if (
        !parsedResponse.movies &&
        !parsedResponse.books &&
        !parsedResponse.songs &&
        !parsedResponse.exercises
      ) {
        throw new Error(
          "Response does not contain any valid recommendation arrays"
        );
      }

      return parsedResponse;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Cleaned JSON content:", cleanJson);
      throw new Error(`Invalid JSON response from Groq: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Error in Groq service:", error);
    throw error;
  }
}

module.exports = {
  getGroqRecommendations,
};
