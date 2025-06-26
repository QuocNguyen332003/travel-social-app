import HistoryArticle from '../../models/HistoryArticle.js';
import ArticleTags from '../../models/ArticleTags.js';
import Page from '../../models/Page.js';
import TouristDestination from '../../models/TouristDestination.js';

async function getAllUserProfiles() {
    const userProfiles = {};
    // Lấy tất cả các userId duy nhất từ lịch sử
    const distinctUserIds = await HistoryArticle.distinct('idUser');

    for (const userId of distinctUserIds) {
        userProfiles[userId] = await dataPreparationUser(userId);
    }
    return userProfiles;
}

async function dataPreparationUser(userId) {
    const userTextTagMap = {};
    const userImagesTagMap = {};
    const history = await HistoryArticle.find({ idUser: userId });

    for (const entry of history) {
        const { idArticle, action } = entry;
        
        const articleTag = await ArticleTags.findOne({ idArticle });
        
        if (!articleTag) continue;
        
        const weightMultiplier = action === 'Like' ? 3 : 1;
        
        for (const tag of articleTag.textTag) {
          userTextTagMap[tag] = (userTextTagMap[tag] || 0) + 1 * weightMultiplier;
        }

        for (const imageTag of articleTag.imagesTag) {
          const { tag, weight } = imageTag;
          userImagesTagMap[tag] = (userImagesTagMap[tag] || 0) + weight * weightMultiplier;
        }
    }

    const userTags = {
        textTags: Object.entries(userTextTagMap)
          .map(([tag, weight]) => ({ tag, weight: Math.round(weight * 1000) / 1000 }))
          .sort((a, b) => b.weight - a.weight),

        imagesTags: Object.entries(userImagesTagMap)
          .map(([tag, weight]) => ({ tag, weight: Math.round(weight * 1000) / 1000 }))
          .sort((a, b) => b.weight - a.weight)
      };

    return userTags;
}

async function dataPreparationPages() {
    const pages = await Page.find({}, '_id listArticle').lean();
    const result = [];

    for (const page of pages) {
      const { _id: pageId, listArticle } = page;

      const articleTags = await ArticleTags.find({
        idArticle: { $in: listArticle }
      }).lean();

      const textTagStats = {};
      const imageTagStats = {};

      for (const tagDoc of articleTags) {
        for (const tag of tagDoc.textTag) {
          if (!textTagStats[tag]) textTagStats[tag] = [];
          textTagStats[tag].push(1);
        }

        for (const imgTag of tagDoc.imagesTag) {
          const tag = imgTag.tag;
          const weight = imgTag.weight;
          if (!imageTagStats[tag]) imageTagStats[tag] = 0;
          imageTagStats[tag] += weight;
        }
      }

      // Tính trung bình textTag
      const textTags = Object.entries(textTagStats).map(([tag, values]) => ({
        tag,
        weight: values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0,
      }));

      //Convert imageTags
      const imageTags = Object.entries(imageTagStats).map(([tag, weight]) => ({
        tag,
        weight,
      }));

      // Lấy TouristDestination theo pageId
      const destination = await TouristDestination.findOne({ pageId }).lean();
      const destinationTags = destination?.tags || [];

      //Cộng thêm weight = 1 cho mỗi tag xuất hiện trong TouristDestination
      const mergeTagWeight = (tagsArr, newTags) => {
        const tagMap = {};
        for (const tagObj of tagsArr) {
          tagMap[tagObj.tag] = tagObj.weight;
        }
        for (const newTag of newTags) {
          if (tagMap[newTag]) tagMap[newTag] += 1;
          else tagMap[newTag] = 1;
        }
        return Object.entries(tagMap).map(([tag, weight]) => ({ tag, weight }));
      };
    
      // Cộng TouristDestination.tags vào textTags
      const finalTextTags = mergeTagWeight(textTags, destinationTags);
      const finalImageTags = imageTags;

      result.push({
        pageId,
        textTags: finalTextTags,
        imageTags: finalImageTags
      });
    }

    return result;
}

async function dataPreparationPagesList(pageIds) {
  // Lọc page theo danh sách truyền vào
  const pages = await Page.find(
    { _id: { $in: pageIds } },
    '_id listArticle'
  ).lean();

  const result = [];

  for (const page of pages) {
    const { _id: pageId, listArticle } = page;

    const articleTags = await ArticleTags.find({
      idArticle: { $in: listArticle }
    }).lean();

    const textTagStats = {};
    const imageTagStats = {};

    for (const tagDoc of articleTags) {
      for (const tag of tagDoc.textTag) {
        if (!textTagStats[tag]) textTagStats[tag] = [];
        textTagStats[tag].push(1);
      }

      for (const imgTag of tagDoc.imagesTag) {
        const tag = imgTag.tag;
        const weight = imgTag.weight;
        if (!imageTagStats[tag]) imageTagStats[tag] = 0;
        imageTagStats[tag] += weight;
      }
    }

    const textTags = Object.entries(textTagStats).map(([tag, values]) => ({
      tag,
      weight: values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0,
    }));

    const imageTags = Object.entries(imageTagStats).map(([tag, weight]) => ({
      tag,
      weight,
    }));

    const destination = await TouristDestination.findOne({ pageId }).lean();
    const destinationTags = destination?.tags || [];

    const mergeTagWeight = (tagsArr, newTags) => {
      const tagMap = {};
      for (const tagObj of tagsArr) {
        tagMap[tagObj.tag] = tagObj.weight;
      }
      for (const newTag of newTags) {
        if (tagMap[newTag]) tagMap[newTag] += 1;
        else tagMap[newTag] = 1;
      }
      return Object.entries(tagMap).map(([tag, weight]) => ({ tag, weight }));
    };

    const finalTextTags = mergeTagWeight(textTags, destinationTags);

    result.push({
      pageId,
      textTags: finalTextTags,
      imageTags: imageTags
    });
  }

  return result;
}

const data_preparation = {
    getAllUserProfiles,
    dataPreparationUser,
    dataPreparationPages,
    dataPreparationPagesList
}
export default data_preparation;