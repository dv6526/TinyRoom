import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-modalno-okno',
  templateUrl: './modalno-okno.component.html',
  styleUrls: ['./modalno-okno.component.css']
})
export class ModalnoOknoComponent {

  @Input() public action: string;
  @Input() public details: string;

  @ViewChild('autoShownModal', { static: false }) autoShownModal: ModalDirective;

  @Output() buttonClickConfirm: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  @Output() buttonClickDeny: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();


}
