
function extractTagsAndWeights(tagList) {
  if (!Array.isArray(tagList) || tagList.length === 0) {
    return {};
  }
  const tagsMap = {};
  for (const item of tagList) {
    if (item && typeof item.tag === 'string' && typeof item.weight === 'number') {
      tagsMap[item.tag] = item.weight;
    } else {
      // console.warn("Skipping malformed tag item:", item);
    }
  }
  return tagsMap;
}

function buildVocabularyFromProfiles(profileList) {
  const allTags = new Set();
  profileList.forEach(profile => {
    if (profile) {
      Object.keys(profile).forEach(tag => allTags.add(tag));
    }
  });
  return Array.from(allTags);
}

function calculateCosineSimilarity(profile1, profile2, vocabulary) {
  if (!vocabulary || vocabulary.length === 0 || !profile1 || !profile2) {
    return 0;
  }

  const vec1 = new Array(vocabulary.length).fill(0);
  const vec2 = new Array(vocabulary.length).fill(0);

  for (let i = 0; i < vocabulary.length; i++) {
    const tag = vocabulary[i];
    if (profile1[tag]) {
      vec1[i] = profile1[tag];
    }
    if (profile2[tag]) {
      vec2[i] = profile2[tag];
    }
  }

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vocabulary.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }

  return dotProduct / (mag1 * mag2);
}

export {
  extractTagsAndWeights,
  buildVocabularyFromProfiles,
  calculateCosineSimilarity,
};