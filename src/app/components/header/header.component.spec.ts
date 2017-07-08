import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

import { APIStateComponent } from '../../components/apiState/apiState.component';
import { ApiService } from '../../shared/services/api/api.service';
import { ApiDataStub } from '../../shared/services/api/api.data.stub';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponentWrapper
        ,HeaderComponent
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
  template: '<app-header></app-header>'
})
class TestComponentWrapper {
  chartData = new Array<any>();
}
