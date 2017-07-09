import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'modal-confirm',
  templateUrl: './modalConfirm.component.html',
  styleUrls: ['./modalConfirm.component.css']
})
export class ModalConfirmComponent {
  @Input() modalTitle: string = 'Please confirm:';
  @Output() onModalHidden = new EventEmitter();
  @ViewChild(ModalDirective) modal: ModalDirective;
  private selectedOption: boolean = false;

  constructor() {}

  showModal() {
    this.selectedOption = false;
    this.modal.show();
  }

  hideModal(bool) {
    this.selectedOption = bool;
    this.modal.hide();
  }

  // onHidden emits the event after CSS transition
  onHidden() {
    this.onModalHidden.emit(this.selectedOption);
  }
}
