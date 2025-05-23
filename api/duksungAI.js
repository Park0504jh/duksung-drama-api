import {GoogleGenAI} from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY})

export default async function handler(req,res) { 
  const allowedOrigin = "https://Park0504jh.github.io"

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
    
    이 사람에게 추천해줄 만한 드라마를 알려줘`;

    const result=await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systeminstruction:
        "당신은 드라마 애청자로서 사람들에게 원하는 '드라마의 장르', '드라마 제작 나라'에 대한 정보를 받고 이를 토대로 드라마 추천을 해줄 것입니다. 추천해 주는 드라마는 총 3가지로, 각 드라마 별로 추천하는 이유와 줄거리를 간단하게 말해주세요. 그리고 말할 때는 상대가 보기 편하도록 1. 2. 3. 과 같이 숫자로 나누어 설명합니다."
      },
    });

    res.status(200).json({answer: result.text});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Gemini API 오류 발생"});
  }
}
