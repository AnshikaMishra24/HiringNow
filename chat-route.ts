import { type NextRequest, NextResponse } from "next/server"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  type?: string
}

interface ChatRequest {
  message: string
  history: Message[]
}

// Comprehensive health knowledge base for retrieval-based QA
const healthKnowledgeBase = {
  symptoms: {
    headache: {
      causes: ["stress", "dehydration", "lack of sleep", "eye strain", "tension", "sinus congestion"],
      remedies: [
        "Rest in a quiet, dark room",
        "Stay well hydrated with water",
        "Apply a cold compress to forehead",
        "Try gentle neck and shoulder stretches",
        "Practice deep breathing exercises",
        "Consider over-the-counter pain relief if appropriate",
      ],
      whenToSeek: "severe sudden onset, with fever above 101°F, vision changes, or lasting more than 3 days",
    },
    fever: {
      causes: ["viral infection", "bacterial infection", "inflammation", "heat exhaustion", "medication reactions"],
      remedies: [
        "Get plenty of rest",
        "Stay hydrated with water and clear fluids",
        "Use cool compresses on forehead and wrists",
        "Wear light, breathable clothing",
        "Take lukewarm baths",
        "Monitor temperature regularly",
      ],
      whenToSeek:
        "temperature above 103°F (39.4°C), difficulty breathing, severe dehydration, or lasting more than 3 days",
    },
    cough: {
      causes: ["common cold", "allergies", "asthma", "acid reflux", "smoking", "dry air"],
      remedies: [
        "Drink warm liquids like herbal tea with honey",
        "Use a humidifier to add moisture to air",
        "Try throat lozenges or hard candies",
        "Elevate your head while sleeping",
        "Avoid irritants like smoke",
        "Stay hydrated throughout the day",
      ],
      whenToSeek: "blood in cough, difficulty breathing, chest pain, high fever, or lasting more than 3 weeks",
    },
    "sore throat": {
      causes: ["viral infection", "bacterial infection", "allergies", "dry air", "acid reflux"],
      remedies: [
        "Gargle with warm salt water",
        "Drink warm liquids and herbal teas",
        "Use throat lozenges or sprays",
        "Stay hydrated",
        "Use a humidifier",
        "Rest your voice",
      ],
      whenToSeek: "severe pain, difficulty swallowing, high fever, or white patches on throat",
    },
    nausea: {
      causes: ["food poisoning", "motion sickness", "stress", "medication side effects", "pregnancy"],
      remedies: [
        "Sip clear fluids slowly",
        "Try ginger tea or ginger candies",
        "Eat bland foods like crackers or toast",
        "Get fresh air",
        "Rest in a comfortable position",
        "Avoid strong odors",
      ],
      whenToSeek: "severe dehydration, blood in vomit, severe abdominal pain, or lasting more than 24 hours",
    },
  },
  wellness: {
    daily: [
      "Drink 8-10 glasses of water throughout the day",
      "Aim for 7-9 hours of quality sleep each night",
      "Get at least 30 minutes of physical activity",
      "Eat 5-7 servings of fruits and vegetables",
      "Practice stress management techniques like meditation",
      "Limit screen time 1 hour before bedtime",
      "Take regular breaks from sitting every hour",
      "Maintain good posture throughout the day",
    ],
    mental: [
      "Practice deep breathing exercises (4-7-8 technique)",
      "Try 10 minutes of daily meditation or mindfulness",
      "Maintain regular social connections with friends and family",
      "Set realistic, achievable daily goals",
      "Keep a gratitude journal",
      "Limit exposure to negative news and social media",
      "Engage in hobbies you enjoy",
      "Seek professional help when feeling overwhelmed",
    ],
    nutrition: [
      "Focus on whole, unprocessed foods",
      "Include lean proteins in each meal",
      "Choose complex carbohydrates over simple sugars",
      "Incorporate healthy fats like avocados and nuts",
      "Eat regular meals to maintain stable blood sugar",
      "Practice mindful eating without distractions",
      "Consider a daily multivitamin if diet is lacking",
      "Limit alcohol and caffeine intake",
    ],
    exercise: [
      "Start with 10-15 minutes of daily movement",
      "Include both cardio and strength training",
      "Try activities you enjoy to stay motivated",
      "Focus on consistency over intensity",
      "Include flexibility and stretching exercises",
      "Take the stairs when possible",
      "Park farther away to increase walking",
      "Consider yoga or tai chi for mind-body benefits",
    ],
  },
  emergency: [
    "Chest pain or pressure lasting more than a few minutes",
    "Difficulty breathing or shortness of breath",
    "Severe allergic reaction with swelling or difficulty breathing",
    "Loss of consciousness or fainting",
    "Severe bleeding that won't stop",
    "Signs of stroke: Face drooping, Arm weakness, Speech difficulty, Time to call 911",
    "Severe abdominal pain",
    "High fever (104°F+) with confusion or difficulty breathing",
    "Severe head injury",
    "Poisoning or overdose",
  ],
  mentalHealth: {
    stress: [
      "Practice progressive muscle relaxation",
      "Use the 5-4-3-2-1 grounding technique",
      "Take regular breaks throughout your day",
      "Engage in physical activity to release tension",
      "Talk to trusted friends or family members",
      "Consider professional counseling if stress is overwhelming",
    ],
    anxiety: [
      "Practice deep breathing exercises",
      "Try mindfulness meditation",
      "Challenge negative thought patterns",
      "Maintain a regular sleep schedule",
      "Limit caffeine intake",
      "Consider therapy or counseling for persistent anxiety",
    ],
    depression: [
      "Maintain social connections even when you don't feel like it",
      "Establish a daily routine",
      "Get regular exercise, even light walking",
      "Ensure adequate sleep (7-9 hours)",
      "Eat nutritious meals regularly",
      "Seek professional help - depression is treatable",
    ],
  },
}

