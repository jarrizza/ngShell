import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-owner-pies',
  templateUrl: './ownerPies.component.html',
  styleUrls: ['./ownerPies.component.css']
})

export class OwnerPiesComponent implements OnInit {

  public pieData: Array<any> = [40, 30, 20, 10];

  constructor() {}

  ngOnInit() {
  }
}
