import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FeedbackService } from '../feedback.service';
import { environment } from '../../../environments/environment';
import { options } from '../../../mocks/options';

@Component({
  selector: 'op-feedback-home',
  templateUrl: './feedback-home.component.html',
  styleUrls: ['./feedback-home.component.scss']
})
export class FeedbackHomeComponent implements OnInit {

  @ViewChild('fiModalTrigger') fiModalTrigger: ElementRef;
  allFeedback: any;
  feedbackDetails: any;
  jiraURL: string;
  roverURL: string;
  modules = [];
  activeTab = null;
  stats = [];
  bugsCount;
  feedbackCount;
  totalFeedbackCount;
  orderBy: string;
  searchText: string;
  feedbackPage: number;
  feedbackType: string = null;
  isAccordionOpen: boolean | any = false;
  selectedIndex = 0;
  selectedTab = 0;
  feedbackTags = [];
  options: any = options;
  feedbackOpenedCount: number;
  feedbackClosedCount: number;
  tagState: any;
  moduleName: any = null;
  constructor(
    private feedbackService: FeedbackService,
  ) {
  }
  ngOnInit() {
    this.jiraURL = environment.jiraURL;
    this.roverURL = environment.roverURL;
    this.feedbackService.getAllFeedback().then(allFeedback => {
      this.feedbackService.getAllJiraIssues().then( (jiraIssues: any) => {
        this.allFeedback = allFeedback.map(fb => {
          const fbObj = { ...fb };
          const fbIssue = jiraIssues.filter(issue => {
            if (issue.ticketID === fb.ticketID) {
              return issue;
            }
          })[0];
          if (fbIssue) {
            fbObj.state = fbIssue.status.name;
            fbObj.assignees = fbIssue.assignee.name;
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

        this.setFeedbackCount();
        this.totalFeedbackCount = this.allFeedback.length;
        this.bugsCount = (this.allFeedback.filter(feedback => feedback.feedbackType === 'Bug')).length;
        this.feedbackCount = (this.allFeedback.filter(feedback => feedback.feedbackType === 'Feedback')).length;
        this.stats.push({
          _id: 3,
          labelName: 'Bugs',
          labelSize: '24',
          countNumber: this.bugsCount.toString(),
          countSize: '42',
          themeColor: '#219be0',
          totalCountNumber: this.bugsCount.toString()
        });
        this.stats.push({
          _id: 2,
          labelName: 'Feedback',
          labelSize: '24',
          countNumber: this.feedbackCount.toString(),
          countSize: '42',
          themeColor: '#219be0',
          totalCountNumber: this.feedbackCount.toString()
        });
        this.stats.push({
          _id: 1,
          labelName: 'All',
          labelSize: '24',
          countNumber: this.totalFeedbackCount.toString(),
          countSize: '42',
          themeColor: '#219be0',
          totalCountNumber: this.totalFeedbackCount.toString()
        });
        this.stats.sort((a, b) => a._id - b._id);
      }, (error) => {
        if (error) { }
      });
    });
    this.feedbackTags.push({
      _id: 1,
      state: 'All'
    });
    this.feedbackTags.push({
      _id: 2,
      state: 'Open',
    });
    this.feedbackTags.push({
      _id: 3,
      state: 'Close'
    });
  }
  setTypeFilter(type, index) {
    this.selectedIndex = index;
    if (type === 'Feedback') {
      this.feedbackType = 'Feedback';
    } else if (type === 'Bugs') {
      this.feedbackType = 'Bug';
    } else {
      this.feedbackType = null;
    }
    this.setFeedbackCount();
  }
  setActive(state, index) {
    this.selectedTab = index;
    if (state === 'Open') {
      this.tagState = 'opened';
    } else if (state === 'Close') {
      this.tagState = 'closed';
    } else {
      this.tagState = null;
    }
  }
  setFeedbackCount() {
    if (this.feedbackType) {
      if (this.moduleName) {
        this.feedbackOpenedCount = this.allFeedback.filter(
          fb => fb.state === 'opened' && fb.feedbackType === this.feedbackType && fb.module.name === this.moduleName).length;
        this.feedbackClosedCount = this.allFeedback.filter(
          fb => fb.state !== 'opened' && fb.feedbackType === this.feedbackType && fb.module.name === this.moduleName).length;
      } else {
        this.feedbackOpenedCount = this.allFeedback.filter(fb => fb.state === 'opened' && fb.feedbackType === this.feedbackType).length;
        this.feedbackClosedCount = this.allFeedback.filter(fb => fb.state !== 'opened' && fb.feedbackType === this.feedbackType).length;
      }
    } else {
      if (this.moduleName) {
        this.feedbackOpenedCount = this.allFeedback.filter(fb => fb.state === 'opened' && fb.module.name === this.moduleName).length;
        this.feedbackClosedCount = this.allFeedback.filter(fb => fb.state !== 'opened' && fb.module.name === this.moduleName).length;
      } else {
        this.feedbackOpenedCount = this.allFeedback.filter(fb => fb.state === 'opened').length;
        this.feedbackClosedCount = this.allFeedback.filter(fb => fb.state !== 'opened').length;
      }
    }
  }
  filterFeedback(feedbackModule) {
    if (feedbackModule === 'Any') {
      this.moduleName = null;
    } else {
      this.moduleName = feedbackModule;
    }
    this.setFeedbackCount();
  }
  openModal(event) {
    this.feedbackDetails = event;
    this.fiModalTrigger.nativeElement.click();
  }
}
