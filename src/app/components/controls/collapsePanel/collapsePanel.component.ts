import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'collapse-panel',
  templateUrl: './collapsePanel.component.html',
  styleUrls: ['./collapsePanel.component.css']
})
export class CollapsePanelComponent {

  @Input() isCollapsed: boolean = true;
  @Input() panelHeading: string = 'Notifications';
  @Input() panelClass: string = 'panel panel-primary';
  @Input() headingIconClass: string;

  @Output() onToggle = new EventEmitter<boolean>();

  constructor() {}

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.onToggle.emit(this.isCollapsed);
  }

}
