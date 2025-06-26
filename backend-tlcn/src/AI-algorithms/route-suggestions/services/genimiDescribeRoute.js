import { GoogleGenAI } from "@google/genai";
import { env } from "../../../config/environment.js";
import dayjs from 'dayjs';

const ai = new GoogleGenAI({ apiKey: env.API_KEY_GENIMI });

export default async function genimiDescribeRoute(schedule, enrichedPoints, matrix) {
  const { route, bestStartHour } = schedule;
  let currentTime = dayjs().hour(bestStartHour).minute(0).second(0);
  let totalDistance = 0;
  let totalDuration = 0;

  const details = [];

  for (let i = 1; i < route.length; i++) {
    const from = route[i - 1];
    const to = route[i];
    const fromName = enrichedPoints[from].displayName || enrichedPoints[from].address;
    const toName = enrichedPoints[to].displayName || enrichedPoints[to].address;
    const travelTime = matrix[from][to].duration;
    const travelDistance = matrix[from][to].distance;

    currentTime = currentTime.add(travelTime, 'second');

    const visitWindow = enrichedPoints[to]?.idealVisitTime || {};
    const startHour = visitWindow.startHour ?? 'Không rõ';
    const endHour = visitWindow.endHour ?? 'Không rõ';

    details.push(`Từ "${fromName}" đến "${toName}" mất khoảng ${Math.round(travelTime / 60)} phút (${(travelDistance / 1000).toFixed(1)} km). Thời gian lý tưởng đến "${toName}" là từ ${startHour}h đến ${endHour}h.`);

    totalDistance += travelDistance;
    totalDuration += travelTime;

    currentTime = currentTime.add(30, 'minute'); // giả định mỗi địa điểm dừng 30 phút
  }

  const prompt = `Tôi có một lịch trình khởi hành lúc ${bestStartHour}h. Tổng thời gian di chuyển khoảng ${Math.round(totalDuration / 60)} phút và tổng quãng đường là ${(totalDistance / 1000).toFixed(1)} km.\n
    Các chặng cụ thể:\n${details.join('\n')}\n
    Hãy viết một đoạn mô tả thân thiện, truyền cảm hứng cho người dùng để họ có thể dễ hình dung hành trình.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const description = response?.candidates?.[0]?.content?.parts?.[0]?.text || "Không thể tạo mô tả.";
    return description;
  } catch (error) {
    console.error("Lỗi mô tả hành trình:", error);
    return "Không thể tạo mô tả hành trình.";
  }
}
