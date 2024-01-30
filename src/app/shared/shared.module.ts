import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from 'src/app/components/footer/footer.component';
import { SharedRoutingModule } from './shared-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { UserSearchComponent } from '../components/user-search/user-search.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../components/loader/loader.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SelectionHousingComponent } from '../components/selection-housing/selection-housing.component';
import { SelectionDiscussioComponent } from '../components/selection-discussio/selection-discussio.component';
import { UpdateComponentService } from '../services/update-component.service';
import { MatMenuModule } from '@angular/material/menu';
import { AddHouseComponent } from '../components/house/add-house/add-house.component';

import { LySliderModule } from '@alyle/ui/slider';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { CropImgComponent } from '../components/crop-img/crop-img.component';
import { MenuComponent } from '../components/menu/menu.component';
import { GalleryComponent } from '../components/gallery/gallery.component';
import { CropImg2Component } from '../components/crop-img2/crop-img2.component';
import { AddObjectsComponent } from '../account-edit/house/add-objects/add-objects.component';
import { ChatHostComponent } from '../chat/user/chat-host/chat-host.component';
import { ChatUserComponent } from '../chat/user/chat-user/chat-user.component';
import { SendMessageUserComponent } from '../chat/user/send-message-user/send-message-user.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChatHostHouseComponent } from '../chat/house/chat-host-house/chat-host-house.component';
import { ChatHouseComponent } from '../chat/house/chat-house/chat-house.component';
import { SendMessageComponent } from '../chat/house/send-message/send-message.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DeleteHComponent } from '../components/house/delete-h/delete-h.component';
@NgModule({
  declarations: [
    FooterComponent,
    UserSearchComponent,
    LoaderComponent,
    SelectionHousingComponent,
    SelectionDiscussioComponent,
    AddHouseComponent,
    CropImgComponent,
    MenuComponent,
    GalleryComponent,
    CropImg2Component,
    AddObjectsComponent,
    ChatUserComponent,
    ChatHostComponent,
    SendMessageUserComponent,
    ChatHouseComponent,
    ChatHostHouseComponent,
    SendMessageComponent,
    DeleteHComponent,
  ],
  exports: [
    FooterComponent,
    UserSearchComponent,
    LoaderComponent,
    SelectionHousingComponent,
    SelectionDiscussioComponent,
    AddHouseComponent,
    CropImgComponent,
    MenuComponent,
    GalleryComponent,
    CropImg2Component,
    AddObjectsComponent,
    ChatUserComponent,
    ChatHostComponent,
    SendMessageUserComponent,
    ChatHouseComponent,
    ChatHostHouseComponent,
    SendMessageComponent,
    DeleteHComponent,

  ],
  providers: [
    UpdateComponentService,

  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatDialogModule,
    FormsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    LyImageCropperModule,
    LySliderModule,
    LyButtonModule,
    LyIconModule,
    LyDialogModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
  ]
})
export class SharedModule { }
