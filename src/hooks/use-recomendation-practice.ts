/** @format */

import * as Store from "~store";

const useRecommendationPractice = () => Store.useAppSelector(store => store.practice.recommendationPracticeToDay);

export default useRecommendationPractice;
