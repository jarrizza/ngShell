import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { AgEditorComponent } from 'ag-grid-angular/main';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'date-editor',
  template: `
    <span #dateInput id="dateInput" class="dateInput" (blur)="getValue()">
      <select #monthSel id="monthSel" class="monthInput" size="1" >
        <option value="1" selected="{{currentMonth === 0 ? 'selected' : ''}}">Jan</option>
        <option value="2" selected="{{currentMonth === 1 ? 'selected' : ''}}">Feb</option>
        <option value="3" selected="{{currentMonth === 2 ? 'selected' : ''}}">Mar</option>
        <option value="4" selected="{{currentMonth === 3 ? 'selected' : ''}}">Apr</option>
        <option value="5" selected="{{currentMonth === 4 ? 'selected' : ''}}">May</option>
        <option value="6" selected="{{currentMonth === 5 ? 'selected' : ''}}">Jun</option>
        <option value="7" selected="{{currentMonth === 6 ? 'selected' : ''}}">Jul</option>
        <option value="8" selected="{{currentMonth === 7 ? 'selected' : ''}}">Aug</option>
        <option value="9" selected="{{currentMonth === 8 ? 'selected' : ''}}">Sep</option>
        <option value="10" selected="{{currentMonth === 9 ? 'selected' : ''}}">Oct</option>
        <option value="11" selected="{{currentMonth === 10 ? 'selected' : ''}}">Nov</option>
        <option value="12" selected="{{currentMonth === 11 ? 'selected' : ''}}">Dec</option>
      </select>
      <input #daySel id="dayInput" class="dayInput" value={{currentDay}}>
      <input #yearSel id="yearInput" class="yearInput" value={{currentYear}}>
    </span>
  `,
  styles: [`
    .dateInput {
      margin: 4px;
      background-color: white;
    }
    .monthInput {
      border: none;
      width: 60px;
    }
    .dayInput {
      width: 30px;
    }
    .yearInput {
      width: 40px;
    }
  `]
})
export class DateEditorComponent implements AgEditorComponent, AfterViewInit, OnDestroy {

  @ViewChild('dateInput') public dateInput;
  @ViewChild('monthSel')  public monthSel;
  @ViewChild('dayInput')    public dayInput;
  @ViewChild('yearInput')   public yearInput;

  private currentDate: Date;
  private dateDisplay: string;
  public currentYear: number;
  public currentMonth: number = 0;
  public currentDay: number;

  constructor(private toastr: ToastsManager) {
  }

  public setCurrentDate(validDate: Date) {
    this.currentYear = validDate.getFullYear();
    this.currentMonth = validDate.getMonth();
    this.currentDay = validDate.getDate();
    this.currentDate = validDate;
    this.dateDisplay = moment(validDate).format('MMM DD, YYYY');
  }

  public setCurrentDateFromInputFields() {
    let month = parseInt(this.monthSel.nativeElement.value, 10);
    let day = parseInt(this.dayInput.nativeElement.value, 10);
    let year = parseInt(this.yearInput.nativeElement.value, 10);
    let newDtStr = month + '/' + day + '/' + year;
    let dt = Date.parse(newDtStr);
    if (isNaN(dt) === false) {
      this.setCurrentDate(moment(newDtStr, 'MM/DD/YYYY').toDate());
    }
  }

  /* this happens when the control is initialized */
  agInit(params: any): void {
    let dt: Date;
    let paramDate = Date.parse(params.value);
    if (isNaN(paramDate) === true) {
      dt = new Date();
    } else {
      dt = new Date(params.value);
    }
    this.setCurrentDate(dt);
    if (params.cellStartedEdit === true) {
      this.monthSel.nativeElement.focus();
    }
  }


  ngAfterViewInit() {
    this.dateInput.nativeElement.addEventListener('keydown', this.outerListener);
    this.monthSel.nativeElement.addEventListener('keydown', this.innerListener);
    this.dayInput.nativeElement.addEventListener('keydown', this.innerListener);
    this.yearInput.nativeElement.addEventListener('keydown', this.innerListener);
    this.monthSel.nativeElement.focus();
  }

  getValue(): any {
    this.setCurrentDateFromInputFields();
    return this.dateDisplay;
  }

  isPopup(): boolean {
    return false;
  }

  ngOnDestroy() {
    this.dateInput.nativeElement.removeEventListener('keydown', this.outerListener);
    this.monthSel.nativeElement.removeEventListener('keydown', this.innerListener);
    this.dayInput.nativeElement.removeEventListener('keydown', this.innerListener);
    this.yearInput.nativeElement.removeEventListener('keydown', this.innerListener);
  }

  private outerListener(e: KeyboardEvent): void {
    let fldClass = e.target['className'];
    // console.log('outerlistener hears: ' + e.which + ' on: ' + fldClass);

    if (e.which === 39) { // arrow right
      if (fldClass === 'monthInput') {
        document.getElementById('dayInput').focus();
        e.stopPropagation();
      } else if (fldClass === 'dayInput') {
        document.getElementById('yearInput').focus();
        e.stopPropagation();
      }
    } else if (e.which === 37) { // arrow left
      if (fldClass === 'yearInput') {
        document.getElementById('dayInput').focus();
        e.stopPropagation();
      } else if (fldClass === 'dayInput') {
        document.getElementById('monthSel').focus();
        e.stopPropagation();
      }
    } else if (e.which === 13 || e.which === 38 || e.which === 40) {
      document.getElementById('dateInput').blur();
    }
  }


  private innerListener(e: KeyboardEvent): void {
    let fldClass = e.target['className'];
    // console.log('innerlistener hears: ' + e.which + ' on: ' + fldClass);

    if (e.which === 9) { // tab management on the inner fields
      if (fldClass === 'dayInput' ||
        (fldClass === 'monthInput' && e.shiftKey !== true) ||   // tab right on month
        (fldClass === 'yearInput' && e.shiftKey === true) ) {   // tab left on year
        e.stopPropagation();
        e.preventDefault();
      }
    } else if ( // allow the outer one to process ONLY if its one of these or a tab
      !(e.which === 39 || // right arrow
        e.which === 37 || // left arrow
        e.which === 38 || // up arrow
        e.which === 40 || // down arrow
        e.which === 13   // return
      )) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

}

