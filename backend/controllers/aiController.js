// Rule-based AI symptom analysis (no external API required)

const SYMPTOM_RULES = [
    {
        id: 'respiratory',
        keywords: ['cough', 'fever', 'sore throat', 'runny nose', 'congestion', 'sneezing', 'cold'],
        conditions: ['Common Cold', 'Upper Respiratory Infection', 'Influenza'],
        specialty: 'General Physician',
        treatmentType: 'allopathic',
        urgency: 'moderate',
        advice: 'Rest, stay hydrated. See a doctor if fever persists beyond 3 days.',
    },
    {
        id: 'digestive',
        keywords: ['stomach pain', 'nausea', 'vomiting', 'diarrhea', 'bloating', 'indigestion', 'acidity'],
        conditions: ['Gastritis', 'Food Poisoning', 'Acid Reflux'],
        specialty: 'Gastroenterologist',
        treatmentType: 'allopathic',
        urgency: 'moderate',
        advice: 'Avoid spicy food. Seek immediate care if blood in vomit or severe dehydration.',
    },
    {
        id: 'skin',
        keywords: ['rash', 'itching', 'acne', 'eczema', 'hives', 'skin allergy', 'redness'],
        conditions: ['Dermatitis', 'Allergic Reaction', 'Eczema'],
        specialty: 'Dermatologist',
        treatmentType: 'allopathic',
        urgency: 'low',
        advice: 'Avoid scratching affected areas. Consult a dermatologist for persistent rashes.',
    },
    {
        id: 'neuro',
        keywords: ['headache', 'migraine', 'dizziness', 'vertigo', 'numbness', 'seizure'],
        conditions: ['Migraine', 'Tension Headache', 'Vertigo'],
        specialty: 'Neurologist',
        treatmentType: 'allopathic',
        urgency: 'moderate',
        advice: 'Seek emergency care for sudden severe headache with vision changes.',
    },
    {
        id: 'joint',
        keywords: ['joint pain', 'back pain', 'knee pain', 'arthritis', 'stiffness', 'swelling'],
        conditions: ['Osteoarthritis', 'Musculoskeletal Strain', 'Joint Inflammation'],
        specialty: 'Orthopedic',
        treatmentType: 'allopathic',
        urgency: 'low',
        advice: 'Apply ice for acute injuries. Physiotherapy may help chronic pain.',
    },
    {
        id: 'homeo_chronic',
        keywords: ['chronic fatigue', 'anxiety', 'stress', 'insomnia', 'weak immunity', 'allergy'],
        conditions: ['Chronic Stress Syndrome', 'Allergic Rhinitis', 'Sleep Disorder'],
        specialty: 'Homeopathic Physician',
        treatmentType: 'homeopathic',
        urgency: 'low',
        advice: 'Homeopathic treatment focuses on holistic healing. Consult a verified homeopathic doctor.',
    },
    {
        id: 'herbal',
        keywords: ['hair fall', 'weight loss', 'low energy', 'digestive weakness', 'herbal', 'natural remedy'],
        conditions: ['Nutritional Deficiency', 'Metabolic Imbalance', 'Chronic Weakness'],
        specialty: 'Herbal Medicine Specialist',
        treatmentType: 'herbal',
        urgency: 'low',
        advice: 'Herbal treatments work gradually. Always consult a certified herbal practitioner.',
    },
    {
        id: 'cardiac',
        keywords: ['chest pain', 'palpitation', 'breathlessness', 'high blood pressure', 'heart'],
        conditions: ['Hypertension', 'Angina', 'Cardiac Arrhythmia'],
        specialty: 'Cardiologist',
        treatmentType: 'allopathic',
        urgency: 'high',
        advice: 'Chest pain requires immediate medical attention. Call emergency services if severe.',
    },
    {
        id: 'diabetes',
        keywords: ['frequent urination', 'excessive thirst', 'blurred vision', 'diabetes', 'high sugar'],
        conditions: ['Type 2 Diabetes', 'Hyperglycemia', 'Prediabetes'],
        specialty: 'Endocrinologist',
        treatmentType: 'allopathic',
        urgency: 'moderate',
        advice: 'Monitor blood sugar regularly. Lifestyle changes and medication may be needed.',
    },
    {
        id: 'pediatric',
        keywords: ['child fever', 'child cough', 'vaccination', 'growth', 'pediatric'],
        conditions: ['Pediatric Infection', 'Childhood Fever', 'Growth Concern'],
        specialty: 'Pediatrician',
        treatmentType: 'allopathic',
        urgency: 'moderate',
        advice: 'Children under 5 with high fever need prompt pediatric evaluation.',
    },
]

const normalize = (text) => text.toLowerCase().trim().replace(/\s+/g, ' ')

const analyzeSymptoms = (symptomText) => {
    const normalized = normalize(symptomText)
    const words = normalized.split(/[,;.\n]+/).map((s) => s.trim()).filter(Boolean)

    const matches = SYMPTOM_RULES.map((rule) => {
        const matchedKeywords = rule.keywords.filter((kw) =>
            normalized.includes(kw) || words.some((w) => w.includes(kw) || kw.includes(w))
        )
        const score = matchedKeywords.length / rule.keywords.length
        return { ...rule, matchedKeywords, score }
    }).filter((r) => r.matchedKeywords.length > 0)
        .sort((a, b) => b.score - a.score)

    if (matches.length === 0) {
        return {
            predictions: [],
            recommendation: {
                specialty: 'General Physician',
                treatmentType: 'allopathic',
                urgency: 'low',
                message: 'No specific match found. We recommend consulting a General Physician for proper diagnosis.',
            },
            disclaimer: 'This is an AI-assisted preliminary analysis only. It is NOT a medical diagnosis. Always consult a qualified doctor.',
        }
    }

    const top = matches.slice(0, 3)

    return {
        predictions: top.map((m) => ({
            category: m.id,
            possibleConditions: m.conditions,
            matchedSymptoms: m.matchedKeywords,
            confidence: Math.round(Math.min(m.score * 100 + m.matchedKeywords.length * 15, 95)),
            recommendedSpecialty: m.specialty,
            treatmentType: m.treatmentType,
            urgency: m.urgency,
            advice: m.advice,
        })),
        recommendation: {
            specialty: top[0].specialty,
            treatmentType: top[0].treatmentType,
            urgency: top[0].urgency,
            message: `Based on your symptoms, we suggest consulting a ${top[0].specialty} (${top[0].treatmentType}).`,
        },
        disclaimer: 'This is an AI-assisted preliminary analysis only. It is NOT a medical diagnosis. Always consult a qualified doctor.',
    }
}

const checkSymptoms = async (req, res) => {
    try {
        const { symptoms } = req.body

        if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Please describe your symptoms (at least 3 characters)',
            })
        }

        const result = analyzeSymptoms(symptoms)

        res.json({ success: true, ...result })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export { checkSymptoms, analyzeSymptoms }
