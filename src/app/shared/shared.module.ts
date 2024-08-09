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
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../components/loader/loader.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SelectionDiscussioComponent } from '../components/selection-discussio/selection-discussio.component';
import { UpdateComponentService } from '../services/update-component.service';
import { MatMenuModule } from '@angular/material/menu';
import { LySliderModule } from '@alyle/ui/slider';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { CropImgComponent } from '../components/crop-img/crop-img.component';
import { MenuComponent } from '../components/menu/menu.component';
import { GalleryComponent } from '../components/gallery/gallery.component';
import { CropImg2Component } from '../components/crop-img2/crop-img2.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedService } from '../services/shared.service';
import { StatusDataComponent } from '../card/card-user-components/status-data/status-data.component';
import { StatusDataService } from '../services/status-data.service';
import { StatusDataHouseComponent } from '../card/card-house-components/status-data-house/status-data-house.component';
import { CardsListComponent } from '../card/card-user-components/cards-list/cards-list.component';
import { FunctionsHouseComponent } from '../card/card-house-components/functions-house/functions-house.component';
import { InfoHouseComponent } from '../card/card-house-components/info-house/info-house.component';
import { ImgHouseComponent } from '../card/card-house-components/img-house/img-house.component';
import { ImgComponent } from '../card/card-user-components/img/img.component';
import { InfoComponent } from '../card/card-user-components/info/info.component';
import { ReviewsComponent } from '../card/card-user-components/reviews/reviews.component';
import { LinksBoxComponent } from '../card/card-user-components/links-box/links-box.component';
import { StatusAccessComponent } from '../card/card-house-components/status-access/status-access.component';
import { CardsListUsersComponent } from '../card/card-user-components/cards-list-users/cards-list-users.component';
import { FunctionsComponent } from '../card/card-user-components/functions/functions.component';
import { CreateChatService } from '../services/chat/create-chat.service';
import { HouseRentProgressComponent } from '../card/card-house-components/house-rent-progress/house-rent-progress.component';
import { UserRentProgressComponent } from '../card/card-user-components/user-rent-progress/user-rent-progress.component';
import { RatingComponent } from '../card/card-user-components/rating/rating.component';
import { NavigationUserComponent } from '../card/card-user-components/navigation-user/navigation-user.component';
import { NavigationHouseComponent } from '../card/card-house-components/navigation-house/navigation-house.component';
import { ContactsComponent } from '../components/contacts/contacts.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { ClickOutsideDirective } from '../directive/click-outside.directive';
import { ActionComponent } from '../card/card-user-components/action/action.component';
import { PostDetailComponent } from '../pages/host/blog/post-detail/post-detail.component';
import { ActionDeleteSubComponent } from '../components/action-delete-sub/action-delete-sub.component';
import { DeleteHouseComponent } from '../card/card-house-components/delete-house/delete-house.component';
import { HouseAgreeProgressComponent } from '../card/card-house-components/house-agree-progress/house-agree-progress.component';
import { ChatUserComponent } from '../pages/host-user/host-user-chat/chat-user/chat-user.component';
import { ChatHostComponent } from '../pages/host-user/host-user-chat/chat-host.component';
import { ChatHouseComponent } from '../pages/host-house/host-house-chat/chat-house/chat-house.component';
import { ChatHostHouseComponent } from '../pages/host-house/host-house-chat/chat-host-house.component';

@NgModule({
  declarations: [
    FooterComponent,
    LoaderComponent,
    SelectionDiscussioComponent,
    CropImgComponent,
    MenuComponent,
    GalleryComponent,
    CropImg2Component,

    ChatUserComponent,
    ChatHostComponent,

    ChatHouseComponent,
    ChatHostHouseComponent,

    StatusDataComponent,
    StatusDataHouseComponent,
    LinksBoxComponent,
    StatusAccessComponent,
    CardsListComponent,
    CardsListUsersComponent,
    FunctionsHouseComponent,
    FunctionsComponent,
    InfoHouseComponent,
    ImgHouseComponent,
    ImgComponent,
    InfoComponent,
    ReviewsComponent,
    HouseRentProgressComponent,
    UserRentProgressComponent,
    RatingComponent,
    NavigationUserComponent,
    NavigationHouseComponent,
    ContactsComponent,
    PostDetailComponent,
    NavbarComponent,
    ClickOutsideDirective,
    ActionComponent,
    ActionDeleteSubComponent,
    DeleteHouseComponent,
    HouseAgreeProgressComponent,
  ],
  exports: [
    FooterComponent,
    LoaderComponent,
    SelectionDiscussioComponent,
    CropImgComponent,
    MenuComponent,
    GalleryComponent,
    CropImg2Component,
    ChatUserComponent,
    ChatHostComponent,
    ChatHouseComponent,
    ChatHostHouseComponent,
    StatusDataComponent,
    StatusDataHouseComponent,
    LinksBoxComponent,
    StatusAccessComponent,
    CardsListComponent,
    CardsListUsersComponent,
    FunctionsHouseComponent,
    FunctionsComponent,
    InfoHouseComponent,
    ImgHouseComponent,
    ImgComponent,
    InfoComponent,
    ReviewsComponent,
    HouseRentProgressComponent,
    UserRentProgressComponent,
    RatingComponent,
    NavigationUserComponent,
    NavigationHouseComponent,
    ContactsComponent,
    PostDetailComponent,
    NavbarComponent,
    ClickOutsideDirective,
    ActionComponent,
    ActionDeleteSubComponent,
    HouseAgreeProgressComponent,

  ],
  providers: [
    UpdateComponentService,
    SharedService,
    StatusDataService,
    StatusDataHouseComponent,
    CreateChatService,
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
