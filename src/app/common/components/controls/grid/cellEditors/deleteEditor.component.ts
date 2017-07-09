import {Component, ViewChild, AfterViewInit, ViewContainerRef} from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular/main';

@Component({
  selector: 'delete-editor',
  template: `
    <div #container class="deleteInput" tabindex="0" (keydown)="navKeyListener($event)">
      <i #checkSymbol id="checkSymbol" class="fa fa-trash-o fa-fw fa-lg" (click)="onSelect($event)"></i>
    </div>
  `,
  styles: [`
    .deleteInput {
      font-size: 14px;
      background-color: white;
      text-align: center;
      display: inline-block;
      outline: none;
      color: black;
      width: 100%;
    }
  `]
})

export class DeleteEditorComponent implements AfterViewInit, AgEditorComponent {
  private params: any;

  @ViewChild('container', {read: ViewContainerRef}) container;
  private checked: boolean = false;

  ngAfterViewInit() {
    this.container.element.nativeElement.addEventListener('keydown', this.navKeyListener.bind(this));
    this.container.element.nativeElement.focus();
  }

  agInit(params: any): void {
    this.params = params;
    this.checked = false;
  }

  getValue(): any {
    return this.checked;
  }

  onSelect(e) {
    this.checked = true;
    this.params.stopEditing();
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
  }

  private navKeyListener(e: KeyboardEvent): void {
    // allow space to select
    let key = e.which || e.keyCode;
    if (key === 32) {
      this.checked = true;
      this.params.stopEditing();
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    }

  }

}
