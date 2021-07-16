import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'app/dashboard/dashboard.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent implements OnInit {
  apps: PropertyApps[] = [];
  scores: Record<string, CardScore[]> = {};
  title = '';
  appListLoading = true;
  scoreLoading = true;
  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const propertyId = params.id;
      this.dashboardService
        .getLHPropertyById(propertyId)
        .valueChanges.subscribe(({ data, loading }) => {
          const { apps, projectId, name } = data.getLHPropertyById;
          this.apps = apps;
          this.title = name;
          this.appListLoading = loading;
          // fetch scores for all apps
          this.dashboardService
            .getLHPropertyScores(projectId, apps)
            .valueChanges.subscribe(({ data, loading }) => {
              Object.entries(data).map(([id, appLatestBuild]) => {
                const buildScore = this.getAverageScore(
                  appLatestBuild[0].score
                );
                const originalId = id.slice(3);
                this.scoreLoading = loading;

                this.scores[originalId] = this.scoreFormater(buildScore);
              });
            });
        });
    });
  }

  getAverageScore(scoreList: Score[]) {
    const totalNumberOfScores = scoreList.length;
    return scoreList.reduce(
      (average, score) => {
        Object.keys(average).map((scoreType) => {
          average[scoreType] += Math.floor(
            (score[scoreType] / totalNumberOfScores) * 100
          );
        });
        return average;
      },
      {
        pwa: 0,
        accessibility: 0,
        seo: 0,
        bestPractices: 0,
        performance: 0,
      }
    );
  }

  scoreFormater(score: Score): CardScore[] {
    const formatedScores: CardScore[] = [
      {
        label: 'Performance',
        name: 'performance',
        score: 0,
      },
      {
        label: 'Accessibility',
        name: 'accessibility',
        score: 0,
      },
      {
        label: 'Best Practices',
        name: 'bestPractices',
        score: 0,
      },
      {
        label: 'SEO',
        name: 'seo',
        score: 0,
      },
      {
        label: 'PWA',
        name: 'pwa',
        score: 0,
      },
    ];
    return formatedScores.map((formatedScore) => {
      formatedScore.score = score[formatedScore.name];
      return formatedScore;
    });
  }
}
