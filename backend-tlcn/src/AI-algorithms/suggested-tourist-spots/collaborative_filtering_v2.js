import { buildVocabularyFromProfiles, calculateCosineSimilarity, extractTagsAndWeights } from "./utils/recommendationUtils.js";
import historyViewPageService from "../../services/historyViewPageService.js";
import Page from "../../models/Page.js";

function findSimilarUsers(targetUserId, allUserProfiles, topN = 5) {
    const targetUser = allUserProfiles[targetUserId];
    if (!targetUser) {
        console.warn(`Người dùng với ID ${targetUserId} không tìm thấy.`);
        return [];
    }

    const similarities = [];
    const allTextProfilesForVocab = [extractTagsAndWeights(targetUser.textTags)];
    const allImageProfilesForVocab = [extractTagsAndWeights(targetUser.imagesTags)];

    // Thu thập tất cả các profile để xây dựng từ vựng chung
    for (const userId in allUserProfiles) {
        if (userId !== targetUserId) {
            const userProfile = allUserProfiles[userId];
            allTextProfilesForVocab.push(extractTagsAndWeights(userProfile.textTags));
            allImageProfilesForVocab.push(extractTagsAndWeights(userProfile.imagesTags));
        }
    }

    const textVocabulary = buildVocabularyFromProfiles(allTextProfilesForVocab);
    const imageVocabulary = buildVocabularyFromProfiles(allImageProfilesForVocab);

    const targetUserTextProfile = extractTagsAndWeights(targetUser.textTags);
    const targetUserImageProfile = extractTagsAndWeights(targetUser.imagesTags);

    for (const userId in allUserProfiles) {
        if (userId === targetUserId) continue; // Bỏ qua chính người dùng đó

        const currentUserProfile = allUserProfiles[userId];
        const currentUserTextProfile = extractTagsAndWeights(currentUserProfile.textTags);
        const currentUserImageProfile = extractTagsAndWeights(currentUserProfile.imagesTags);

        // Tính toán độ tương đồng cho hồ sơ văn bản và hình ảnh
        const textSimilarity = calculateCosineSimilarity(
            targetUserTextProfile,
            currentUserTextProfile,
            textVocabulary
        );
        const imageSimilarity = calculateCosineSimilarity(
            targetUserImageProfile,
            currentUserImageProfile,
            imageVocabulary
        );

        // Kết hợp độ tương đồng (có thể điều chỉnh trọng số nếu cần)
        const combinedSimilarity = (textSimilarity + imageSimilarity) / 2; // Ví dụ: lấy trung bình

        if (combinedSimilarity > 0) { // Chỉ thêm nếu có độ tương đồng
            similarities.push({ userId: userId, similarity: combinedSimilarity
            });
        }
    }

    // Sắp xếp theo độ tương đồng giảm dần và lấy top N
    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, topN);
}

async function recommendationsCF(targetUserId, allUserProfiles, topN = 5) {
    // Bước 1: Tìm người dùng tương tự
    const similarUsers = findSimilarUsers(targetUserId, allUserProfiles, 10); // tìm nhiều hơn topN để có đủ dữ liệu

    if (!similarUsers.length) return [];

    // Bước 2: Lấy các trang đã xem của user hiện tại
    const targetUserViews = await historyViewPageService.getViewByUserId(targetUserId);
    const viewedPageIds = new Set(targetUserViews.map(v => v.idPage._id.toString()));

    // Bước 3: Đếm tần suất các page từ những user tương tự
    const pageScores = {};

    for (const similarUser of similarUsers) {
        const userViews = await historyViewPageService.getViewByUserId(similarUser.userId);

        for (const view of userViews) {
            const pageId = view.idPage._id.toString();
            if (!viewedPageIds.has(pageId)) {
                if (!pageScores[pageId]) {
                    pageScores[pageId] = 0;
                }
                // Tăng điểm dựa trên độ tương đồng
                pageScores[pageId] += similarUser.similarity;
            }
        }
    }

    // Bước 4: Sắp xếp các page theo điểm số và chọn top N
    return Object.entries(pageScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([pageId, score]) => ({ pageId, score }));
}

async function getRecommendedPagesWithDetails(userId, allUserProfiles, topN = 5) {
    const rawRecommendations = await recommendationsCF(userId, allUserProfiles, topN);

    // Lấy thông tin chi tiết của tất cả các pageId
    const pageIds = rawRecommendations.map(r => r.pageId);
    const pages = await Page.find({ _id: { $in: pageIds } })
        .select('_id name avt')
        .populate({
            path: 'avt',
            model: 'MyPhoto'
        });

    // Tạo map để gộp thông tin điểm
    const scoreMap = new Map(rawRecommendations.map(r => [r.pageId, r.score]));

    // Gộp điểm vào mỗi page object
    const result = pages.map(page => {
        return {
            ...page.toObject(), // chuyển từ Mongoose Document sang JS object
            score: scoreMap.get(page._id.toString())
        };
    });

    // Đảm bảo sắp xếp theo điểm
    result.sort((a, b) => b.score - a.score);

    return result;
}

export {
    findSimilarUsers,
    recommendationsCF,
    getRecommendedPagesWithDetails
};