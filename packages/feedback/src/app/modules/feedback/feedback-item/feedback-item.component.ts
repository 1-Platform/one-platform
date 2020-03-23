import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'op-feedback-item',
  templateUrl: './feedback-item.component.html',
  styleUrls: ['./feedback-item.component.sass']
})
export class FeedbackItemComponent implements OnInit {

  @Input() feedback: any;
  @Input() gitlabURL: any;
  @Output() clickAction: EventEmitter<any> = new EventEmitter<any>();
  isAccordionOpen: Boolean | any = false;
  constructor() { }

  ngOnInit() {
  }

  openModal() {
    this.clickAction.emit(this.feedback);
  }


}



  

  

  

  
