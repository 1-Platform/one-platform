import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "op-feedback-item",
  templateUrl: "./feedback-item.component.html",
  styleUrls: ["./feedback-item.component.scss"],
})
export class FeedbackItemComponent implements OnInit {
  @Input() feedback: any;
  @Input() jiraURL: any;
  @Input() userProfileURL: any;
  @Output() clickAction: EventEmitter<any> = new EventEmitter<any>();
  isAccordionOpen = false;
  constructor() {}

  ngOnInit() {}
  openModal() {
    this.clickAction.emit(this.feedback);
  }
}
