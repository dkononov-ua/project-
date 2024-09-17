// параметри користувача
export interface UserInfo {
  about: string;
  agree_search: number;
  animals: string;
  area_of: string;
  area_to: string;
  balcony: string;
  bunker: string;
  checked: number;
  city: string;
  country: string;
  date: any;
  day_counts: any;
  days: number;
  distance_green: string;
  distance_metro: string;
  distance_parking: string;
  distance_shop: string;
  distance_stop: string;
  dob: any;
  facebook: string;
  family: number;
  firstName: string;
  flat: number | undefined;  // Додано можливість undefined
  house: number | undefined; // Додано можливість undefined
  img: string;
  instagram: string;
  lastName: string;
  looking_man: boolean | undefined;
  looking_woman: boolean | undefined;
  mail: any;
  man: number;
  metro: string;
  mounths: number | undefined;
  option_pay: number;
  price_of: number;
  price_to: number;
  purpose_rent: any;
  realll: number | 0;
  region: string;
  repair_status: string;
  room: number | undefined;  // Додано можливість undefined
  rooms_of: number;
  rooms_to: number;
  students: number;
  surName: string;
  telegram: string;
  tell: any;
  user_id: string;
  viber: string;
  weeks: number | undefined;
  woman: number;
  years: number | undefined;
  street: string;
  floor: number;
  district: string;
  micro_district: string;
  metrocolor: string;
  metroname: string;
}
export interface UserInfoSearch {
  animals: string | undefined;
  area: string | undefined;
  balcony: string | undefined;
  bunker: string | undefined;
  city: string;
  day_counts: string | undefined;
  days: number | undefined;
  distance_green: string | undefined;
  distance_metro: string | undefined;
  distance_parking: string | undefined;
  distance_shop: string | undefined;
  distance_stop: string | undefined;
  family: number | undefined;
  flat: number | undefined;
  house: number | undefined;
  kitchen_area: number | undefined;
  limit: number;
  looking_man: boolean | undefined;
  looking_woman: boolean | undefined;
  man: number | undefined;
  months: number | undefined;
  option_pay: any;
  price: number | undefined;
  purpose_rent: string | undefined;
  repair_status: string | undefined;
  room: boolean | undefined;
  rooms: number | undefined;
  students: number | undefined;
  weeks: number | undefined;
  woman: number | undefined;
  years: number | undefined;
  about: string | undefined;
  agree_search: number | undefined;
  area_of: string | undefined;
  area_to: string | undefined;
  checked: number | 0;
  country: string;
  date: any;
  dob: any;
  facebook: string;
  firstName: string | undefined;
  img: string | undefined;
  instagram: string;
  lastName: string | undefined;
  mail: any;
  metro: string;
  mounths: number | undefined;
  price_of: number | undefined;
  price_to: number | undefined;
  realll: number | 0;
  rooms_of: number | undefined;
  rooms_to: number | undefined;
  surName: string;
  telegram: string;
  tell: any;
  user_id: string;
  viber: string;

  region: string;
  street: string;
  district: string;
  micro_district: string;
  floor: number;

  metrocolor: string;
  metroname: string;

}
export interface HouseInfo {
  about: string;
  agent_id: any;
  animals: any;
  apartment: string;
  area: string;
  balcony: string;
  bunker: string;
  city: string;
  country: string;
  distance_green: any;
  distance_metro: any;
  distance_parking: any;
  distance_shop: any;
  distance_stop: any;
  district: string;
  family: any;
  flat_id: string;
  flat_index: any;
  floor: string;
  houseNumber: string;
  id: number;
  img: string;
  kitchen_area: string;
  limit: string;
  man: any;
  metro: string;
  micro_district: string;
  name: string;
  option_flat: any;
  option_pay: number;
  owner_id: any;
  photos: any[];
  price_d: any;
  price_f: any;
  price_m: any;
  price_s: any;
  price_y: string;
  private: number;
  region: string;
  repair_status: string;
  rent: any;
  room: any;
  rooms: string;
  selectedKitchen_area: string;
  street: string;
  students: any;
  woman: any;
  metrocolor: string;
  metroname: string;

};

