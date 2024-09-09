import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {IconService} from "./services/icon.service";
import {MatIconTestingModule} from "@angular/material/icon/testing";
import {MatButtonHarness} from "@angular/material/button/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {getHarness} from "../test/helpers.test";

jest.mock('./services/icon.service');

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatIconTestingModule,

        AppComponent
      ],
      providers: [
        IconService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should load icons', () => {
    const iconService = TestBed.inject(IconService);

    expect(iconService.load).toHaveBeenCalled();
  });

  it('should open GitHub in a new tab', async () => {
    // GIVEN
    const $button: MatButtonHarness = await getHarness(fixture, MatButtonHarness.with({selector: '[data-testid=btn-github]'}));

    // WHEN
    await $button.click();

    // THEN
    expect(window.open).toHaveBeenCalledWith('https://github.com/poirierlouis/FellowImGui', '_blank');
  });
});
