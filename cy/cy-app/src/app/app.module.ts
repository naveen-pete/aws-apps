import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SignupComponent } from './user/signup/signup.component';
import { SigninComponent } from './user/signin/signin.component';
import { CompareComponent } from './compare/compare.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './user/auth.service';
import { CompareService } from './compare/compare.service';
import { CompareInputComponent } from './compare/compare-input/compare-input.component';
import { CompareResultsComponent } from './compare/compare-results/compare-results.component';
import { SpinnerComponent } from './util/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    CompareComponent,
    CompareInputComponent,
    CompareResultsComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [AuthService, CompareService],
  bootstrap: [AppComponent]
})
export class AppModule { }
