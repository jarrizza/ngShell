import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { APIStateComponent } from './apiState.component';
import { ApiService } from '../../services/api/api.service';
import { ApiDataStub } from '../../services/api/api.data.stub';

describe('APIStateComponent', () => {
  let component: APIStateComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponentWrapper
        ,APIStateComponent
      ],
      providers:[
        {provide:ApiService, useClass:ApiDataStub}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});


@Component({
  selector: 'test-component-wrapper',
  template: '<api-state></api-state>'
})
class TestComponentWrapper {
  chartData = new Array<any>();
}
