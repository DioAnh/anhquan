
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';
import { Flashcard } from '../components/FlipCard';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateSummary = async (videoTitle: string): Promise<string> => {
  try {
    const prompt = `Hãy tóm tắt bài học chính từ một video dành cho trẻ em Việt Nam với tiêu đề "${videoTitle}". Tóm tắt cần ngắn gọn trong khoảng 50-70 từ, sử dụng ngôn ngữ thân thiện, trong sáng và dễ hiểu cho trẻ từ 5-12 tuổi.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Không thể tạo tóm tắt.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Rất tiếc, đã có lỗi xảy ra khi tóm tắt bài học. Vui lòng thử lại.";
  }
};

export const generateQuiz = async (summary: string): Promise<QuizQuestion[]> => {
  try {
     const prompt = `Dựa vào bản tóm tắt bài học sau đây, hãy tạo ra 3 câu hỏi trắc nghiệm cho trẻ em Việt Nam để kiểm tra kiến thức: "${summary}". Mỗi câu hỏi cần có 4 lựa chọn (A, B, C, D) và chỉ một đáp án đúng. Đảm bảo các câu hỏi và lựa chọn đều viết bằng tiếng Việt, đơn giản và phù hợp với lứa tuổi.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: {
                            type: Type.STRING,
                            description: "Câu hỏi trắc nghiệm bằng tiếng Việt."
                        },
                        options: {
                            type: Type.ARRAY,
                            description: "Một mảng chứa 4 lựa chọn trả lời.",
                            items: { type: Type.STRING }
                        },
                        correctAnswer: {
                            type: Type.STRING,
                            description: "Câu trả lời đúng, phải khớp với một trong các lựa chọn."
                        }
                    },
                    required: ["question", "options", "correctAnswer"]
                }
            }
        }
    });

    const jsonText = response.text?.trim();
    if (!jsonText) throw new Error("Empty response from AI");
    
    const quizData = JSON.parse(jsonText);

    // Validate data structure
    if (!Array.isArray(quizData) || quizData.some(q => !q.question || !q.options || !q.correctAnswer)) {
        throw new Error("Invalid quiz data structure from API");
    }

    return quizData;

  } catch (error) {
    console.error("Error generating quiz:", error);
    // Return a default quiz on error
    return [
      {
        question: "Đã có lỗi xảy ra khi tạo câu hỏi. Bé có muốn thử lại không?",
        options: ["Thử lại", "Bỏ qua", "Chơi trò khác", "Hỏi bố mẹ"],
        correctAnswer: "Thử lại"
      }
    ];
  }
};