// Advanced AI-like response generation using pattern matching and knowledge retrieval
function generateHealthResponse(message: string, history: Message[]): { response: string; type: string } {
  const lowerMessage = message.toLowerCase()

  // Emergency detection
  const emergencyKeywords = [
    "emergency",
    "urgent",
    "911",
    "ambulance",
    "hospital",
    "severe pain",
    "can't breathe",
    "chest pain",
    "heart attack",
    "stroke",
    "bleeding",
    "unconscious",
    "overdose",
    "poisoning",
    "allergic reaction",
  ]

  if (emergencyKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return {
      response:
        "🚨 **MEDICAL EMERGENCY DETECTED** 🚨\n\nThis sounds like a medical emergency. Please:\n\n• **Call 911 (US) or your local emergency number IMMEDIATELY**\n• Go to the nearest emergency room\n• Do not delay seeking immediate medical attention\n• If possible, have someone stay with you\n\nDo not rely on this chat for emergency medical care. Get professional help now!",
      type: "emergency",
    }
  }

  // Symptom analysis
  const symptoms = Object.keys(healthKnowledgeBase.symptoms)
  const matchedSymptom = symptoms.find(
    (symptom) => lowerMessage.includes(symptom) || lowerMessage.includes(symptom.replace(" ", "")),
  )

  if (matchedSymptom) {
    const symptomData = healthKnowledgeBase.symptoms[matchedSymptom as keyof typeof healthKnowledgeBase.symptoms]
    return {
      response: `I understand you're experiencing ${matchedSymptom}. Here's what I can help you with:\n\n**Common Causes:**\n${symptomData.causes.map((cause) => `• ${cause}`).join("\n")}\n\n**Self-Care Remedies:**\n${symptomData.remedies.map((remedy) => `• ${remedy}`).join("\n")}\n\n**⚠️ Seek Medical Attention If:**\n${symptomData.whenToSeek}\n\n**Important:** This information is for educational purposes only. If symptoms persist or worsen, please consult a healthcare professional for proper diagnosis and treatment.`,
      type: "symptom-analysis",
    }
  }

  // Wellness and health tips
  if (lowerMessage.includes("wellness") || lowerMessage.includes("health tips") || lowerMessage.includes("daily")) {
    const tips = healthKnowledgeBase.wellness.daily
    const randomTips = tips.sort(() => 0.5 - Math.random()).slice(0, 5)
    return {
      response: `Here are some excellent daily wellness tips to improve your overall health:\n\n${randomTips.map((tip, index) => `${index + 1}. ${tip}`).join("\n")}\n\n💡 **Pro Tip:** Start with just one or two of these habits and gradually build up. Consistency is more important than perfection!\n\nWould you like specific tips for nutrition, exercise, or mental wellness?`,
      type: "health-tip",
    }
  }

  // Mental health support
  if (lowerMessage.includes("stress") || lowerMessage.includes("anxiety") || lowerMessage.includes("mental health")) {
    let mentalHealthTips = []
    if (lowerMessage.includes("stress")) {
      mentalHealthTips = healthKnowledgeBase.mentalHealth.stress
    } else if (lowerMessage.includes("anxiety")) {
      mentalHealthTips = healthKnowledgeBase.mentalHealth.anxiety
    } else {
      mentalHealthTips = [
        ...healthKnowledgeBase.mentalHealth.stress,
        ...healthKnowledgeBase.mentalHealth.anxiety,
      ].slice(0, 6)
    }

    return {
      response: `I understand you're looking for mental health support. Here are some evidence-based strategies that can help:\n\n${mentalHealthTips.map((tip, index) => `${index + 1}. ${tip}`).join("\n")}\n\n🧠 **Remember:** Mental health is just as important as physical health. If you're experiencing persistent symptoms that interfere with daily life, please consider reaching out to a mental health professional.\n\n**Crisis Resources:**\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741`,
      type: "mental-health",
    }
  }

  // Nutrition advice
  if (lowerMessage.includes("nutrition") || lowerMessage.includes("diet") || lowerMessage.includes("eating")) {
    const nutritionTips = healthKnowledgeBase.wellness.nutrition
    return {
      response: `Here's evidence-based nutrition guidance for optimal health:\n\n${nutritionTips.map((tip, index) => `${index + 1}. ${tip}`).join("\n")}\n\n🥗 **Key Principle:** Focus on progress, not perfection. Small, sustainable changes lead to lasting health improvements.\n\nWould you like specific advice about meal planning, portion sizes, or addressing particular dietary concerns?`,
      type: "health-tip",
    }
  }

  // Exercise and fitness
  if (lowerMessage.includes("exercise") || lowerMessage.includes("fitness") || lowerMessage.includes("workout")) {
    const exerciseTips = healthKnowledgeBase.wellness.exercise
    return {
      response: `Here's your personalized exercise guidance for better health:\n\n${exerciseTips.map((tip, index) => `${index + 1}. ${tip}`).join("\n")}\n\n💪 **Getting Started:** If you're new to exercise, start slowly and gradually increase intensity. Listen to your body and rest when needed.\n\n**Safety First:** Consult with a healthcare provider before starting any new exercise program, especially if you have existing health conditions.`,
      type: "health-tip",
    }
  }

  // Medication questions
  if (lowerMessage.includes("medication") || lowerMessage.includes("medicine") || lowerMessage.includes("drug")) {
    return {
      response: `I can provide general information about medications, but for specific medical advice, please consult your healthcare provider or pharmacist.\n\n**General Medication Safety Tips:**\n• Always take medications as prescribed\n• Don't share prescription medications\n• Keep an updated list of all medications\n• Be aware of potential drug interactions\n• Store medications properly\n• Check expiration dates regularly\n\n**For Specific Questions:**\n• Consult your prescribing doctor\n• Ask your pharmacist about interactions\n• Use reputable medical websites like WebMD or Mayo Clinic\n\n⚠️ **Never stop or change prescription medications without consulting your healthcare provider first.**`,
      type: "general",
    }
  }

  // Sleep issues
  if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia") || lowerMessage.includes("tired")) {
    return {
      response: `Good sleep is crucial for overall health. Here are evidence-based sleep improvement strategies:\n\n**Sleep Hygiene Tips:**\n• Maintain a consistent sleep schedule\n• Create a relaxing bedtime routine\n• Keep your bedroom cool, dark, and quiet\n• Avoid screens 1 hour before bedtime\n• Limit caffeine after 2 PM\n• Get natural sunlight exposure during the day\n• Exercise regularly, but not close to bedtime\n• Avoid large meals and alcohol before bed\n\n**If Sleep Problems Persist:**\nConsider consulting a healthcare provider, as chronic sleep issues can indicate underlying conditions like sleep apnea or other disorders.\n\n😴 **Tonight's Goal:** Try implementing just one of these tips to start improving your sleep quality.`,
      type: "health-tip",
    }
  }

  // General health questions
  if (lowerMessage.includes("healthy") || lowerMessage.includes("improve") || lowerMessage.includes("better")) {
    return {
      response: `I'm here to help you on your health journey! Here are some foundational principles for better health:\n\n**The Health Fundamentals:**\n1. **Nutrition:** Eat a balanced diet rich in whole foods\n2. **Movement:** Aim for 150 minutes of moderate activity weekly\n3. **Sleep:** Prioritize 7-9 hours of quality sleep\n4. **Hydration:** Drink adequate water throughout the day\n5. **Stress Management:** Practice relaxation techniques\n6. **Social Connection:** Maintain meaningful relationships\n7. **Preventive Care:** Regular check-ups and screenings\n\n🎯 **Start Small:** Choose one area to focus on this week. Small, consistent changes lead to lasting improvements.\n\nWhat specific aspect of your health would you like to work on? I can provide more targeted guidance!`,
      type: "general",
    }
  }

  // Default response with contextual awareness
  const contextualResponse =
    history.length > 1
      ? "I'm here to continue helping with your health questions. "
      : "Hello! I'm FellSync, your AI health assistant. "

  return {
    response: `${contextualResponse}I can help you with:\n\n🩺 **Symptom Information** - General guidance on common symptoms\n💊 **Wellness Tips** - Daily health and self-care advice\n🧠 **Mental Health** - Stress management and emotional wellness\n🥗 **Nutrition Guidance** - Healthy eating recommendations\n💪 **Exercise Advice** - Fitness and movement tips\n😴 **Sleep Improvement** - Better sleep strategies\n\n**How to get the best help:**\n• Be specific about your concerns\n• Mention any symptoms you're experiencing\n• Ask about particular health topics you're interested in\n\n⚠️ **Important:** I provide general health information only. For medical diagnosis, treatment, or emergencies, always consult qualified healthcare professionals.\n\nWhat would you like to know about your health today?`,
    type: "general",
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, history }: ChatRequest = await request.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json({
        response: "I didn't receive your message. Please try typing your health question again.",
        type: "error",
      })
    }

    // Simulate processing time for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

    // Generate intelligent response using our advanced health knowledge system
    const { response, type } = generateHealthResponse(message, history)

    return NextResponse.json({
      response,
      type,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        response:
          "I apologize, but I'm experiencing technical difficulties. Please try again in a moment. If this is a medical emergency, please contact emergency services immediately at 911 or your local emergency number.",
        type: "error",
      },
      { status: 500 },
    )
  }
}
