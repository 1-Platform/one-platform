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
  return Math.min(Math.max(avg, 0), 100);
};

const getScoreColor = (score: number) => {
  if (score >= 0 && score <= 49) {
    return 'score-low pf-u-font-weight-bold';
  } else if (score >= 50 && score <= 89) {
    return 'score-avg pf-u-font-weight-bold';
  } else if (score >= 90 && score <= 100) {
    return 'score-good pf-u-font-weight-bold';
  }
};

export const getLeaderboardCells = ({
  row,
  titleCasePipe,
  isSelected,
}: Options) => {
  const { score, build, project, rank } = row;
  const total = getAvgScore(Object.values(score));
  return [
    {
      title: rank,
    },
    {
      title: titleCasePipe.transform(project.name),
      chipTitle: build.branch,
      chipColor: isSelected ? 'blue' : 'gray',
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
    title: 'Total',
    isSortable: true,
    sortDir: 'DESC',
    key: LeaderboardCategory.OVERALL,
  },
];