export const generateDailyChallenge = async (): Promise<QuizQuestion> => {
    try {
        const topics = [
            "An toàn giao thông", 
            "Lễ phép với ông bà", 
            "Tiết kiệm tiền", 
            "Bảo vệ môi trường", 
            "Kết bạn", 
            "Vệ sinh cá nhân",
            "An toàn trên mạng",
            "Giúp đỡ bố mẹ"
        ];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];

        const prompt = `Hãy tạo ra 1 câu hỏi trắc nghiệm thú vị (Daily Challenge) cho trẻ em Việt Nam về chủ đề "${randomTopic}". 
        Câu hỏi phải mang tính giáo dục kỹ năng sống, vui nhộn.
        Có 4 đáp án, 1 đáp án đúng.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        question: {
                            type: Type.STRING,
                            description: "Câu hỏi trắc nghiệm thú vị."
                        },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        correctAnswer: {
                            type: Type.STRING,
                            description: "Đáp án đúng."
                        }
                    },
                    required: ["question", "options", "correctAnswer"]
                }
            }
        });

        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("Empty response from AI");
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating daily challenge:", error);
         return {
            question: "Hôm nay bé đã làm một việc tốt nào chưa?",
            options: ["Rồi ạ!", "Sắp làm", "Quên mất rồi", "Bí mật"],
            correctAnswer: "Rồi ạ!" // Fallback question
        };
    }
};

export const generateAvatar = async (): Promise<string | null> => {
    try {
        const subjects = [
            "cute baby astronaut", "fluffy baby tiger", "friendly little robot", 
            "baby superhero with cape", "smart little owl with glasses", 
            "happy baby dragon", "cute magical unicorn", "adventurous puppy explorer",
            "chibi wizard", "cute fairy with wings"
        ];
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        
        const prompt = `A 3D render, pixar style, high quality, cute cartoon avatar of a ${randomSubject}. 
        Bright and vibrant colors, cheerful expression, simple soft gradient background. 
        Suitable for a children's app profile picture. Square aspect ratio.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: prompt }
                ]
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64EncodeString = part.inlineData.data;
                return `data:image/png;base64,${base64EncodeString}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating avatar:", error);
        return null;
    }
};

// --- NEW FEATURES FOR CHALLENGE GAME ---

export interface SituationGameData {
    imagePrompt: string;
    imageUrl: string;
    situationContext: string;
    question: string;
    parentGuidance: string;
}

export interface EvaluationResult {
    score: number;
    feedback: string;
    isPass: boolean;
}

export const generateSituationGame = async (): Promise<SituationGameData | null> => {
    try {
        // Step 1: Generate the scenario text, image prompt, and parent guidance in ONE call
        const topics = [
            "Dealing with bullies", 
            "Helping a friend who fell", 
            "Finding a lost wallet", 
            "Stranger danger", 
            "Sharing toys",
            "Cleaning up mess",
            "Saying sorry",
            "Crossing the street safely"
        ];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];

        const textPrompt = `Create a life skill situation scenario for a 7-year-old child about: "${randomTopic}".
        Return a JSON object with:
        1. 'imagePrompt': A detailed description to generate a cute, 2D cartoon style, bright colors image depicting this specific situation. Do NOT include text in the image description.
        2. 'situationContext': A short description of what is happening in the situation (Vietnamese).
        3. 'question': An open-ended question asking the child what they would do in this situation to solve it or behave correctly (Vietnamese).
        4. 'parentGuidance': A friendly, scientific guide for parents to help their child answer. 
           - Use plain text with dashes (-) for bullet points. 
           - Do NOT use HTML tags. 
           - IMPORTANT: Emphasize 1-2 keywords in each sentence by wrapping them in double asterisks like **this** to make it easy to read. (Vietnamese).`;

        const textResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: textPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        imagePrompt: { type: Type.STRING },
                        situationContext: { type: Type.STRING },
                        question: { type: Type.STRING },
                        parentGuidance: { type: Type.STRING }
                    },
                    required: ["imagePrompt", "situationContext", "question", "parentGuidance"]
                }
            }
        });

        const scenarioData = JSON.parse(textResponse.text || "{}");
        if (!scenarioData.imagePrompt) throw new Error("Failed to generate scenario");

        // Step 2: Generate the image based on the prompt
        const imageResponse = await ai.models.generateContent({
             model: 'gemini-2.5-flash-image',
             contents: {
                 parts: [{ text: scenarioData.imagePrompt + " 2D vector art, flat design, cute, for kids app, high quality, no text in image" }]
             }
        });

        let imageUrl = "";
        for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                break;
            }
        }

        if (!imageUrl) throw new Error("Failed to generate image");

        return {
            imagePrompt: scenarioData.imagePrompt,
            imageUrl: imageUrl,
            situationContext: scenarioData.situationContext,
            question: scenarioData.question,
            parentGuidance: scenarioData.parentGuidance
        };

    } catch (error) {
        console.error("Error generating situation game:", error);
        return null;
    }
};

export const evaluateSituationAnswer = async (
    context: string, 
    question: string, 
    userAnswer: string
): Promise<EvaluationResult> => {
    try {
        const prompt = `
        Context: ${context}
        Question: ${question}
        Child's Answer: "${userAnswer}"

        You are a friendly, encouraging teacher for Vietnamese children. 
        Evaluate the child's answer. 
        1. Give a 'score' from 0 to 100 based on how safe, polite, and effective the solution is.
        2. Provide 'feedback' in Vietnamese. If the answer is good, praise them enthusiastically. If it's dangerous or rude, explain gently why and suggest a better way. Keep it short (under 50 words).
        3. 'isPass': true if score >= 60, else false.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        feedback: { type: Type.STRING },
                        isPass: { type: Type.BOOLEAN }
                    },
                    required: ["score", "feedback", "isPass"]
                }
            }
        });

        return JSON.parse(response.text || "{}");

    } catch (error) {
        console.error("Error evaluating answer:", error);
        return {
            score: 0,
            feedback: "Có lỗi xảy ra khi chấm điểm. Bé thử lại nhé!",
            isPass: false
        };
    }
};

