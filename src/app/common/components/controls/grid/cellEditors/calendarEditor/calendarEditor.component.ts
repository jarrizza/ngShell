import {Component, ViewChild, OnDestroy, AfterViewInit, ViewContainerRef} from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular/main';

@Component({
  selector: 'calendar-editor',
  templateUrl: './calendar-editor.component.html',
  styleUrls: ['./calendar-editor.component.css']
})

export class CalendarEditorComponent { // implements AfterViewInit, AgEditorComponent, OnDestroy {
  private params: any;

  @ViewChild('container', {read: ViewContainerRef}) container;

  constructor() {}
/*
  public agInit(params: any): void {
    this.params = params;
    let paramDate = Date.parse(params.value);
    if (isNaN(paramDate) === false) {
      let currentDateValue = new Date(params.value);
      this.settingsService.setPopupCalendarDate(currentDateValue);
    }
    this.hideCalendar();
  }

  public ngAfterViewInit() {
    this.container.element.nativeElement.addEventListener('keydown', this.navKeyListener.bind(this));
    this.container.element.nativeElement.focus();
  }

  public ngOnDestroy() {
    this.container.element.nativeElement.removeEventListener('keydown', this.navKeyListener.bind(this));
    this.hideCalendar();
  }

  public getValue(): any {
    return this.settingsService.popupCalendarDateString;
  }

  public showCalendar( ) {
    let el = this.container.element.nativeElement;
    let rect = el.getBoundingClientRect();
    let topVal = rect.top + window.scrollY + 30;
    let leftVal = rect.left + window.scrollX;
    this.settingsService.showPopupCalendar(topVal, leftVal);
  }

  public hideCalendar( ) {
    this.settingsService.hidePopupCalendar();
  }

  public toggleCalendar() {
    if (this.settingsService.popupCalendarShows === true) {
      this.hideCalendar();
    } else {
      this.showCalendar();
    }
  }

  public navKeyListener(e: KeyboardEvent): void {
    // let fldClass = e.target['className'];
    // console.log('navKeyListener hears: ' + e.which + ' on: ' + fldClass);
    if (e.which === 39 || // right arrow
      e.which === 37 || // left arrow
      e.which === 38 || // up arrow
      e.which === 40 || // down arrow
      e.which === 13    // return
    ) {
      this.hideCalendar();
    } else if (e.which === 32) {
      this.toggleCalendar();
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    }
  }
*/
}
