import {Component, ViewChild, AfterViewInit, ViewContainerRef} from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular/main';

@Component({
  selector: 'toggle-editor',
  template: `

    <div #container class="toggleInput" id="toggleInput" (focus)="focusHandler($event)" (keydown)="navKeyListener($event)" tabindex="0" >
      <i [class]="checked === true ? checkClass : uncheckClass" ></i>
    </div>
  `,
  styles: [`
    .toggleInput {
      font-size: 14px;
      background-color: transparent;
      text-align: center;
      display: inline-block;
      outline: none;
      color: black;
      width: 100%;
      cursor: pointer;
    }
    .toggleInput:focus {
      color: #337ab7;
      font-weight: bold;
    }
  `]
})

export class ToggleEditorComponent implements AfterViewInit, AgEditorComponent {
  private params: any;
  private hasFocus: boolean = false;

  @ViewChild('container', {read: ViewContainerRef}) container;
  private checked: boolean = false;
  public checkClass: string = 'fa fa-check-square-o fa-lg';
  public uncheckClass: string = 'fa fa-square-o fa-fw';

  ngAfterViewInit() {
    this.container.element.nativeElement.addEventListener('focus', this.focusHandler.bind(this));
    this.container.element.nativeElement.addEventListener('click', this.clickHandler.bind(this));
    this.container.element.nativeElement.addEventListener('keydown', this.navKeyListener.bind(this));
    this.container.element.nativeElement.focus();
  }

  agInit(params: any): void {
    this.params = params;
    this.checked = this.params.value;
  }

  getValue(): any {
    return this.checked;
  }

  public toggle() {
    this.checked = !this.checked;
  }

  private focusHandler(e: FocusEvent) {
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

  private navKeyListener(e: KeyboardEvent): void {
    // allow space to toggle
    if (e.keyCode === 32) {
      this.toggle();
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    }
  }

}
