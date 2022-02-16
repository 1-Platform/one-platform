import { TitleCasePipe } from '@angular/common';
import { LeaderboardCategory } from 'app/leaderboard/enum';
import { Column } from 'app/shared/components/table/table.component';

type Options = {
  row: LHLeaderboard;
  titleCasePipe: TitleCasePipe;
  isSelected?: boolean;
};

const getAvgScore = (scores: number[]) => {
  const avg = scores.reduce((prev, curr) => prev + curr, 0) / scores.length;
  return Math.min(Math.max(Math.round(avg), 0), 100);
};

const getScoreColor = (score: number) => {
  if (score >= 0 && score <= 49) {
    return 'score-low pf-u-font-weight-bold';
  } else if (score > 49 && score <= 89) {
    return 'score-avg pf-u-font-weight-bold';
  } else if (score > 89 && score <= 100) {
    return 'score-good pf-u-font-weight-bold';
  }
};

export const getLeaderboardCells = ({
  row,
  titleCasePipe,
  isSelected,
}: Options) => {
  const { score, branch, project, rank } = row;
  const total = getAvgScore(Object.values(score));
  return [
    {
      title: rank,
    },
    {
      title: titleCasePipe.transform(project.name),
      chipTitle: branch,
      chipColor: isSelected ? 'blue' : 'gray',
    },
    {
      title: score.accessibility,
      cellClassName: getScoreColor(score.accessibility),
    },
    {
      title: score.bestPractices,
      cellClassName: getScoreColor(score.bestPractices),
    },
    {
      title: score.performance,
      cellClassName: getScoreColor(score.performance),
    },
    {
      title: score.pwa,
      cellClassName: getScoreColor(score.pwa),
    },
    {
      title: score.seo,
      cellClassName: getScoreColor(score.seo),
    },
    {
      title: total,
      cellClassName: getScoreColor(total),
    },
  ];
};

export const LEADERBOARD_COLUMNS: (Column & { key?: LeaderboardCategory })[] = [
  {
    title: 'Rank',
  },
  {
    title: 'Project',
  },
  {
    title: 'Accessibility',
    isSortable: true,
    key: LeaderboardCategory.ACCESSIBILITY,
  },
  {
    title: 'Best Practices',
    isSortable: true,
    key: LeaderboardCategory.BEST_PRACTICES,
  },
  {
    title: 'Performance',
    isSortable: true,
    key: LeaderboardCategory.PERFORMANCE,
  },
  {
    title: 'PWA',
    isSortable: true,
    key: LeaderboardCategory.PWA,
  },
  {
    title: 'SEO',
    isSortable: true,
    key: LeaderboardCategory.SEO,
  },
  {
    title: 'Total',
    isSortable: true,
    sortDir: 'DESC',
    key: LeaderboardCategory.OVERALL,
  },
];
