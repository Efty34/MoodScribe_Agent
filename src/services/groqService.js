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
            "You are a recommendation system that returns ONLY valid JSON responses. Never include any explanations, comments, markdown formatting, or text before/after the JSON. Your response must start with { and end with }. All strings must be properly escaped and all arrays must be properly formatted with commas between elements.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 1.5,
      max_tokens: 1000,
    });

    const responseContent = completion.choices[0].message.content;

    // Clean the response: remove any non-JSON content
    let cleanJson = responseContent
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
      .replace(/\\[rnt]/g, " ") // Replace escape sequences with space
      .replace(/```json/gi, "") // Remove markdown code blocks if present
      .replace(/```/g, "")
      .replace(/\*\*/g, "") // Remove bold markdown
      .replace(/\*/g, "") // Remove italic markdown
      .trim();

    // Try to find JSON content between curly braces if there's surrounding text
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }

    // Additional cleaning for common issues
    cleanJson = cleanJson
      .replace(/,\s*}/g, "}") // Remove trailing commas before closing braces
      .replace(/,\s*]/g, "]") // Remove trailing commas before closing brackets
      .replace(/[\r\n\t]/g, " ") // Replace line breaks and tabs with spaces
      .replace(/\s+/g, " ") // Normalize multiple spaces to single space
      .trim();

    try {
      // Try to parse the JSON
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
      console.error("JSON parsing error:", parseError.message);
      console.error("Original response:", responseContent);
      console.error("Cleaned JSON content:", cleanJson);

      // Try to fix common JSON issues and parse again
      try {
        let fixedJson = cleanJson;

        // Fix missing quotes around property names
        fixedJson = fixedJson.replace(
          /([{,]\s*)([a-zA-Z][a-zA-Z0-9_]*)\s*:/g,
          '$1"$2":'
        );

        // Fix single quotes to double quotes
        fixedJson = fixedJson.replace(/'/g, '"');

        // Remove any duplicate commas
        fixedJson = fixedJson.replace(/,+/g, ",");

        // Try parsing the fixed JSON
        const parsedResponse = JSON.parse(fixedJson);
        console.log("Successfully parsed fixed JSON");
        return parsedResponse;
      } catch (secondParseError) {
        console.error(
          "Failed to parse even after fixes:",
          secondParseError.message
        );
        throw new Error(
          `Invalid JSON response from Groq: ${
            parseError.message
          }. Original response: ${responseContent.substring(0, 500)}...`
        );
      }
    }
  } catch (error) {
    console.error("Error in Groq service:", error);
    throw error;
  }
}

module.exports = {
  getGroqRecommendations,
};
