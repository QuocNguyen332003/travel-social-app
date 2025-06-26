import Page from "../../models/Page.js";
import { buildVocabularyFromProfiles, calculateCosineSimilarity, extractTagsAndWeights } from "./utils/recommendationUtils.js";

function recommendationsContentBase(userDataInput, allPagesData, weights) {
  const recommendationWeights = weights || { text: 0.6, image: 0.4 };

  if (!userDataInput || (!userDataInput.textTags && !userDataInput.imageTags)) {
    return null;
  }

  // 1. Trích xuất profiles cho người dùng
  const userTextProfile = extractTagsAndWeights(userDataInput.textTags);
  const userImageProfile = extractTagsAndWeights(userDataInput.imagesTags);
  // 2. Trích xuất profiles cho tất cả các pages và thu thập profiles để xây dựng từ vựng
  const allTextProfilesForVocab = [userTextProfile];
  const allImageProfilesForVocab = [userImageProfile];

  const processedPages = allPagesData.map(page => {
    const pageTextProfile = extractTagsAndWeights(page.textTags);
    const pageImageProfile = extractTagsAndWeights(page.imageTags);

    allTextProfilesForVocab.push(pageTextProfile);
    allImageProfilesForVocab.push(pageImageProfile);

    return {
      pageId: page.pageId,
      textProfile: pageTextProfile,
      imageProfile: pageImageProfile,
    };
  });

  // 3. Xây dựng từ vựng riêng biệt
  const textVocabulary = buildVocabularyFromProfiles(allTextProfilesForVocab);
  const imageVocabulary = buildVocabularyFromProfiles(allImageProfilesForVocab);

  // 4. Tính toán điểm gợi ý cho mỗi page
  const recommendations = processedPages.map(page => {
    const textScore = calculateCosineSimilarity(
      userTextProfile,
      page.textProfile,
      textVocabulary
    );

    const imageScore = calculateCosineSimilarity(
      userImageProfile,
      page.imageProfile,
      imageVocabulary
    );

    const combinedScore =
      (textScore * recommendationWeights.text) +
      (imageScore * recommendationWeights.image);

    return {
      pageId: page.pageId,
      textScore: textScore,
      imageScore: imageScore,
      combinedScore: combinedScore,
    };
  });

  // 5. Sắp xếp các gợi ý theo điểm kết hợp giảm dần
  recommendations.sort((a, b) => b.combinedScore - a.combinedScore);

  return {
    recommendations
  };
}

async function recommendationsCB(userDataInput, allPagesData, weights) {
  const { recommendations } = await recommendationsContentBase(userDataInput, allPagesData, weights);
  
  const result = await Promise.all(
    recommendations.map(async (recommendation) => {
      const pages = await Page.findById(recommendation.pageId)
        .select('_id name avt')
        .populate({
            path: 'avt',
            model: 'MyPhoto'
        });
      
      return {
        page: pages,
        ...recommendation
      }
    })
  )
  return result;
}

export default recommendationsCB;