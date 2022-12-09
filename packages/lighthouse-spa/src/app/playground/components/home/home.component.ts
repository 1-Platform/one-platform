import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaygroundService } from '../../../playground/playground.service';
import { Subject, Subscription } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

const Ansi = require('ansi-to-html');
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  document: Document;
  sites = '';
  loading = false;
  showScore = false;
  toggleModal = false;
  selectedPreset = 'perf';
  presets = [
    {
      name: 'Performance',
      value: 'perf',
    },
    {
      name: 'Desktop',
      value: 'desktop',
    },
    {
      name: 'Experimental',
      value: 'experimental',
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

  destroySub: Subject<boolean> = new Subject<boolean>();

  // upload form management
  auditUploadForm = new UntypedFormGroup({
    project: new UntypedFormControl('', [
      Validators.required,
      this.whitespaceValidator,
    ]),
    branch: new UntypedFormControl('', [
      Validators.required,
      this.whitespaceValidator,
    ]),
    buildToken: new UntypedFormControl('', [
      Validators.required,
      this.whitespaceValidator,
    ]),
  });
  auditUploadFormSubscription: Subscription;

  constructor(
    private appService: PlaygroundService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.updateProgress();
    window.OpAuthHelper?.onLogin(() => {
      this.router.queryParams
        .pipe(takeUntil(this.destroySub))
        .subscribe((params) => {
          const siteUrl = params.siteUrl as string;
          const preset = params.preset;
          if (siteUrl && preset) {
            this.sites = siteUrl;
            this.selectedPreset = preset;
            this.auditWebsite();
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.destroySub.next(true);
    this.destroySub.unsubscribe();
  }

  get user(): any {
    return window?.OpAuthHelper?.getUserInfo();
  }

  scrollBottom = (): void => {
    document
      .querySelector('#codeBlock')
      .scrollTo(0, document.querySelector('#codeBlock').scrollHeight);
  };

  whitespaceValidator(control: UntypedFormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  updateProgress = (): void => {
    this.appService
      .autorun()
      .pipe(takeUntil(this.destroySub))
      .subscribe((progress: string) => {
        if (progress.substr(0, this.auditId.length) === this.auditId) {
          progress = progress.replace(this.auditId, '');
          progress = this.linkParser(progress);
          this.auditProgress += this.convert.toHtml(progress) + '\n';
          if (progress.startsWith('Results:')) {
            this.loading = false;
            window.OpNotification.success({
              subject: `Audit completed successfully`,
            });
            this.fetchScore(JSON.parse(progress.split('Results:')[1]));
          }
          this.scrollBottom();
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

  auditWebsite = (): void => {
    this.auditProgress = ``;
    this.loading = true;
    this.showScore = false;
    const property = {
      sites: this.sites,
      preset: this.selectedPreset,
    };
    this.appService
      .auditWebsite(property)
      .pipe(takeUntil(this.destroySub))
      .subscribe((response) => {
        this.auditId = response.auditWebsite;
        window.OpNotification.success({
          subject: `Audit started successfully`,
        });
      });
  };

  fetchScore = ( score ) => {
    this.showScore = true;
    this.lhciScores.map((record) => {
      Object.keys(score).map((key) => {
        if (key === record.label) {
          record.score = score[key];
          return record;
        }
      });
    });
  };
}
