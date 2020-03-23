import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FeedbackService } from '../feedback.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'op-feedback-home',
  templateUrl: './feedback-home.component.html',
  styleUrls: ['./feedback-home.component.sass']
})
export class FeedbackHomeComponent implements OnInit {

  @ViewChild('fiModalTrigger', {static: false } ) fiModalTrigger: ElementRef;
  allFeedback: any;
  feedbackDetails: any;
  gitlabURL: string;
  constructor(
    private feedbackService: FeedbackService,
  ) {
   
  }
  ngOnInit() {
    this.gitlabURL = environment.gitlabURL;
    this.feedbackService.getAllFeedback().then(allFeedback => {
      this.feedbackService.getAllGitLabIssues().subscribe(glIssues => {
        this.allFeedback = allFeedback.map(fb => {
          const fbObj = { ...fb };
          const fbIssue = glIssues.filter(issue => {
            if (Number(issue.iid) === Number(fb.iid)) {
              return issue;
            }
          })[0];
          if (fbIssue) {
            fbObj.state = fbIssue.state;
            fbObj.assignees = fbIssue.assignees;
          }
          return fbObj;
        });
        this.allFeedback = this.allFeedback.filter(fb => {
          if (!fb.state) {
            fb.state = 'closed';
          }
          if (!fb.module) {
            fb.module = {
              name: 'general',
            };
          }
          return fb;
        });
      }, (error) => {
        if (error) { }
      });
    });
  }
  async openModal(event) {
  
    this.feedbackDetails = event;
    this.fiModalTrigger.nativeElement.click();
  }
  
}
