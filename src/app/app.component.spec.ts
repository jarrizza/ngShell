// tests are run at browser url: localhost:9876
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { HeaderComponent } from './common/components/header/header.component';
import { NavBarComponent } from './common/components/navbar/navbar.component';
import { APIStateComponent } from './common/components/apiState/apiState.component';
import { ApiService } from './common/services/api/api.service';
import { ApiDataStub } from './common/services/api/api.data.stub';


describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
        ,APIStateComponent
        ,HeaderComponent
        ,NavBarComponent
      ],
      providers:[
        {provide:ApiService, useClass:ApiDataStub}]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
/*
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('TITLE STUB');
  }));

  it('should attach message from service to component', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.message).toBe('fake service');
  }));
*/
});
