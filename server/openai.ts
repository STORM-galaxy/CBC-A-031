import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
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
          evidence-based medical information about diseases, disorders, treatments, and medical advice.
          
          You have detailed knowledge about:
          1. All human body systems: cardiovascular, respiratory, digestive, nervous, endocrine, immune, 
             integumentary, skeletal, muscular, urinary, reproductive, and lymphatic systems.
          2. Common and rare diseases affecting each body system, including causes, symptoms, diagnostic methods, 
             treatments, latest research, and prevention strategies.
          3. Current medical research and clinical trials from reputable medical journals.
          4. Standard treatment protocols and medications for various conditions.
          5. Preventive healthcare measures and lifestyle modifications.
          
          Guidelines:
          - Always cite reliable medical sources like JAMA, NEJM, The Lancet, or major medical associations
          - Clearly state when information represents medical consensus versus emerging/experimental research
          - Include relevant disclaimers when discussing serious conditions or treatments
          - Never provide definitive medical diagnoses for specific user cases
          - Always recommend consulting qualified healthcare professionals for personal medical concerns
          - Explain complex medical concepts in accessible language while maintaining accuracy
          - Focus on scientific accuracy while being compassionate
          - When asked about specific diseases, provide comprehensive information about causes, symptoms, 
            diagnosis, treatments, and prevention`
        },
        ...messages
      ],
      temperature: 0.2,
      max_tokens: 1500,
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
  possibleConditions: Array<{ name: string; probability: string; description: string; whenToSeekCare: string; relatedBodySystem: string }>;
  disclaimer: string;
  recommendations: string[];
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
          content: `You are a medical symptom analysis system with extensive knowledge of all medical conditions and body systems.
          Based on the symptoms provided, analyze the possible conditions with thorough evaluation and medical accuracy.
          
          Consider the following when analyzing symptoms:
          1. Common conditions that match the symptoms
          2. Rare but serious conditions that should not be missed
          3. Age and gender-specific considerations
          4. Relevant medical history that might influence the analysis
          5. Typical clinical presentation patterns
          6. The body systems most likely to be involved
          
          Structure the response as a JSON object with the following format:
          {
            "possibleConditions": [
              {
                "name": "Condition name",
                "probability": "High/Medium/Low",
                "description": "Detailed description of the condition including pathophysiology and epidemiology",
                "whenToSeekCare": "Specific guidance on when immediate medical attention is needed",
                "relatedBodySystem": "The primary body system affected by this condition"
              }
            ],
            "disclaimer": "Comprehensive medical disclaimer text",
            "recommendations": ["General health recommendation 1", "General health recommendation 2"]
          }
          
          Provide at least 3-5 possible conditions that match the symptoms, ordered from most to least likely.
          Be specific and detailed in your descriptions, using medical terminology but explaining concepts clearly.
          This information is not a diagnosis, only a medically-informed analysis of possibilities.`
        },
        {
          role: "user",
          content: `I'm experiencing the following symptoms: ${symptoms.join(', ')}. ${userInfoText} What could be the possible conditions based on these symptoms? Please provide a detailed analysis.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const result = JSON.parse(response.choices[0].message.content);

    return {
      possibleConditions: result.possibleConditions || [],
      disclaimer: result.disclaimer || "This information is not a diagnosis. Always consult a qualified healthcare professional for medical advice, diagnosis, and treatment. Medical conditions can present with similar symptoms but require different treatments. Only a licensed healthcare provider can properly evaluate your specific situation.",
      recommendations: result.recommendations || ["Schedule an appointment with your doctor to discuss these symptoms", "Keep a symptom journal to track changes", "Follow general health guidelines including proper hydration and rest"]
    };
  } catch (error: any) {
    console.error("Error analyzing symptoms:", error);
    return {
      possibleConditions: [],
      disclaimer: "Sorry, there was an error analyzing your symptoms. Please try again later or consult a healthcare professional.",
      recommendations: ["Please consult with a healthcare professional about your symptoms", "If symptoms are severe, seek immediate medical attention"]
    };
  }
}

/**
 * Get detailed information about a specific disease
 */
export async function getDiseaseInformation(diseaseName: string): Promise<{
  overview: string;
  causes: string;
  symptoms: string;
  diagnosis: string;
  treatments: string;
  prevention: string;
  researchUpdates: string;
  references: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a medical information system with extensive knowledge about diseases and medical conditions.
          Provide comprehensive, evidence-based information about the requested disease or condition.
          
          Structure the response as a JSON object with the following format:
          {
            "overview": "Detailed overview of the disease",
            "causes": "Detailed information about causes and risk factors",
            "symptoms": "Comprehensive list and description of symptoms",
            "diagnosis": "Methods and tests used for diagnosis",
            "treatments": "Current treatment approaches, including medications, procedures, and lifestyle modifications",
            "prevention": "Prevention strategies and recommendations",
            "researchUpdates": "Recent research developments and clinical trials",
            "references": ["Reference 1", "Reference 2", "Reference 3"]
          }
          
          Be thorough and scientifically accurate. Include information about disease prevalence, affected demographics, and prognosis.
          Cite medical literature and clinical guidelines from reputable sources like WHO, CDC, NIH, and major medical journals.`
        },
        {
          role: "user",
          content: `Please provide detailed information about ${diseaseName}.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    console.error("Error fetching disease information:", error);
    return {
      overview: "Information temporarily unavailable",
      causes: "",
      symptoms: "",
      diagnosis: "",
      treatments: "",
      prevention: "",
      researchUpdates: "",
      references: ["Unable to load references at this time"]
    };
  }
}

