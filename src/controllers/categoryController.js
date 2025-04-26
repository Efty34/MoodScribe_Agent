const { getGroqRecommendations } = require("../services/groqService");
const determineCategory = async (req, res) => {
  try {
    const { task } = req.body;

    if (!task || typeof task !== "string") {
      return res.status(400).json({
        error:
          'Invalid request. The "task" field is required and must be a string.',
      });
    }

    // Define categories and their associated keywords
    const categoryRules = {
      Work: [
        "email",
        "meeting",
        "project",
        "presentation",
        "client",
        "report",
        "deadline",
        "office",
        "work",
        "boss",
        "colleague",
      ],
      Personal: [
        "friend",
        "hobby",
        "self",
        "birthday",
        "personal",
        "journal",
        "family",
        "visit",
        "call",
        "relationship",
      ],
      Health: [
        "doctor",
        "gym",
        "meditation",
        "exercise",
        "medicine",
        "health",
        "appointment",
        "therapy",
        "dental",
        "mental",
        "physical",
      ],
      Finance: [
        "bank",
        "bill",
        "payment",
        "tax",
        "money",
        "budget",
        "invest",
        "financial",
        "insurance",
        "expense",
        "save",
      ],
      Shopping: [
        "buy",
        "shop",
        "purchase",
        "store",
        "order",
        "grocery",
        "mall",
        "online",
        "shopping",
        "item",
        "product",
      ],
      Education: [
        "study",
        "learn",
        "class",
        "course",
        "book",
        "read",
        "homework",
        "assignment",
        "education",
        "school",
        "exam",
        "university",
      ],
      Travel: [
        "trip",
        "flight",
        "hotel",
        "vacation",
        "booking",
        "pack",
        "passport",
        "travel",
        "destination",
        "tour",
        "journey",
      ],
      Home: [
        "clean",
        "repair",
        "organize",
        "house",
        "home",
        "laundry",
        "furniture",
        "decoration",
        "garden",
        "kitchen",
        "bedroom",
      ],
      Fitness: [
        "workout",
        "run",
        "jog",
        "cardio",
        "weight",
        "fitness",
        "training",
        "sport",
        "muscle",
        "swim",
        "exercise",
      ],
    };

    // Create prompt for Groq to categorize the task
    const prompt = `
            Analyze the following todo task and categorize it into one of these predefined categories: 
            Work, Personal, Health, Finance, Shopping, Education, Travel, Home, Fitness.
            
            If it doesn't match any specific category, assign it to "General".
            
            Task: "${task}"
            
            These are the category rules, but you need to apply semantic understanding beyond exact keyword matching:
            ${Object.entries(categoryRules)
              .map(
                ([category, keywords]) => `${category}: ${keywords.join(", ")}`
              )
              .join("\n")}
            
            Return only a JSON object with the format {"category": "determinedCategory"} and nothing else.
        `;

    // Get category from Groq
    const response = await getGroqRecommendations(prompt);

    // Response validation
    if (!response || !response.category) {
      return res.status(500).json({
        error: "Failed to determine category",
        details: "Invalid response format from categorization service",
      });
    }

    // Return the determined category
    return res.status(200).json({
      category: response.category,
    });
  } catch (error) {
    console.error("Error determining category:", error.message);
    return res.status(500).json({
      error: "Failed to determine category",
      details: error.message,
    });
  }
};

module.exports = {
  determineCategory,
};
