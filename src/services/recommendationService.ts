import getYouTubeID from "get-youtube-id";

import * as recommendationRepository from "../repositories/recommendationRepository";

interface ChangeScoreParams {
  id:number;
  increment:number;
}

export async function saveRecommendation(name: string, youtubeLink: string) {
  const youtubeId = getYouTubeID(youtubeLink);

  if (youtubeId === null) {
    return null;
  }

  const song ={name,youtubeLink,score:0}
  return await recommendationRepository.create(song);
}

export async function upvoteRecommendation(id: number) {
  const changeScore = {id,increment:-1}
  return await changeRecommendationScore(changeScore);
}

export async function downvoteRecommendation(id: number) {
  const recommendation = await recommendationRepository.findById(id);
  if (recommendation.score === -5) {
    return await recommendationRepository.destroy(id);
  } else {
    const changeScore = {id,increment:-1}
    return await changeRecommendationScore(changeScore);
  }
}

export async function getRandomRecommendation() {
  const random = Math.random();

  interface Recommendations {

  }

  let recommendations;
  const orderBy = "RANDOM()";

  if (random > 0.7) {
    recommendations = await recommendationRepository.findRecommendations(
      -5,
      10,
      orderBy
    );
  } else {
    recommendations = await recommendationRepository.findRecommendations(
      11,
      Infinity,
      orderBy
    );
  }

  return recommendations[0];
}

async function changeRecommendationScore(changeScore:ChangeScoreParams) {
  const result = await recommendationRepository.incrementScore(changeScore);
  return result.rowCount === 0 ? null : result;
}