export interface HouseInfoSearch {
  price_of: string | undefined;
  price_to: string | undefined;
  region: string | undefined;
  city: string | undefined;
  rooms_of: string | undefined;
  rooms_to: string | undefined;
  area_of: string;
  area_to: string;
  repair_status: string | undefined;
  bunker: string | undefined;
  balcony: string | undefined;
  animals: string | undefined;
  distance_metro: string | undefined;
  distance_stop: string | undefined;
  distance_green: string | undefined;
  distance_shop: string | undefined;
  distance_parking: string | undefined;
  option_pay: string | undefined;
  purpose_rent: string | undefined;
  looking_woman: string | undefined;
  looking_man: string | undefined;
  students: string | undefined;
  woman: string | undefined;
  man: string | undefined;
  family: string | undefined;
  days: number | undefined;
  weeks: number | undefined;
  months: number | undefined;
  years: number | undefined;
  day_counts: string | undefined;
  room: string | undefined;
  house: number | undefined;
  flat: number | undefined;
  limit: number;
  option_flat: string | undefined;
  country: string | undefined;
  kitchen_area: string | undefined;
  filterData: string | undefined;

  about: string | undefined;
  checked: number | 0;
  date: any | undefined;
  metro: string;
  mounths: number | undefined;

  street: string | undefined;
  district: string | undefined;
  micro_district: string | undefined;
  rooms: number | undefined;
  private: number | 0;
  rent: number | 0;
  metrocolor: string;
  metroname: string;

}

export interface Chat {
  user_id: string;
  chat_id: string;
  flat_id: any;
  flat_name: string;
  isSelected?: boolean;
  lastMessage: string;
  unread: number;
  infFlat: {
    imgs: any;
    flat: string;
  }
  infUser: {
    img: any;
    inf: {
      firstName: string;
      lastName: string;
      surName: string;
    }
  }
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
}
export interface Agree {
  flat: {
    agreementDate: string;
    agreement_id: string;
    apartment: string;
    city: string;
    flat_id: string;
    houseNumber: string;
    max_penalty: string;
    month: number;
    owner_email: string;
    owner_firstName: string;
    owner_id: string;
    owner_lastName: string;
    owner_surName: string;
    owner_tell: string;
    owner_img: string;
    penalty: string;
    price: string;
    rent_due_data: number;
    street: string;
    subscriber_email: string;
    subscriber_firstName: string;
    subscriber_id: string;
    subscriber_lastName: string;
    subscriber_surName: string;
    subscriber_tell: string;
    year: number;
    area: number;
    dateAgreeStart: string;
    dateAgreeEnd: string;
    subscriber_img: string;
  };
  img: string[];
  exists: any;
}
export interface Subscriber {
  acces_flat_chats: boolean;
  acces_flat_features: boolean;
  acces_agent: boolean;
  acces_comunal_indexes: boolean;
  acces_citizen: boolean;
  acces_agreement: boolean;
  acces_discuss: boolean;
  acces_subs: boolean;
  acces_filling: boolean;
  acces_services: boolean;
  acces_admin: boolean;
  acces_comunal: boolean;
  acces_added: boolean;
  user_id: string;
  firstName: string;
  lastName: string;
  surName: string;
  tell: number;
  photo: string;
  img: string;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
  mail: string;
}
// параметри користувача
export interface StatusInfo {
  checked: number | 0;
  realll: number | 0;
  house: number | undefined;
  flat: number | undefined;
  room: number | undefined;
  looking_woman: boolean | undefined;
  looking_man: boolean | undefined;
  agree_search: number | undefined;
  students: number | undefined;
  woman: number | undefined;
  man: number | undefined;
  family: number | undefined;
  date: any;
}
export interface HouseStatusInfo {
  checked: number | 0;
  realll: number | 0;
  house: number | undefined;
  flat: number | undefined;
  room: number | 0;
  looking_woman: boolean | undefined;
  looking_man: boolean | undefined;
  agree_search: number | undefined;
  students: number | undefined;
  woman: number | undefined;
  man: number | undefined;
  family: number | undefined;
  date: any;
  private: number | 0;
  rent: number | 0;
  option_flat: any;
}