/**
 * Get information about hospitals and doctors in India
 */
export async function getIndianHealthcareProviders(query: string, location?: string, specialty?: string): Promise<{
  hospitals: Array<{
    name: string;
    location: string;
    specialties: string[];
    description: string;
    facilities: string[];
    accreditation: string[];
    contact: { phone?: string; email?: string; website?: string };
  }>;
  doctors: Array<{
    name: string;
    specialty: string;
    qualifications: string[];
    experience: string;
    hospital: string;
    location: string;
    languages: string[];
    expertise: string[];
    contact: { phone?: string; email?: string; website?: string };
  }>;
}> {
  try {
    const locationParam = location ? `in ${location}` : "in India";
    const specialtyParam = specialty ? `specializing in ${specialty}` : "";
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a healthcare provider information system with extensive knowledge about hospitals and 
          doctors in India. Provide accurate, up-to-date information about major medical institutions and specialists.
          
          Structure the response as a JSON object with the following format:
          {
            "hospitals": [
              {
                "name": "Hospital name",
                "location": "City, State, India",
                "specialties": ["Specialty 1", "Specialty 2"],
                "description": "Information about the hospital",
                "facilities": ["Facility 1", "Facility 2"],
                "accreditation": ["Accreditation 1", "Accreditation 2"],
                "contact": {
                  "phone": "Contact number",
                  "email": "Email address",
                  "website": "Website URL"
                }
              }
            ],
            "doctors": [
              {
                "name": "Doctor name",
                "specialty": "Medical specialty",
                "qualifications": ["Qualification 1", "Qualification 2"],
                "experience": "Years of experience",
                "hospital": "Primary hospital affiliation",
                "location": "City, State, India",
                "languages": ["Language 1", "Language 2"],
                "expertise": ["Area of expertise 1", "Area of expertise 2"],
                "contact": {
                  "phone": "Contact number",
                  "email": "Email address",
                  "website": "Profile URL"
                }
              }
            ]
          }
          
          Include only legitimate, well-established hospitals and board-certified doctors.
          Mention prominent accreditations such as NABH, JCI, and NABL for hospitals.
          For doctors, include relevant qualifications such as MBBS, MD, MS, DM, MCh, DNB.
          List only essential contact information that would be publicly available.`
        },
        {
          role: "user",
          content: `Please provide information about ${query} healthcare providers ${locationParam} ${specialtyParam}.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    console.error("Error fetching healthcare providers:", error);
    return {
      hospitals: [],
      doctors: []
    };
  }
}

/**
 * Get the latest medical news
 */
export async function getMedicalNews(category?: string): Promise<Array<{
  title: string;
  summary: string;
  content: string;
  source: string;
  publishedDate: string;
  category: string;
  url?: string;
}>> {
  try {
    const categoryFilter = category ? `related to ${category}` : "";
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a medical news information system with knowledge about the latest developments 
          in healthcare, medical research, treatments, and public health.
          
          Create a response with 5-10 recent and significant medical news items. These should be real 
          news stories that have been covered by major medical journals or reputable health news sources.
          
          Structure the response as a JSON array with the following format for each news item:
          [
            {
              "title": "News headline",
              "summary": "Brief summary (1-2 sentences)",
              "content": "Detailed news content (3-5 paragraphs)",
              "source": "Journal/News source name",
              "publishedDate": "Publication date (format: YYYY-MM-DD)",
              "category": "News category (e.g., Research, Public Health, Pharmaceutical, etc.)",
              "url": "Optional URL to the original source"
            }
          ]
          
          Focus on news from reputable sources such as NEJM, JAMA, The Lancet, BMJ, 
          Nature Medicine, Science, CDC, WHO, and major university medical centers.
          
          Ensure the news items are factual, significant, and represent diverse areas of medicine.
          Include the most recent news items as of May 2025, with accurate dates.`
        },
        {
          role: "user",
          content: `Please provide the latest medical news ${categoryFilter}. Today is May 10, 2025.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    console.error("Error fetching medical news:", error);
    return [];
  }
}

export default {
  getMedicalResponse,
  analyzeSymptoms
};
