import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'range-slider',
  templateUrl: './rangeSlider.component.html',
  styleUrls: ['./rangeSlider.component.css']
})

export class RangeSliderComponent implements OnInit {
  @ViewChild('Slider') slider: ElementRef;

  public leftThumbPos: number = 0;
  public rightThumbPos: number = 0;
  public startDateString: string = '01/18/1940';
  public endDateString: string = 'today';

  private sliderRect;
  public maxX: number;
  public minX: number;

  constructor() {
    let self = this;
    window.onresize = (e) => { self.updateSize(self); };
  }

  ngOnInit() {
    this.updateSize(this);
    this.leftThumbPos = this.maxX-this.minX-8;
    this.rightThumbPos = this.maxX-this.minX;
    this.setInnerBar();
  }

  private updateSize(self) {
    self.sliderRect = self.slider.nativeElement.getBoundingClientRect();
    self.maxX = self.sliderRect.right;
    self.minX = self.sliderRect.left;
  }

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

  /////// LEFT THUMB DRAGGING

  public onLeftDragStart() { }

  public onLeftDrag() {
    console.log('onLeftDrag EVENT');
    if (event['clientX']) {
      let x = event['clientX'];
      let startpt = x - this.minX;
      let d = this.rightThumbPos - startpt;
      if (d > 3 && startpt > -4) {
        this.leftThumbPos = startpt;
      }
    }
  }

  public onLeftDragEnd(event) {}

  /////// RIGHT THUMB DRAGGING

  public onRightDragStart() { }

  public onRightDrag() {
    if (event['clientX']) {
      let x = event['clientX'];
      let endpt = x - this.minX;
      let d = endpt - this.leftThumbPos - 3;
      if (d > 0 && endpt < (this.maxX - this.minX)) {
        this.rightThumbPos = endpt;
      }
    }
  }

  public onRightDragEnd(event) { }

  public showValue(val): void {
    this.leftThumbPos = val;
  }
}
