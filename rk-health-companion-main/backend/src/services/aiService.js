import { env } from "../config/env.js";
import { BadRequestError } from "../utils/customError.js";

const systemPrompt = `You are a professional medical AI assistant. Analyze the provided clinical notes and appointment details, then generate a patient-friendly healthcare summary.
You must return a JSON object with the following keys. Do not include any markdown formatting outside the JSON:
{
  "visitOverview": "A brief overview of the clinical consultation.",
  "patientExplanation": "A plain language explanation of the diagnosis and symptoms, translating medical jargon into easy-to-understand terms.",
  "medicationGuidance": "Patient guidance on how to take the prescribed medications, strength, dosage frequency, and food preferences.",
  "followUpAdvice": "Clear guidance on when to follow up and key symptoms that should prompt medical review.",
  "healthRecommendations": "Lifestyle, diet, and physical activity recommendations based on the diagnosis.",
  "precautions": "Critical precautions and warning signs that require emergency attention.",
  "summary": "A concise one-line summary of the patient's overall health status."
}`;

/**
 * Generates structured AI summary utilizing Groq LLaMA 3.3-70B Versatile
 */
export const generateSummaryFromNotes = async (appointment, user, medications) => {
  const userPrompt = `
    Patient Information:
    - Name: ${user.fullName}
    - Gender: ${user.gender || "Not specified"}
    - Medical Conditions: ${user.medicalConditions || "None declared"}
    - Allergies: ${user.allergies || "None declared"}

    Appointment Details:
    - Doctor: ${appointment.doctorName}
    - Title: ${appointment.title}
    - Hospital: ${appointment.hospital || "Not specified"}
    - Specialization: ${appointment.specialization || "Not specified"}
    - Visit Notes: ${appointment.notes || ""}
    
    Prescribed Medications:
    ${
      medications.length > 0
        ? medications.map((m) => `- ${m.medicineName} (${m.dosage}, ${m.strength || "N/A"}): frequency: ${m.frequency || "N/A"}, preference: ${m.foodPreference || "N/A"}`).join("\n")
        : "None prescribed in this session"
    }
  `;

  if (!appointment.notes || appointment.notes.trim().length < 10) {
    throw new BadRequestError("Appointment notes are too short. Provide at least 10 characters to generate an AI summary.");
  }

  if (!env.GROQ_API_KEY) {
    throw new BadRequestError("Groq API key is not configured in the environment variables.");
  }

  const startTime = Date.now();

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(15000), // 15 second timeout limit
    });

    if (response.status === 401) {
      throw new Error("Invalid Groq API key configured.");
    }
    if (response.status === 429) {
      throw new Error("Groq API rate limit exceeded. Please try again in a few moments.");
    }
    if (!response.ok) {
      throw new Error(`Groq API returned error status ${response.status}`);
    }

    const result = await response.json();
    const duration = Date.now() - startTime;
    const content = JSON.parse(result.choices[0].message.content);

    return {
      content,
      metadata: {
        modelName: "llama-3.3-70b-versatile",
        durationMs: duration,
        promptVersion: "1.0.0",
        tokenUsage: result.usage || null,
      },
    };
  } catch (err) {
    if (err.name === "TimeoutError") {
      throw new BadRequestError("The request to the Groq AI service timed out. Please try again.");
    }
    throw new BadRequestError(`AI Generation failed: ${err.message}`);
  }
};
