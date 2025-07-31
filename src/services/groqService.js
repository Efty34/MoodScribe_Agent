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
            'You are a recommendation system that MUST return ONLY valid JSON. CRITICAL RULES: 1) Response must start with { and end with }, 2) Use only simple ASCII characters in titles - NO special characters, quotes within quotes, or Unicode, 3) NO backslashes or escaped quotes in strings, 4) NO explanations or markdown, 5) Keep all titles simple and clean using only letters, numbers, spaces, hyphens, and periods. 6) NEVER use quotes inside string values, 7) NEVER use apostrophes or contractions, 8) Validate your JSON before responding. Example format: {"movies": ["Title One", "Title Two"]}',
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      max_tokens: 1200,
    });

    const responseContent = completion.choices[0].message.content;
    console.log("Raw Groq response:", responseContent);

    // Aggressive cleaning to handle malformed JSON
    let cleanJson = responseContent.trim();

    // Remove markdown formatting and any text before/after JSON
    cleanJson = cleanJson
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "");

    // Extract JSON object if there's surrounding text (do this early)
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }

    // Fix escaped quotes and backslashes - this is the main issue
    cleanJson = cleanJson
      .replace(/\\"/g, '"') // Replace \" with "
      .replace(/\\\\/g, "") // Remove double backslashes
      .replace(/\\'/g, "'") // Replace \' with '
      .replace(/\\u[0-9a-fA-F]{0,4}/g, "") // Remove Unicode escapes
      .replace(/\\(?!["\\/bfnrt])/g, "") // Remove invalid escape sequences
      // Fix strings with internal quotes - only in array values, more precise targeting
      .replace(
        /(\[\s*)"([^"]*)"([^"]*)"([^"]*)"(\s*[,\]])/g,
        (match, prefix, p1, p2, p3, suffix) => {
          const combined = (p1 + p2 + p3).replace(/"/g, "").trim();
          return `${prefix}"${combined}"${suffix}`;
        }
      );

    // Remove control characters and normalize whitespace
    cleanJson = cleanJson
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
      .replace(/[\r\n\t]/g, " ") // Replace line breaks and tabs with spaces
      .replace(/\s+/g, " ") // Normalize multiple spaces to single space
      .trim();

    // Fix common JSON syntax issues
    cleanJson = cleanJson
      .replace(/,\s*}/g, "}") // Remove trailing commas before closing braces
      .replace(/,\s*]/g, "]") // Remove trailing commas before closing brackets
      .replace(/([{,]\s*)([a-zA-Z][a-zA-Z0-9_]*)\s*:/g, '$1"$2":') // Add quotes to property names
      .replace(/'/g, '"') // Convert single quotes to double quotes
      .replace(/,+/g, ",") // Remove duplicate commas
      .replace(/"\s*,\s*"/g, '", "') // Normalize spacing in arrays
      .replace(/"\s+"/g, '" "'); // Fix spacing between quotes

    console.log("Cleaned JSON:", cleanJson);

    try {
      const parsedResponse = JSON.parse(cleanJson);
      const validatedResponse = validateAndCleanResponse(parsedResponse);
      return validatedResponse;
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError.message);
      console.log("Attempting manual reconstruction...");

      // If JSON parsing fails, try to extract content manually
      const manualResponse = attemptManualParsing(responseContent);
      if (manualResponse) {
        return manualResponse;
      }

      // If all attempts fail, throw a more descriptive error
      throw new Error(
        `Failed to parse Groq response as valid JSON: ${parseError.message}`
      );
    }
  } catch (error) {
    console.error("Error in Groq service:", error);
    throw error;
  }
}

// Function to validate and clean the response structure
function validateAndCleanResponse(response) {
  // Clean strings to remove problematic characters
  const cleanString = (str) => {
    if (typeof str !== "string") return str;
    return str
      .replace(/[^\x20-\x7E]/g, "") // Keep only printable ASCII characters
      .replace(/\\+/g, "") // Remove backslashes
      .replace(/\s+/g, " ") // Normalize spaces
      .trim()
      .substring(0, 150); // Limit length
  };

  // Check if this is a category response
  if (response.category) {
    return response;
  }

  if (response.movies && Array.isArray(response.movies)) {
    response.movies = response.movies
      .map(cleanString)
      .filter((title) => title.length > 0)
      .slice(0, 10);
  }

  if (response.books && Array.isArray(response.books)) {
    response.books = response.books
      .map(cleanString)
      .filter((title) => title.length > 0)
      .slice(0, 10);
  }

  if (response.songs && Array.isArray(response.songs)) {
    response.songs = response.songs
      .map(cleanString)
      .filter((title) => title.length > 0)
      .slice(0, 10);
  }

  if (response.exercises && Array.isArray(response.exercises)) {
    response.exercises = response.exercises
      .map((exercise) => {
        if (typeof exercise === "object") {
          const cleanExercise = {};
          Object.keys(exercise).forEach((key) => {
            if (typeof exercise[key] === "string") {
              cleanExercise[key] = cleanString(exercise[key]);
            } else if (Array.isArray(exercise[key])) {
              cleanExercise[key] = exercise[key].map((item) =>
                typeof item === "string" ? cleanString(item) : item
              );
            } else {
              cleanExercise[key] = exercise[key];
            }
          });
          return cleanExercise;
        }
        return exercise;
      })
      .slice(0, 5);
  }

  return response;
}

// Function to attempt manual parsing when JSON.parse fails
function attemptManualParsing(content) {
  try {
    const result = {};

    // Try to extract arrays manually using regex
    const movieMatch = content.match(/"movies"\s*:\s*\[(.*?)\]/s);
    const bookMatch = content.match(/"books"\s*:\s*\[(.*?)\]/s);
    const songMatch = content.match(/"songs"\s*:\s*\[(.*?)\]/s);

    if (movieMatch) {
      const movies = extractArrayItems(movieMatch[1]);
      if (movies.length > 0) result.movies = movies.slice(0, 10);
    }

    if (bookMatch) {
      const books = extractArrayItems(bookMatch[1]);
      if (books.length > 0) result.books = books.slice(0, 10);
    }

    if (songMatch) {
      const songs = extractArrayItems(songMatch[1]);
      if (songs.length > 0) result.songs = songs.slice(0, 10);
    }

    if (Object.keys(result).length > 0) {
      return result;
    }
  } catch (error) {
    console.error("Manual parsing failed:", error);
  }

  return null;
}

// Function to extract array items from a string
function extractArrayItems(arrayContent) {
  const items = [];
  const matches = arrayContent.match(/"([^"]{1,150})"/g);
  if (matches) {
    matches.forEach((match) => {
      const clean = match
        .replace(/"/g, "")
        .replace(/[^\x20-\x7E]/g, "") // Keep only ASCII
        .replace(/\\+/g, "") // Remove backslashes
        .trim();
      if (clean.length > 0 && clean.length < 150) {
        items.push(clean);
      }
    });
  }
  return items;
}

module.exports = {
  getGroqRecommendations,
};