// Deprecated or can be removed if not used elsewhere, but keeping for safety as previous code might rely on it before full refactor.
// In the current context, we generate parent guidance in generateSituationGame directly.
export const generateParentGuidance = async (
    situation: string, 
    question: string
): Promise<string> => {
    try {
        const prompt = `
        Bạn là một chuyên gia tâm lý và giáo dục trẻ em xuất sắc.
        
        Tình huống hiện tại trong ứng dụng: "${situation}"
        Câu hỏi đang đặt ra cho trẻ: "${question}"
        
        Nhiệm vụ: Hãy viết một đoạn hướng dẫn ngắn (khoảng 3-4 gạch đầu dòng) dành cho Bố Mẹ để gợi ý cho con trả lời.
        - KHÔNG trả lời hộ bé.
        - Hãy đề xuất các câu hỏi gợi mở để bé tự tư duy.
        - Hướng dẫn cần chuẩn khoa học, an toàn, giọng văn ân cần, khích lệ.
        - Format dưới dạng Markdown đơn giản (gạch đầu dòng).
        - Highlight 1-2 từ khóa quan trọng trong mỗi dòng bằng cách in đậm dùng 2 dấu sao, ví dụ: **từ khóa**.
        - TUYỆT ĐỐI KHÔNG DÙNG HTML TAGS.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Using 3.0 Pro for advanced reasoning context
            contents: prompt,
        });

        return response.text || "Ba mẹ hãy khuyến khích bé suy nghĩ thêm nhé!";
    } catch (error) {
        console.error("Error generating parent guidance:", error);
        return "Hiện tại hệ thống hỗ trợ đang bận. Ba mẹ hãy dùng tình yêu thương để hướng dẫn bé nhé!";
    }
};

// --- FLASHCARD GENERATION ---

export const generateFlashcards = async (topic: string, count: number = 5): Promise<Flashcard[]> => {
    try {
        const prompt = `Hãy tạo ra ${count} thẻ học (flashcard) về chủ đề "${topic}" dành cho trẻ em Việt Nam từ 5-12 tuổi.
        Mỗi thẻ học cần có:
        1. 'front': Một câu hỏi hoặc từ khóa ngắn gọn, dễ hiểu (tối đa 20 từ)
        2. 'back': Đáp án hoặc giải thích đơn giản, thân thiện (tối đa 30 từ)
        
        Các thẻ học phải:
        - Phù hợp với lứa tuổi, sử dụng ngôn ngữ trong sáng, dễ hiểu
        - Có tính giáo dục và thực tế
        - Giúp trẻ ghi nhớ kiến thức một cách vui vẻ
        - Viết bằng tiếng Việt`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            front: {
                                type: Type.STRING,
                                description: "Mặt trước của thẻ học - câu hỏi hoặc từ khóa"
                            },
                            back: {
                                type: Type.STRING,
                                description: "Mặt sau của thẻ học - đáp án hoặc giải thích"
                            }
                        },
                        required: ["front", "back"]
                    }
                }
            }
        });

        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("Empty response from AI");
        
        const flashcardData = JSON.parse(jsonText);

        // Validate and format data
        if (!Array.isArray(flashcardData) || flashcardData.some(c => !c.front || !c.back)) {
            throw new Error("Invalid flashcard data structure from API");
        }

        // Add IDs to flashcards
        return flashcardData.map((card, index) => ({
            id: `card-${index + 1}`,
            front: card.front,
            back: card.back,
            category: topic
        }));

    } catch (error) {
        console.error("Error generating flashcards:", error);
        // Return default flashcards on error
        return [
            {
                id: 'card-1',
                front: 'Khi gặp người lạ, bé nên làm gì?',
                back: 'Bé không nên đi theo người lạ và cần báo ngay cho người lớn biết!',
                category: topic
            },
            {
                id: 'card-2',
                front: 'Khi nào cần nói lời cảm ơn?',
                back: 'Khi ai đó giúp đỡ hoặc cho mình thứ gì đó, bé nên nói "Cảm ơn bạn/anh/chị" nhé!',
                category: topic
            }
        ];
    }
};

// --- MATCHING GAME GENERATION ---

export interface MatchingGameData {
    correctTerm: string;
    correctDefinition: string;
    textOptions: string[]; // 3 options including the correct one
    imagePrompts: string[]; // 3 image prompts including the correct one
    correctTextIndex: number;
    correctImageIndex: number;
}

export const generateMatchingGame = async (
    term: string, 
    definition: string
): Promise<MatchingGameData | null> => {
    try {
        const prompt = `Tạo dữ liệu cho trò chơi ghép đôi dành cho trẻ em Việt Nam.
        
        Từ khóa chính: "${term}"
        Định nghĩa/Ý nghĩa: "${definition}"
        
        Yêu cầu:
        1. Tạo 2 từ khóa khác (cùng chủ đề nhưng khác với từ khóa chính) - tổng cộng 3 từ khóa
        2. Tạo 2 mô tả hình ảnh khác (cùng chủ đề nhưng khác với định nghĩa chính) - tổng cộng 3 mô tả hình ảnh
        3. Tất cả phải phù hợp với trẻ em 5-12 tuổi, dễ hiểu, bằng tiếng Việt
        
        Trả về JSON với:
        - 'textOptions': Mảng 3 từ khóa (trong đó từ khóa chính "${term}" là phần tử đầu tiên)
        - 'imagePrompts': Mảng 3 mô tả hình ảnh (trong đó mô tả cho "${definition}" là phần tử đầu tiên)
        - 'correctTextIndex': 0 (vì từ khóa chính ở vị trí đầu)
        - 'correctImageIndex': 0 (vì hình ảnh đúng ở vị trí đầu)`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        textOptions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Mảng 3 từ khóa, từ khóa chính ở vị trí đầu"
                        },
                        imagePrompts: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Mảng 3 mô tả hình ảnh, hình ảnh đúng ở vị trí đầu"
                        },
                        correctTextIndex: { type: Type.NUMBER },
                        correctImageIndex: { type: Type.NUMBER }
                    },
                    required: ["textOptions", "imagePrompts", "correctTextIndex", "correctImageIndex"]
                }
            }
        });

        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("Empty response from AI");
        
        const gameData = JSON.parse(jsonText);

        // Validate
        if (!Array.isArray(gameData.textOptions) || gameData.textOptions.length !== 3 ||
            !Array.isArray(gameData.imagePrompts) || gameData.imagePrompts.length !== 3) {
            throw new Error("Invalid matching game data structure");
        }

        // Ensure correct term and definition are first
        gameData.textOptions[0] = term;
        gameData.imagePrompts[0] = definition;
        gameData.correctTextIndex = 0;
        gameData.correctImageIndex = 0;

        return {
            correctTerm: term,
            correctDefinition: definition,
            textOptions: gameData.textOptions,
            imagePrompts: gameData.imagePrompts,
            correctTextIndex: 0,
            correctImageIndex: 0
        };

    } catch (error) {
        console.error("Error generating matching game:", error);
        return null;
    }
};

export const generateMatchingGameImages = async (prompts: string[]): Promise<string[]> => {
    try {
        const imageUrls: string[] = [];
        
        for (const prompt of prompts) {
            const imageResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ 
                        text: `${prompt} 2D vector art, flat design, cute cartoon style, bright colors, for kids app, high quality, no text in image, simple and clear` 
                    }]
                }
            });

            let imageUrl = "";
            for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                    break;
                }
            }
            
            if (imageUrl) {
                imageUrls.push(imageUrl);
            } else {
                // Fallback placeholder
                imageUrls.push("");
            }
        }

        return imageUrls;
    } catch (error) {
        console.error("Error generating matching game images:", error);
        return [];
    }
};

// --- DRAG AND DROP GAME GENERATION ---

export interface DragAndDropGameData {
    items: Array<{
        id: string;
        content: string;
        type: 'text' | 'image';
        imagePrompt?: string;
        isCorrect: boolean;
        dropZoneId: string;
    }>;
    dropZones: Array<{
        id: string;
        label: string;
        correctItemId: string;
    }>;
}

export const generateDragAndDropGame = async (
    topic: string,
    term: string,
    definition: string
): Promise<DragAndDropGameData | null> => {
    try {
        const prompt = `Tạo dữ liệu cho trò chơi kéo và thả (drag and drop) dành cho trẻ em Việt Nam.
        
        Chủ đề: "${topic}"
        Từ khóa chính: "${term}"
        Định nghĩa: "${definition}"
        
        Yêu cầu:
        1. Tạo 2-3 vùng thả (drop zones) với nhãn mô tả ngắn gọn (ví dụ: "Hành động đúng", "Điều nên làm", "Kết quả tốt")
        2. Tạo 4-6 mục có thể kéo (items) bao gồm:
           - 1 mục đúng cho mỗi vùng thả (tổng cộng 2-3 mục đúng)
           - 2-3 mục sai (distractor items) liên quan đến chủ đề nhưng không đúng
        3. Mỗi mục có thể là:
           - Văn bản ngắn (tối đa 10 từ)
           - Hoặc mô tả hình ảnh (nếu là hình ảnh, cung cấp 'imagePrompt')
        4. Tất cả phải phù hợp với trẻ em 5-12 tuổi, dễ hiểu, bằng tiếng Việt
        
        Trả về JSON với:
        - 'dropZones': Mảng các vùng thả, mỗi vùng có 'id', 'label', 'correctItemId'
        - 'items': Mảng các mục, mỗi mục có 'id', 'content', 'type' ('text' hoặc 'image'), 'imagePrompt' (nếu type='image'), 'isCorrect', 'dropZoneId'`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        dropZones: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    label: { type: Type.STRING },
                                    correctItemId: { type: Type.STRING }
                                },
                                required: ["id", "label", "correctItemId"]
                            }
                        },
                        items: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    content: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                    imagePrompt: { type: Type.STRING },
                                    isCorrect: { type: Type.BOOLEAN },
                                    dropZoneId: { type: Type.STRING }
                                },
                                required: ["id", "content", "type", "isCorrect", "dropZoneId"]
                            }
                        }
                    },
                    required: ["dropZones", "items"]
                }
            }
        });

        const jsonText = response.text?.trim();
        if (!jsonText) throw new Error("Empty response from AI");
        
        const gameData = JSON.parse(jsonText);

        // Validate
        if (!Array.isArray(gameData.dropZones) || gameData.dropZones.length < 2 ||
            !Array.isArray(gameData.items) || gameData.items.length < 4) {
            throw new Error("Invalid drag and drop game data structure");
        }

        return gameData;

    } catch (error) {
        console.error("Error generating drag and drop game:", error);
        return null;
    }
};

export const generateDragAndDropImages = async (imagePrompts: string[]): Promise<string[]> => {
    try {
        const imageUrls: string[] = [];
        
        for (const prompt of imagePrompts) {
            if (!prompt) {
                imageUrls.push("");
                continue;
            }

            const imageResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ 
                        text: `${prompt} 2D vector art, flat design, cute cartoon style, bright colors, for kids app, high quality, no text in image, simple and clear` 
                    }]
                }
            });

            let imageUrl = "";
            for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                    break;
                }
            }
            
            imageUrls.push(imageUrl || "");
        }

        return imageUrls;
    } catch (error) {
        console.error("Error generating drag and drop images:", error);
        return [];
    }
};
