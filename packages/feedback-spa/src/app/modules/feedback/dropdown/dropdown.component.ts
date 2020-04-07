import {
  Component,
  OnInit,
  EventEmitter,
  ElementRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IDropDownOption } from './dropdown';

@Component({
  selector: 'op-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input() icon: string;
  @Input() options: Array<string>;
  @Input() optionsWithID: Array<IDropDownOption>;
  @Input() name: string;
  @Input() theme: string;
  @Input() truncateLength?: number;
  @Input() disableAny: boolean;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() selected: EventEmitter<any> = new EventEmitter();

  @ViewChild('dropDown', { read: ElementRef, static: true }) dropDown: ElementRef;
  @ViewChild('dropDownList', { read: ElementRef, static: true }) dropDownList: ElementRef;

  _DROP_DOWN_NODE: ElementRef;
  _DROP_DOWN_LIST_NODE: ElementRef;
  _name: string;
  _options: Array<string>;
  _optionsWithID: Array<IDropDownOption>;
  _theme: string;
  _dropdownOptions: Array<any>;

  _LAST_SELECTED: any;
  _CURRENT_SELECTED: any;
  _truncateLength?: number;

  activeDropDown = {
    dropDownName: null,
    dropDownID: null,
    isSelected: false,
    oldDropDown: null,
    currentTarget: null
  };

  /**
   * selectedItem
   * holds the default selected value and updates the dropdown.
   * @type {{ id: string; name: string; selected: Boolean; }}
   * @memberof OpDropdownComponent
   */
  selectedItem: IDropDownOption;

  get classes() {
    const cssClasses = {
      fa: true
    };
    cssClasses['fa-' + this.icon] = true;
    return cssClasses;
  }


  constructor() { }

  ngOnInit() {
    this._DROP_DOWN_NODE = this.dropDown;
    this._DROP_DOWN_LIST_NODE = this.dropDownList;
    this._name = this.name || 'Filter By: ';
    this._options = this.disableAny ? this.options : [...['Any'], ...this.options] || ['provide options'];
    this._optionsWithID = this.disableAny ? this.optionsWithID : [...[{ id: -1, name: 'Any', selected: false }], ...this.optionsWithID];
    this._theme = this.theme;
    this._truncateLength = this.truncateLength;

    if (this.optionsWithID) {
      /**
       * if All options are false. 🚀
       */
      const selectedOption = this._optionsWithID.filter(item => item.selected)[0];
      this.selectedItem = selectedOption ? selectedOption : this._optionsWithID[0];

      this.activeDropDown.dropDownName = this.selectedItem.name;
      this.activeDropDown.dropDownID = this.selectedItem.id;
    }

    this.changeTheme(
      this._DROP_DOWN_LIST_NODE.nativeElement.previousElementSibling,
      this._theme
    );

    if (this.options) {
      this._dropdownOptions = this._options;
    } else if (this.optionsWithID) {
      this._dropdownOptions = this._optionsWithID;
    }

    if (!this.selectedItem) {
      this.activeDropDown.dropDownName = this._dropdownOptions[0].name ? this._dropdownOptions[0].name : this._dropdownOptions[0];
    }
    if (this.activeDropDown.dropDownName !== 'Any') {
      this.selected.emit(this.getEmitOption(this.activeDropDown));
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this._CURRENT_SELECTED = this._DROP_DOWN_LIST_NODE.nativeElement.firstElementChild;
    this._DROP_DOWN_LIST_NODE.nativeElement.firstElementChild.classList.add('op-active');
    this.activeDropDown.oldDropDown = this._DROP_DOWN_LIST_NODE.nativeElement.querySelector('.op-active');
  }

  ngOnChanges(changes: any) {
    /**
     * Applying the updated changes to the dropdownOptions
     */
    if (changes.optionsWithID && !changes.optionsWithID.firstChange) {
      this._optionsWithID = this.disableAny ? changes.optionsWithID.currentValue : [{ id: -1, name: 'Any', selected: false }, ...changes.optionsWithID.currentValue];
      this._dropdownOptions = this._optionsWithID;

      const selectedOption = this._optionsWithID.find(option => option.selected === true);
      this.selectedItem = selectedOption || this._optionsWithID[0];

      this.activeDropDown.dropDownName = this.selectedItem.name;
      this.activeDropDown.dropDownID = this.selectedItem.id;

      this.changeTheme(this._DROP_DOWN_LIST_NODE.nativeElement.previousElementSibling, this._theme);

      if (this.activeDropDown.dropDownName !== 'Any') {
        this.selected.emit(this.getEmitOption(this.activeDropDown));
      }
    } else if (changes.options && !changes.options.firstChange) {
      this._options = this.disableAny ? changes.options.currentValue : [...['Any'], ...this.options] || ['provide options'];
      this._dropdownOptions = this._options;

      this.changeTheme(this._DROP_DOWN_LIST_NODE.nativeElement.previousElementSibling, this._theme);

      if (this.activeDropDown.dropDownName !== 'Any') {
        this.selected.emit(this.getEmitOption(this.activeDropDown));
      }
    }
  }

  hideList() {
    this._DROP_DOWN_LIST_NODE.nativeElement.classList.contains('show') ?
      // tslint:disable-next-line:no-unused-expression
      this._DROP_DOWN_LIST_NODE.nativeElement.classList.remove('show') : null;
  }

  changeTheme(buttonTarget, themeName) {
    switch (themeName) {
      case 'op-outline-black':
        if (buttonTarget.classList.contains('op-flat')) {
          buttonTarget.classList.toggle('op-flat');
        }
        buttonTarget.classList.add('op-outline-black');
        break;
      case 'op-outline-w-padding':
        if (buttonTarget.classList.contains('op-flat')) {
          buttonTarget.classList.toggle('op-flat');
        }
        buttonTarget.classList.add('op-outline-w-padding');
        break;
    }
  }

  showDropdownOption() {
    // find drop down list set display to block or vice versa
    this._DROP_DOWN_LIST_NODE.nativeElement.classList.toggle('show');
  }

  setActive(event, option) {
    this.activeDropDown.currentTarget = event.target;
    this.activeDropDown.isSelected = true;

    this.activeDropDown.dropDownName = option.name ? option.name : option;
    this.activeDropDown.dropDownID = option.name ? option.id : null;

    this.activeDropDown.oldDropDown = event.target.parentElement.querySelector('.op-active');
    if (this.activeDropDown.oldDropDown) {
      this.activeDropDown.oldDropDown.classList.remove('op-active');
    }

    this.activeDropDown.currentTarget.classList.toggle('op-active');

    this.selected.emit(this.getEmitOption(this.activeDropDown));

    this._DROP_DOWN_LIST_NODE.nativeElement.classList.toggle('show');
  }

  private getEmitOption(option: string | any): string | IDropDownOption {
    if (option.dropDownID === null) {
      return option.dropDownName;
    }

    return this._optionsWithID.filter(opt => opt.id === option.dropDownID)[0];
  }

}
