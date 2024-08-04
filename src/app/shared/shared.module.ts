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
import { SelectionHousingComponent } from '../components/house/selection-housing/selection-housing.component';
import { AddHouseComponent } from '../components/house/add-house/add-house.component';
import { DeleteHComponent } from '../components/house/delete-h/delete-h.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChatHostHouseComponent } from '../chat/house/chat-host-house/chat-host-house.component';
import { ChatHouseComponent } from '../chat/house/chat-house/chat-house.component';
import { ChatHostComponent } from '../chat/user/chat-host/chat-host.component';
import { ChatUserComponent } from '../chat/user/chat-user/chat-user.component';
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
import { StatusAccessComponent } from '../components/house/status-access/status-access.component';
import { CardsListUsersComponent } from '../card/card-user-components/cards-list-users/cards-list-users.component';
import { FunctionsComponent } from '../card/card-user-components/functions/functions.component';
import { CreateChatService } from '../chat/create-chat.service';
import { HouseRentProgressComponent } from '../card/card-house-components/house-rent-progress/house-rent-progress.component';
import { UserRentProgressComponent } from '../card/card-user-components/user-rent-progress/user-rent-progress.component';
import { RatingComponent } from '../card/card-user-components/rating/rating.component';
import { NavigationUserComponent } from '../card/card-user-components/navigation-user/navigation-user.component';
import { NavigationHouseComponent } from '../card/card-house-components/navigation-house/navigation-house.component';
import { ContactsComponent } from '../components/contacts/contacts.component';
import { PostDetailComponent } from '../pages/post-detail/post-detail.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { ClickOutsideDirective } from '../directive/click-outside.directive';
import { ActionComponent } from '../components/action/action.component';

@NgModule({
  declarations: [
    FooterComponent,
    LoaderComponent,
    SelectionHousingComponent,
    SelectionDiscussioComponent,
    AddHouseComponent,
    CropImgComponent,
    MenuComponent,
    GalleryComponent,
    CropImg2Component,
    DeleteHComponent,
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
  ],
  exports: [
    FooterComponent,
    LoaderComponent,
    SelectionHousingComponent,
    SelectionDiscussioComponent,
    AddHouseComponent,
    CropImgComponent,
    MenuComponent,
    GalleryComponent,
    CropImg2Component,
    DeleteHComponent,
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

  ],
  providers: [
    UpdateComponentService,
    SharedService,
    StatusDataService,
    StatusDataHouseComponent,
    CreateChatService,
    ActionComponent,
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
