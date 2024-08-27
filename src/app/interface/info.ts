// параметри користувача
export interface UserInfo {
  about: string | undefined;
  agree_search: number | undefined;
  animals: string | undefined;
  area_of: string | undefined;
  area_to: string | undefined;
  balcony: string | undefined;
  bunker: string | undefined;
  checked: number | 0;
  city: string;
  country: string;
  date: any;
  day_counts: any;
  days: number | undefined;
  distance_green: number;
  distance_metro: number;
  distance_parking: number;
  distance_shop: number;
  distance_stop: number;
  dob: any;
  facebook: string;
  family: number | undefined;
  firstName: string | undefined;
  flat: number | undefined;
  house: number | undefined;
  img: string | undefined;
  instagram: string;
  lastName: string | undefined;
  looking_man: boolean;
  looking_woman: boolean;
  mail: any;
  man: number | undefined;
  metro: string;
  mounths: number | undefined;
  option_pay: number | undefined;
  price_of: number | undefined;
  price_to: number | undefined;
  purpose_rent: any;
  realll: number | 0;
  region: string;
  repair_status: string | undefined;
  room: number | undefined;
  rooms_of: number | undefined;
  rooms_to: number | undefined;
  students: number | undefined;
  surName: string;
  telegram: string;
  tell: any;
  user_id: string;
  viber: string;
  weeks: number | undefined;
  woman: number | undefined;
  years: number | undefined;

  street: string;
  district: string;
  micro_district: string;
}
export interface UserInfoSearch {
  animals: string | undefined;
  area: string | undefined;
  balcony: string | undefined;
  bunker: string | undefined;
  city: string | undefined;
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
  region: string | undefined;
  repair_status: string | undefined;
  room: boolean | undefined;
  rooms: number | undefined;
  students: number | undefined;
  weeks: number | undefined;
  woman: number | undefined;
  years: number | undefined;
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
};

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



