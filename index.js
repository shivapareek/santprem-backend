import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const premanandQuotes = [
  "जीवन में जो कुछ भी समस्याएं आती हैं, वे हमारे मन की देन हैं। मन को शांत रखो, समस्याएं अपने आप हल हो जाएंगी।",
  "प्रेम ही परमात्मा है। जहां प्रेम है, वहां भगवान का वास है।",
  "क्रोध में आदमी अपनी सारी अक्ल खो देता है। क्रोध से बचना ही सबसे बड़ी बुद्धिमानी है।",
  "भगवान का नाम लेने से सभी कष्ट दूर हो जाते हैं। राम नाम सत्य है।",
  "संसार में सुख-दुख आते-जाते रहते हैं। स्थिर मन से इन्हें सहन करना ही योग है।",
  "दूसरों की भलाई में अपना भला छुपा हुआ है। सेवा परम धर्म है।",
  "जब तक अहंकार है, तब तक सुख नहीं मिल सकता। विनम्रता ही सच्ची शक्ति है।",
  "परमात्मा के सामने सब बराबर हैं। जात-पात, ऊंच-नीच सब माया है।",
  "धैर्य रखो, भगवान का समय सबसे अच्छा होता है। जो होना है, वो अच्छे के लिए होता है।",
  "सत्संग से जीवन बदल जाता है। अच्छी संगति में रहो, बुरी आदतें छूट जाएंगी।",
  "माफ करना सबसे बड़ा गुण है। दिल में किसी के लिए बुराई मत रखो।",
  "संतोष सबसे बड़ा धन है। जो मिला है, उसमें खुश रहो।",
  "भक्ति करने से मन में शांति आती है। प्रभु का स्मरण सबसे बड़ी दवा है।",
  "जिंदगी एक नाटक की तरह है। अपना किरदार अच्छे से निभाओ, फिर चले जाना है।",
  "सच्चा प्रेम कभी नहीं मरता। प्रेम में ही परमात्मा का दर्शन होता है।"
];

function getRelevantQuote(prompt) {
  const text = prompt.toLowerCase();
  if (text.includes("गुस्सा") || text.includes("क्रोध")) return premanandQuotes[2];
  if (text.includes("प्रेम") || text.includes("प्यार")) return premanandQuotes[1];
  if (text.includes("दुःख") || text.includes("समस्या") || text.includes("problem")) return premanandQuotes[0];
  if (text.includes("धन") || text.includes("पैसा")) return premanandQuotes[11];
  if (text.includes("माफ")) return premanandQuotes[10];
  if (text.includes("अहंकार")) return premanandQuotes[6];
  if (text.includes("धैर्य")) return premanandQuotes[8];
  if (text.includes("भक्ति") || text.includes("प्रार्थना")) return premanandQuotes[12];
  return null;
}

function getSolution(prompt) {
  const text = prompt.toLowerCase();
  if (text.includes("गुस्सा") || text.includes("क्रोध"))
    return "जब गुस्सा आए तो गहरी सांस लें, 'राम राम' का जाप करें और कुछ देर मौन रहें।";
  if (text.includes("तनाव") || text.includes("stress"))
    return "रोज सुबह ध्यान करें, प्राणायाम करें और मन को एकाग्र करें।";
  if (text.includes("रिश्ता"))
    return "रिश्तों में प्रेम और क्षमा सबसे जरूरी है। संवाद से समाधान निकलता है।";
  if (text.includes("काम") || text.includes("career"))
    return "मेहनत और ईमानदारी से काम करें, फल की चिंता ईश्वर पर छोड़ दें।";
  if (text.includes("स्वास्थ्य"))
    return "योग, संयमित आहार और भरपूर नींद – ये ही अच्छे स्वास्थ्य के स्तंभ हैं।";
  if (text.includes("पैसा"))
    return "कमाई का कुछ हिस्सा सेवा में लगाएं, और बचत की आदत डालें।";
  return null;
}

function isSmallTalk(prompt) {
  const smallTalkKeywords = [
    "hello", "hi", "नमस्ते", "कैसे हो", "thanks", "धन्यवाद", "ठीक", "you there", "ok", "bye", "goodbye"
  ];
  return smallTalkKeywords.some(word => prompt.toLowerCase().includes(word));
}

app.post("/chat", async (req, res) => {
  try {
    const userPrompt = req.body.prompt;
    const relevantQuote = getRelevantQuote(userPrompt);
    const practicalSolution = getSolution(userPrompt);
    const shortReply = isSmallTalk(userPrompt);

    const includeSignature = Math.random() < 0.4;
    const closingNote = includeSignature
      ? `\n\nमेरे प्रिय,\nतुम्हारा मन अशांत है, यह मैं जानता हूँ। यह स्वभाव से ही चंचल है। परंतु अभ्यास और वैराग्य से इसे वश में किया जा सकता है।\nसदा तुम्हारा,\nप्रेमानंद।`
      : "";

    const prompt = `
आप \"प्रेमानंद जी महाराज\" के रूप में उत्तर देंगे। आपकी वाणी **मधुर**, **करुणामयी** और **आत्मा को शांति देने वाली** होनी चाहिए। उत्तर **केवल हिंदी (देवनागरी लिपि)** में हो।

📜 उत्तर को **Markdown फॉर्मेट** में दीजिए ताकि वह वेबसाइट पर सुंदर रूप में दिखे।

💡 उत्तर ${shortReply ? "**3–4 पंक्तियों**" : "**8–10 पंक्तियों**"} में होना चाहिए — ना बहुत छोटा, ना बहुत लंबा।

---

🔶 कृपया निम्नलिखित नियमों का पालन करें:

- **मुख्य वाक्य** को \`**bold**\` करें  
- *कोमल/संवेदनशील बातों* को \`*italic*\` करें  
- जहाँ ज़रूरी हो वहाँ \`###\` heading से अनुभाग दें (जैसे समाधान, वाणी, आदि)  
- समाधान या सुझाव को \`- bullet points\` में रखें  
- मंत्र, उद्धरण या विशेष निर्देश को \`code block\` (\`\`\`) में रखें  
- उत्तर केवल Markdown में हो — HTML या styling tag का प्रयोग न करें  
- उत्तर भक्तिमय और सकारात्मक ऊर्जा से भरपूर हो

---

${practicalSolution ? `### 🛠️ समाधान\n- ${practicalSolution}` : ""}
${relevantQuote ? `\n\n### 🌼 प्रेमानंद वाणी\n- \"${relevantQuote}\"` : ""}

---

### 🙏 प्रश्न:
${userPrompt}

---

🙏 *उत्तर दीजिए (${shortReply ? "संक्षिप्त" : "सारगर्भित"} रूप में)*:${closingNote ? `\n\n${closingNote}` : ""}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    res.status(500).json({ reply: "🙏 क्षमा करें, कुछ त्रुटि हो गई है। कृपया पुनः प्रयास करें।" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ प्रेमानंद जी का आशीर्वाद! Server चल रहा है: http://localhost:${PORT}`);
});
