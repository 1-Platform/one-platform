import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-context-selector',
  templateUrl: './context-selector.component.html',
  styleUrls: ['./context-selector.component.scss'],
})
export class ContextSelectorComponent implements OnInit {
  @Input() isOpen = false;
  @Input() toggleText = '';
  @Input() searchInputValue = '';
  @Input() isSearchIconHidden = true;
  @Output('onSearchInputChange') onSearchInputChangeEvent =
    new EventEmitter<string>();
  @Output('onSearchButtonClick') onSearchButtonClickEvent =
    new EventEmitter<string>();
  @Output('onToggle') onToggleEvent = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  onToggle() {
    this.onToggleEvent.emit(!this.isOpen);
  }

  onSearchButtonClick() {
    this.onSearchButtonClickEvent.emit(this.searchInputValue);
  }

  onSearchInputChange(event: Event) {
    const inputElementValue = (event.target as HTMLInputElement).value;
    this.onSearchInputChangeEvent.emit(inputElementValue);
  }
}
