import {GoogleGenAI} from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY})

export default async function handler(req,res) { 
  const allowedOrigin = "https://park0504jh.github.io"

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if(req.method==="OPTIONS") {
    return res.status(200).end();
  }

  const {type, country}=req.body;
  if (!type||!country){
    return res.status(400).json({error: "원하시는 장르(type)와 나라(country)가 필요합니다."})
  }

  try {

    const prompt=`
    장르 : ${type}
    나라 : ${country}
    
    아래와 같은 형식으로, 총 3개의 드라마를 추천해 주세요:
    
    1. <드라마 제목>
    - 줄거리
    - 추천 이유 (왜 이 드라마가 이 사람에게 적합한지)
    
    2. <드라마 제목>
    - 줄거리
    - 추천 이유
    
    3. <드라마 제목>
    - 줄거리
    - 추천 이유

`;

    const result=await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systeminstruction:
        "당신은 드라마 애청자로서 사람들에게 원하는 '드라마의 장르', '드라마 제작 나라'에 대한 정보를 받고 이를 토대로 드라마 추천을 해줄 것입니다. 추천해 주는 드라마는 총 3가지로, 각 드라마 별로 추천하는 이유와 줄거리를 간단하게 말해주세요. 이 외에 다른 정보는 덧붙이지 않습니다. 각 항목 사이에 한 줄씩 띄워서 사람이 읽기 편하게 해주세요. 모든 문장은 '~해요', '~이에요', '~돼요'처럼 '요'로 끝나는 친근한 말투로 작성해주세요. 절대 '~다', '~입니다'와 같은 딱딱한 말투는 사용하지 마세요."
      },
    });

    res.status(200).json({answer: result.text});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Gemini API 오류 발생"});
  }
}
