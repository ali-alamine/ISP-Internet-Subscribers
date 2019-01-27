import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { MatNativeDateModule, MatAutocompleteModule, MatSnackBarModule, MatBottomSheetModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import {ChartModule} from 'primeng/chart';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { FileUploadModule } from 'primeng/components/fileupload/fileupload';
import { NgxSpinnerModule } from 'ngx-spinner';

import { SubscribersComponent } from './subscribers/subscribers.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SubscribersReportComponent } from './subscribers-report/subscribers-report.component';
import { StockComponent } from './stock/stock.component';
import { ClientsComponent } from './clients/clients.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { SupplyComponent } from './supply/supply.component';
import { SellComponent } from './sell/sell.component';
import {MatIconModule} from '@angular/material/icon';
import { InternetInvoicesComponent } from './internet-invoices/internet-invoices.component';
import { SupplyInvoicesComponent } from './supply-invoices/supply-invoices.component';
import { DrawerComponent } from './drawer/drawer.component';
import { InternetDrawerComponent } from './internet-drawer/internet-drawer.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { CentralInvoicesComponent } from './central-invoices/central-invoices.component';
import {MatRadioModule} from '@angular/material/radio';

import {  APP_INITIALIZER } from '@angular/core';
import { ApploadService } from './appload.service';
import { AccessoriesInvoicesComponent } from './accessories-invoices/accessories-invoices.component';
import { CreditInvoicesComponent } from './credit-invoices/credit-invoices.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FocusDirectiveDirective } from './focus-directive.directive';
import { AccessoriesDrawerComponent } from './accessories-drawer/accessories-drawer.component';
import { MobileDrawerComponent } from './mobile-drawer/mobile-drawer.component';
import { DrawerOmtComponent } from './drawer-omt/drawer-omt.component';
import { OmtComponent } from './omt/omt.component';
import { OmtHistoryComponent } from './omt-history/omt-history.component';
import { SettingsComponent } from './settings/settings.component';

export function init_app(firstLoadService: ApploadService ) {
  return () => firstLoadService.autoSubscription();
}

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    StockComponent,
    SubscribersComponent,
    SubscriptionComponent,
    SubscribersReportComponent,
    ClientsComponent,
    SuppliersComponent,
    SupplyComponent,
    SellComponent,
    InternetInvoicesComponent,
    SupplyInvoicesComponent,
    DrawerComponent,
    InternetDrawerComponent,
    CentralInvoicesComponent,
    AccessoriesInvoicesComponent,
    CreditInvoicesComponent,
    PageNotFoundComponent,
    FocusDirectiveDirective,
    AccessoriesDrawerComponent,
    MobileDrawerComponent,
    DrawerOmtComponent,
    OmtComponent,
    OmtHistoryComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    FileUploadModule,
    ContextMenuModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    NgxSpinnerModule,
    MatButtonToggleModule,
    ChartModule
  ],
  entryComponents: [],
  providers: [ ApploadService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [ApploadService], multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
