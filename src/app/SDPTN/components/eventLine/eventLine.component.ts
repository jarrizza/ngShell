import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-event-line',
  templateUrl: './eventLine.component.html',
  styleUrls: ['./eventLine.component.css']
})

export class EventLineComponent implements OnInit {
  @ViewChild('Eventline') eventline: ElementRef;

  public thumbPos: number = 0;
  public rightThumbPos: number = 0;

  private eventlineRect;
  public maxX: number;
  public minX: number;

  constructor() {
    let self = this;
    window.onresize = (e) => { self.updateSize(self); };
  }

  ngOnInit() {
    this.updateSize(this);
    this.thumbPos = this.maxX-this.minX-8;
  }

  private updateSize(self) {
    self.eventlineRect = self.eventline.nativeElement.getBoundingClientRect();
    self.maxX = self.eventlineRect.right;
    self.minX = self.eventlineRect.left;
  }

  public setThumb(): any {
    return {"margin-left": this.thumbPos+"px" }
  }

  /////// THUMB DRAGGING

  public onDragStart() { }

  public onDrag() {
    console.log('onDrag EVENT');
    if (event['clientX']) {
      let x = event['clientX'];
      let startpt = x - this.minX;
      if (startpt > -4 && startpt < this.maxX) {
        this.thumbPos = startpt;
      }
    }
  }

  public onLeftDragEnd(event) {}


  public showValue(val): void {
    this.thumbPos = val;
  }
}
