import genimiVisitTime from './genimiVisitTime.js';
import getDistanceMatrix from './googleMatrix.js';
import dayjs from 'dayjs';
import Trip from '../../../models/Trip.js';
import findVisitTime from './findVisitTime.js';
import genimiDescribeRoute from './genimiDescribeRoute.js';

function generatePermutations(arr) {
  if (arr.length <= 1) return [arr];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of generatePermutations(rest)) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

function calculateScore(route, matrix, useDistance, useDuration) {
  let totalDistance = 0;
  let totalDuration = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const from = route[i];
    const to = route[i + 1];
    totalDistance += matrix[from][to].distance;
    totalDuration += matrix[from][to].duration;
  }

  // Chuyển distance sang thời gian tương đương
  const distanceAsDuration = totalDistance * 0.06;

  let score = 0;
  if (useDistance && useDuration) score = (distanceAsDuration + totalDuration)/2;
  else if (useDistance) score = distanceAsDuration;
  else if (useDuration) score = totalDuration;
  return {score: score, distandce: totalDistance, duration: totalDuration};
}

function findBestRoutes(matrix, useDistance = true, useDuration = true) {
  const n = matrix.length;
  const start = 0;
  const end = n - 1;
  const middlePoints = Array.from({ length: n - 2 }, (_, i) => i + 1);

  const permutations = generatePermutations(middlePoints);

  const scoredRoutes = permutations.map(perm => {
    const fullRoute = [start, ...perm, end];
    const {score, distandce, duration} = calculateScore(fullRoute, matrix, useDistance, useDuration);
    return { route: fullRoute, score, distandce, duration };
  });

  // Sắp xếp theo điểm số tăng dần (tốt nhất đầu tiên)
  scoredRoutes.sort((a, b) => a.score - b.score);

  return scoredRoutes;
}

export default async function optimizeRoute(input) {
  const trip = await Trip.findById(input.tripId)
  .populate('startAddress')
  .populate('listAddress')
  .populate('endAddress');

  const allPoints = [
    trip.startAddress,
    ...trip.listAddress,
    trip.endAddress
  ];
  
  const date = dayjs(input.startDateTime).format('YYYY-MM-DD');

  // 1. Enrich điểm đến với idealVisitTime
  const enrichedPoints = await genimiVisitTime(allPoints, date);

  // 2. Lấy ma trận khoảng cách và thời gian
  const matrixRaw = await getDistanceMatrix(enrichedPoints);
  const matrix = matrixRaw.rows.map(row =>
    row.elements.map(e => ({
      distance: e.distance.value,
      duration: e.duration.value
    }))
  );

  // 3. Tối ưu lộ trình
  const visitOrder = findBestRoutes(matrix, input.useDistance, input.useDuration);
  const penaltyPerHour = findVisitTime.computePenaltyPerHour(visitOrder);
  const bestSchedules = await Promise.all(
    visitOrder.slice(0, 3).map(async (r) => {
      const schedule = findVisitTime.findBestStartTimeForRoute(
        r, matrix, enrichedPoints, input.startDateTime, input.visitingTime, penaltyPerHour
      );
      const description = await genimiDescribeRoute(schedule, enrichedPoints, matrix);
      return {
        ...schedule,
        description,
      };
    })
  );
  
  // Sắp xếp theo điểm tốt nhất
  bestSchedules.sort((a, b) => a.score - b.score);

  return bestSchedules;
}

