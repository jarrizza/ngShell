// Imports
import { Component } from '@angular/core';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'api-state',
  templateUrl: './apiState.component.html',
  styleUrls: ['./apiState.component.css']
})

// Component class
export class APIStateComponent {
  constructor(
    public apiService: ApiService
  ){}


}
