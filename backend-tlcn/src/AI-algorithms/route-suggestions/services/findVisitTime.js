import dayjs from 'dayjs';

function computePenaltyPerHour(routeScores, weightAvg = 0.004, weightSpread = 0.01) {
    const scores = routeScores.map(r => r.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const min = Math.min(...scores);
    const max = Math.max(...scores);
  
    const penaltyFromAvg = avg * weightAvg;
    const penaltyFromSpread = (max - min) * weightSpread;
  
    return penaltyFromAvg + penaltyFromSpread;
}
  
function scoreRouteAtStartHour(route, matrix, enrichedPoints, baseDate, visitingTime, penaltyPerHour, hour, minute = 0) {
    const startTime = dayjs(baseDate).hour(hour).minute(minute).second(0);
    let currentTime = startTime;
    let totalScore = 0;
  
    for (let i = 1; i < route.length - 1; i++) {
      const from = route[i - 1];
      const to = route[i];
  
      const travelDuration = matrix[from][to].duration;
      currentTime = currentTime.add(travelDuration, 'second');
  
      const visitInfo = enrichedPoints[to]?.idealVisitTime;
      if (visitInfo) {
        const visitHour = currentTime.hour();
        const { startHour, endHour } = visitInfo;
  
        if (visitHour < startHour) {
          totalScore += (startHour - visitHour) * penaltyPerHour;
        } else if (visitHour > endHour) {
          totalScore += (visitHour - endHour) * penaltyPerHour;
        }
      }
  
      const visitDurationMinutes = visitingTime[to] || 30;
      currentTime = currentTime.add(visitDurationMinutes, 'minute');
    }
  
    return totalScore;
  }
  

function findBestStartTimeForRoute(bestRoutes, matrix, enrichedPoints, baseDate, visitingTime, penaltyPerHour) {
    let bestHour = 0;
    let bestMinute = 0;
    let bestScore = Infinity;
  
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute++) {
            const score = scoreRouteAtStartHour(bestRoutes.route, matrix, enrichedPoints, baseDate, visitingTime, penaltyPerHour, hour, minute) + bestRoutes.score;
            if (score < bestScore) {
                bestScore = score;
                bestHour = hour;
                bestMinute = minute;
            }
        }
    }
  
    return {
      route: bestRoutes.route,
      score: bestScore,
      bestStartHour: bestHour,
      distandce: bestRoutes.distandce,
      duration: bestRoutes.duration
    };
}
  
const findVisitTime = {
    findBestStartTimeForRoute,
    computePenaltyPerHour
}

export default findVisitTime;