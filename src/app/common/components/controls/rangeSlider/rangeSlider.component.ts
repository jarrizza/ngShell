import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'range-slider',
  templateUrl: './rangeSlider.component.html',
  styleUrls: ['./rangeSlider.component.css']
})

export class RangeSliderComponent implements OnInit {
  @ViewChild('Slider') slider: ElementRef;
  @ViewChild('dragImg') dragImg: ElementRef;

  public leftThumbPos: number = 0;
  public rightThumbPos: number = 0;
  public sliderStartDateStr: string ;   // initialize to the first historical date of parcel
  public sliderEndDateStr: string;      // initialize to today's daye
  public selStartDateStr: string;       // initialize to just before the last CIO event
  public selEndDateStr: string = '';    // initialize to today

  private sliderRect;
  private sliderLeftOffset = 94;
  private sliderRightOffset = 94;
  private maxX: number;
  private minX: number;
  private sliderPixels: number;
  private sliderIncs: number;
  private pixelsPerInc: number;
  private increment: string;

  constructor() {
  }

  ngOnInit() {
    let self = this;
    self.sliderStartDateStr = '07/01/2017'; // '01/24/2012'; months // '01/24/1940'; years // first historical date of parcel
    self.selStartDateStr = '07/11/2017';    // initialize to just before the last CIO event or start
    self.sliderEndDateStr = self.selEndDateStr = self.convertDateToString(new Date());
    self.updateSliderSize(self);
    window.onresize = (e) => { self.updateSliderSize(self); };
  }

  private convertDateToString(date: Date) {
    return moment(date).format('MM/DD/YYYY');
  }

  private getTimeBetween(startDateStr, endDateStr, increment) {
    let sdt = moment(new Date(startDateStr));
    let edt = moment(new Date(endDateStr));
    let diffDays = edt.diff(sdt,increment);
    return diffDays;
  }

  public getSliderIncrements(self, inctype) {
    self.increment = inctype;
    self.sliderIncs = self.getTimeBetween(self.sliderStartDateStr, self.sliderEndDateStr, inctype);
    if (self.sliderIncs === 0)
      return 0;
    return self.sliderPixels/self.sliderIncs;
  }


  private updateSliderSize(self) {
    self.sliderRect = self.slider.nativeElement.getBoundingClientRect();
    self.maxX = self.sliderRect.right;
    self.minX = self.sliderRect.left;
    self.sliderPixels = self.maxX - self.minX;
    self.pixelsPerInc = self.getSliderIncrements(self, "days");

    self.setLeftThumbToSelStartDate();
    self.setRightThumbToSelEndDate();
    self.setInnerBar();
  }

  private getDateAtLeftOffset(offset) {
    let sliderPos = offset - this.sliderLeftOffset;
    if (sliderPos <= 0 || this.pixelsPerInc === 0) {
      return this.sliderStartDateStr;
    }
    let endOffset = this.maxX - this.sliderLeftOffset - this.sliderRightOffset - 3;
    if (sliderPos >= endOffset) {
      return this.sliderEndDateStr;
    }
    let daysFromStart = Math.round(sliderPos/this.pixelsPerInc) + 1;
    let sdt = moment(new Date(this.sliderStartDateStr));
    return sdt.add(daysFromStart, 'days').format('MM/DD/YYYY');
  }

  private getLeftOffsetAtDate(dateStr) {
    let sdt = moment(new Date(this.sliderStartDateStr));
    let edt = moment(new Date(dateStr));
    let diffDays = edt.diff(sdt,'days');
    if (diffDays < 1) diffDays = 0;
    let pixelsToStart: number = this.pixelsPerInc * diffDays;
    return Math.round(this.minX + pixelsToStart - this.sliderLeftOffset);
  }

  private setLeftThumbToSelStartDate() {
    if (this.selStartDateStr === this.sliderEndDateStr) {
      this.leftThumbPos = this.maxX - this.sliderLeftOffset - 3;
    }
    else {
      this.leftThumbPos = this.getLeftOffsetAtDate(this.selStartDateStr);
    }
  }

  private setRightThumbToSelEndDate() {
    if (this.selEndDateStr === this.sliderEndDateStr) {
      this.rightThumbPos = this.maxX - this.sliderLeftOffset + 3;
    }
    else {
      this.rightThumbPos = this.getLeftOffsetAtDate(this.selEndDateStr);
    }
  }

  // Change slider display based on selection date changes

  public changeStartDateSel() {
    this.setLeftThumbToSelStartDate();
    this.setInnerBar();
  }

  public changeEndDateSel() {
    this.setRightThumbToSelEndDate();
    this.setInnerBar();
  }

  // Drawing the thumbs and inner bar based on known position

  public setInnerBar(): any {
    let distance = this.rightThumbPos - this.leftThumbPos;
    return {"margin-left": this.leftThumbPos+"px", "width": distance+"px"  }
  }

  public setLeftThumb(): any {
    return {"margin-left": this.leftThumbPos+"px" }
  }


  public setRightThumb(): any {
    return {"margin-left": this.rightThumbPos+"px" }
  }

  public onDragStart() {
    if (event['dataTransfer']) {
      event['dataTransfer'].setDragImage(this.dragImg.nativeElement,0,0);
    }
  }
  public onDragEnd(event) {}

  /////// LEFT THUMB DRAGGING

  public onLeftDrag() {
    console.log('onLeftDrag EVENT');
    if (event['clientX']) {
      let x = event['clientX'];
      let startpt = x - this.minX;
      let d = this.rightThumbPos - startpt;
      if (d > 3 && startpt > -4) {
        this.leftThumbPos = startpt;
        this.selStartDateStr = this.getDateAtLeftOffset(startpt);
      }
    }
  }

  /////// RIGHT THUMB DRAGGING

  public onRightDrag() {
    if (event['clientX']) {
      let x = event['clientX'];
      let endpt = x - this.minX;
      let d = endpt - this.leftThumbPos - 3;
      if (d > 0 && endpt < (this.maxX - this.minX)) {
        this.rightThumbPos = endpt;
        this.selEndDateStr = this.getDateAtLeftOffset(endpt);
      }
    }
  }

  public onRightDragEnd(event) { }

  public showValue(val): void {
    this.leftThumbPos = val;
  }
}

