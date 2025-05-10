import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "YOUR_API_KEY"
});

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Get AI response for medical questions based on our database 
 */
export async function getMedicalResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are MedScience AI, a specialized medical assistant with access to comprehensive, 
          evidence-based medical information. Provide accurate, helpful responses to medical questions.
          
          Guidelines:
          - Always cite reliable medical sources when possible
          - Clearly state when something is medical consensus vs. emerging research
          - Include relevant disclaimers when appropriate
          - Never provide definitive medical diagnoses
          - Always recommend consulting healthcare professionals for personal medical concerns
          - Explain complex medical concepts in accessible language
          - Focus on scientific accuracy while being compassionate`
        },
        ...messages
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("Error with OpenAI API:", error);
    return "I apologize, but I'm having trouble connecting to my knowledge base. Please try again later.";
  }
}

/**
 * Analyze symptoms and suggest possible conditions
 */
export async function analyzeSymptoms(symptoms: string[], userInfo?: { age?: number; gender?: string; medicalHistory?: string[] }): Promise<{
  possibleConditions: Array<{ name: string; probability: string; description: string; whenToSeekCare: string }>;
  disclaimer: string;
}> {
  try {
    const userInfoText = userInfo ? 
      `The patient is a ${userInfo.age || 'unknown age'} year old ${userInfo.gender || 'person'} with the following medical history: ${userInfo.medicalHistory?.join(', ') || 'none provided'}.` : 
      'No additional patient information is provided.';

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a medical symptom analysis system. Based on the symptoms provided, suggest possible 
          conditions with their relative likelihood. Structure the response as a JSON object with the following format:
          {
            "possibleConditions": [
              {
                "name": "Condition name",
                "probability": "High/Medium/Low",
                "description": "Brief description of the condition",
                "whenToSeekCare": "When to seek immediate medical attention"
              }
            ],
            "disclaimer": "Medical disclaimer text"
          }
          
          Remember that this is not a diagnosis, only a suggestion of possibilities. Always include a disclaimer about seeking professional medical advice.`
        },
        {
          role: "user",
          content: `I'm experiencing the following symptoms: ${symptoms.join(', ')}. ${userInfoText} What could be the possible conditions based on these symptoms?`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content);

    return {
      possibleConditions: result.possibleConditions || [],
      disclaimer: result.disclaimer || "This information is not a diagnosis. Always consult a healthcare professional for medical advice."
    };
  } catch (error: any) {
    console.error("Error analyzing symptoms:", error);
    return {
      possibleConditions: [],
      disclaimer: "Sorry, there was an error analyzing your symptoms. Please try again later or consult a healthcare professional."
    };
  }
}

export default {
  getMedicalResponse,
  analyzeSymptoms
};
