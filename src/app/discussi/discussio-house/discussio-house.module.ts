import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DiscussioHouseRoutingModule } from './discussio-house-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { SubscribersHouseComponent } from './subscribers/subscribers-house.component';
import { SubscriptionsHouseComponent } from './subscriptions/subscriptions-house.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { AgreeCreateComponent } from 'src/app/account/house/agree-h/agree-create/agree-create.component';
import { DeleteSubComponent } from './delete/delete-sub.component';
import { SubscribersDiscusComponent } from './discus/subscribers-discus.component';
import { HouseRoutingModule } from 'src/app/account/house/house-routing.module';
import { UserRoutingModule } from 'src/app/pages/host-user/user-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
    declarations: [
        AgreeCreateComponent,
        SubscribersHouseComponent,
        SubscriptionsHouseComponent,
        DeleteSubComponent,
        SubscribersDiscusComponent,
    ], imports: [CommonModule,
        DiscussioHouseRoutingModule,
        SharedModule,
        MatSelectModule,
        MatFormFieldModule,
        MatCardModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormsModule,
        MatListModule,
        MatTooltipModule,
        MatIconModule,
        BrowserModule,
        BrowserAnimationsModule,
        NgbModule,
        DragDropModule,
        RouterModule,
        MatInputModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatDialogModule,
        MatPaginatorModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        HouseRoutingModule,
        UserRoutingModule], providers: [
            SelectedFlatService,
            DatePipe,
            provideHttpClient(withInterceptorsFromDi()),
        ]
})
export class DiscussioHouseModule { }
