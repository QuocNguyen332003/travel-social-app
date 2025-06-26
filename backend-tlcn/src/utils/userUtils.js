import User from '../models/User.js'
import Hobby from '../models/Hobby.js';

export async function createUserHobbyVectors() {
  const allHobbies = await Hobby.find().select('_id').lean();
  const hobbyIndexMap = new Map(
    allHobbies.map((hobby, index) => [hobby._id.toString(), index])
  );

  const totalHobbies = allHobbies.length;
  const allUsers = await User.find().select('hobbies').lean();
  const userVectors = new Map();

  for (const user of allUsers) {
    const vector = Array(totalHobbies).fill(0);
    
    for (const hobbyId of user.hobbies) {
      const index = hobbyIndexMap.get(hobbyId.toString());
      if (index !== undefined) {
        vector[index] = 1;
      }
    }
    userVectors.set(user._id.toString(), vector);
  }

  return { userVectors, hobbyIndexMap };
}

export function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}