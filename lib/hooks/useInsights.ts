import { useRouter } from "next/router";
import useSWR from "swr";

interface Insight {
  allReposTotal: number;
  allPrsTotal: number;
  spamTotal: number;
  acceptedTotal: number;
  unlabeledPrsTotal: number;
  spamPercentage: number;
  acceptedPercentage: number;
  unlabeledPercentage: number;
}

const getInsights = (insights: DbInsight[], intervalDay = 0): Insight => {
  const currentInsights = insights.find(insight => insight.interval === intervalDay) as DbInsight;
  
  if (!currentInsights) {
    return {
      allPrsTotal: 0,
      allReposTotal: 0,
      spamTotal: 0,
      acceptedTotal: 0,
      spamPercentage: 0,
      acceptedPercentage: 0,
      unlabeledPrsTotal: 0,
      unlabeledPercentage: 0
    };
  }

  const spam = (currentInsights.all_prs || 0) > 0 ? Math.round((currentInsights.spam_prs / currentInsights.all_prs) * 100) : 0;
  const accepted = (currentInsights.all_prs || 0) > 0 ? Math.round((currentInsights.accepted_prs / currentInsights.all_prs) * 100) : 0;
  const unlabeledPrsTotal = Math.max(currentInsights.all_prs - (currentInsights.spam_prs + currentInsights.accepted_prs), 0);
  const unlabeled = Math.max(0, (currentInsights.all_prs || 0) > 0 ? Math.round(Math.min(currentInsights.all_prs - (currentInsights.spam_prs + currentInsights.accepted_prs), 0) / currentInsights.all_prs * 100) : 0);

  return {
    allReposTotal: currentInsights.all_repos,
    allPrsTotal: currentInsights.all_prs,
    spamTotal: currentInsights.spam_prs,
    acceptedTotal: currentInsights.accepted_prs,
    unlabeledPrsTotal,
    spamPercentage: spam,
    acceptedPercentage: accepted,
    unlabeledPercentage: unlabeled
  };
};

const useInsights = () => {
  const router = useRouter();
  const { filterName } = router.query;
  const topic = filterName as string;

  const baseEndpoint = `${topic}/insights`;
  const endpointString = `${baseEndpoint}`;
  const { data, error, mutate } = useSWR<DbInsight[], Error>(topic ? endpointString : null);

  return {
    data: data || [],
    isLoading: !error && !data,
    isError: !!error,
    mutate
  };
};

export { useInsights, getInsights };
