import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AppService } from 'app/app.service';
const Ansi = require('ansi-to-html');
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  document: Document;
  validUrl: boolean = false;
  sites = '';
  projectID = '';
  loading = false;
  showScore = false;
  toggleModal = false;
  validUploadConfig = false;
  selectedPreset = 'lighthouse:recommended';
  presets = [
    {
      name: 'All',
      value: 'lighthouse:all',
    },
    {
      name: 'Recommended',
      value: 'lighthouse:recommended',
    },
    {
      name: 'No PWA',
      value: 'lighthouse:no-pwa',
    },
  ];
  auditProgress = '';
  auditId: string;
  convert = new Ansi();
  lhciScores = [
    {
      name: 'Performance',
      label: 'performance',
      score: 0,
      class: null,
    },
    {
      name: 'Accessibility',
      label: 'accessibility',
      score: 0,
      class: null,
    },
    {
      name: 'Best Practices',
      label: 'bestPractices',
      score: 0,
      class: null,
    },
    {
      name: 'SEO',
      label: 'seo',
      score: 0,
      class: null,
    },
    {
      name: 'PWA',
      label: 'pwa',
      score: 0,
      class: null,
    },
  ];
  projects = [];
  projectBranches = [];
  property: any = {};
  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.updateProgress();
    this.fetchProjects();
  }

  get user(): any {
    return window?.OpAuthHelper?.getUserInfo();
  }

  scrollBottom = () => {
    document
      .querySelector('#codeBlock')
      .scrollTo(0, document.querySelector('#codeBlock').scrollHeight);
  };

  validateUrl = (url: string) => {
    this.validUrl = url.indexOf('http://') == 0 || url.indexOf('https://') == 0;
  };

  fetchProjectDetails = () => {
    if (this.property.buildToken) {
      this.appService
        .fetchProjectDetails(
          environment.LH_SERVER_URL,
          this.property.buildToken
        )
        .then((response) => {
          if (response.fetchProjectDetails?.id === this.projectID) {
            this.validUploadConfig = true;
            window.OpNotification.success({
              subject: `Valid Token`,
              body: `Token valid for project ${response.fetchProjectDetails?.name}.`,
            });
          } else {
            this.validUploadConfig = false;
            window.OpNotification.warning({
              subject: `Invalid Token`,
              body: `Build token is invalid.`,
            });
          }
        });
    }
  };

  updateProgress = () => {
    this.appService.autorun().subscribe((progress: string) => {
      if (progress.substr(0, this.auditId.length) === this.auditId) {
        if (progress.replace(this.auditId, '')) {
          progress = progress.replace(this.auditId, '');
          if (progress !== `1`) {
            progress = this.linkParser(progress);
            this.auditProgress += this.convert.toHtml(progress);
          } else {
            this.loading = false;
            window.OpNotification.success({
              subject: `Audit completed successfully`,
            });
            this.fetchScore(this.auditId);
          }
          this.scrollBottom();
        }
      }
    });
  };

  linkParser = (progress) => {
    const replacePattern1 =
      /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    let replacedText = progress.replace(
      replacePattern1,
      '<a href="$1" target="_blank">$1</a>'
    );
    replacedText = replacedText.replace(
      replacePattern2,
      '$1<a href="http://$2" target="_blank">$2</a>'
    );
    return replacedText;
  };

  auditWebsite = () => {
    this.auditProgress = ``;
    this.loading = true;
    this.showScore = false;
    const property = {
      sites: this.sites,
      preset: this.selectedPreset,
    };
    this.appService.auditWebsite(property).subscribe((response) => {
      this.auditId = response.auditWebsite;
      window.OpNotification.success({
        subject: `Audit started successfully`,
      });
    });
  };

  fetchScore = (auditId) => {
    this.appService.fetchScore(auditId).then((responses) => {
      this.showScore = true;
      const scores = responses.reduce((acc, val) => {
        Object.keys(val).map((prop: any) => {
          if (acc.hasOwnProperty(prop)) {
            acc[prop] += val[prop];
          } else {
            acc[prop] = val[prop];
          }
        });
        return acc;
      }, {});

      this.lhciScores.map((record) => {
        Object.keys(scores).map((key) => {
          if (key === record.label) {
            record.score = Math.trunc((scores[key] / responses.length) * 100);
            if (record.score >= 0 && record.score <= 49) {
              record.class = 'orange';
            } else if (record.score >= 50 && record.score <= 89) {
              record.class = 'blue';
            } else if (record.score >= 90 && record.score <= 100) {
              record.class = 'green';
            }
            return record;
          }
        });
      });
    });
  };

  fetchProjects = () => {
    this.appService
      .fetchProjects(environment.LH_SERVER_URL)
      .then((responses) => {
        this.projects = responses.listLHProjects;
      });
  };

  fetchProjectBranches = () => {
    if (this.projectID) {
      this.appService
        .fetchProjectBranches(environment.LH_SERVER_URL, this.projectID)
        .then((responses) => {
          this.projectBranches = responses.listLHProjectBranches;
        });
    }
  };

  upload = (property) => {
    const uploadProperty = {
      auditId: this.auditId,
      serverBaseUrl: environment.LH_SERVER_URL,
      authorName: this.user.fullName,
      authorEmail: this.user.email,
      ...property,
    };
    this.toggleModal = false;
    this.appService.upload(uploadProperty).subscribe((response) => {
      if (response.upload) {
        window.OpNotification.success({
          subject: `Started upload of LHR Report`,
          body: `LHR Upload to ${environment.LH_SERVER_URL} in progress.`,
        });
      }
    });
  };
}
