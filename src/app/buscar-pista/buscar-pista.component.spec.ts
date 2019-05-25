import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarPistaComponent } from './buscar-pista.component';

describe('BuscarPistaComponent', () => {
  let component: BuscarPistaComponent;
  let fixture: ComponentFixture<BuscarPistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarPistaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarPistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
