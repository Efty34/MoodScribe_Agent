const { Groq } = require('groq-sdk');

// Create the Groq instance after checking for API key
function createGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured in environment variables');
  }
  return new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
}

async function getGroqRecommendations(prompt) {
  try {
    const groq = createGroqClient();
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a recommendation system. Always return clean JSON without comments or explanations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1000
    });

    const responseContent = completion.choices[0].message.content;
    
    // Remove any comments and clean the JSON
    const cleanJson = responseContent.replace(/\/\/.*$/gm, '')  // Remove single-line comments
                                   .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove multi-line comments
                                   .trim();
    
    const parsedResponse = JSON.parse(cleanJson);
    
    // Check if the response has any of the expected keys
    if (!parsedResponse.movies && !parsedResponse.books && !parsedResponse.songs) {
      throw new Error('Response does not contain movies, books, or songs array');
    }

    // Validate that the found key contains an array
    const key = parsedResponse.movies ? 'movies' : 
                parsedResponse.books ? 'books' : 'songs';
    
    if (!Array.isArray(parsedResponse[key])) {
      throw new Error(`${key} is not an array in the response`);
    }

    return parsedResponse;
  } catch (error) {
    console.error('Error in Groq service:', error.message);
    throw error;
  }
}

module.exports = {
  getGroqRecommendations
}; 