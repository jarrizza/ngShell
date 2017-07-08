import {Component, ViewChild, AfterViewInit, ViewContainerRef} from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular/main';

@Component({
  selector: 'ynbutton-editor',
  template: `
    <div #container class="ynButton" id="ynInput" (focus)="focusHandler($event)" (keydown)="navKeyListener($event)" (click)="clickHandler($event)" tabindex="0" >
      <input type="button" [value]="currentState" (click)="clickHandler($event)" tabindex="0">
    </div>
  `,
  styles: [`
    .ynInput {
      font-size: 14px;
      background-color: transparent;
      text-align: center;
      display: inline-block;
      outline: none;
      color: black;
      width: 100%;
      cursor: pointer;
    }
    .ynInput:focus {
      color: #337ab7;
      font-weight: bold;
    }
  `]
})

export class YNButtonEditorComponent implements AfterViewInit, AgEditorComponent {
  private params: any;
  private hasFocus: boolean = false;

  private currentState: string = 'Y';

  @ViewChild('container', {read: ViewContainerRef}) container;

  ngAfterViewInit() {
    this.container.element.nativeElement.addEventListener('click', this.clickHandler.bind(this));
    this.container.element.nativeElement.focus();
  }

  agInit(params: any): void {
    this.params = params;
    this.currentState = (this.params.value === true) ? 'Y' : 'N';
  }

  getValue(): any {
    return (this.currentState === 'Y') ? true : false;
  }

  private toggle() {
    this.currentState = (this.currentState === 'Y') ? 'N' : 'Y';
  }

  public focusHandler(e: FocusEvent) {
    this.hasFocus = true;
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
  }

  public clickHandler(e: MouseEvent) {
    // In the event that the editor is not already in focus - focus it
    if (!this.hasFocus) {
      let focusEl = document.activeElement;
      // console.log('click active tagname = ' + focusEl.tagName + ' id: ' + focusEl.id);
      if (focusEl) {
        let editorEl = document.activeElement.firstElementChild;
        if (editorEl && editorEl.tagName === 'TOGGLE-EDITOR') {
          let templateEl = editorEl.firstElementChild;
          let listenerNativeEl = document.getElementById(templateEl.id);
          if (listenerNativeEl) {
            listenerNativeEl.focus();
          }
        }
      }

    } else {
      this.toggle();
    }

    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
  }

  public navKeyListener(e: KeyboardEvent): void {
    // allow space to toggle
    if (e.keyCode === 32) {
      this.toggle();
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    }
  }


}
