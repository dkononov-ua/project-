// параметри користувача
export interface UserInfo {
  checked: number | 0;
  tell: any;
  dob: any;
  country: string | undefined;
  firstName: string | undefined;
  img: string | undefined;
  lastName: string | undefined;
  user_id: string;
  surName: string;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
  mail: any;
  price_of: number | undefined;
  price_to: number | undefined;
  region: string | undefined;
  city: string | undefined;
  rooms_of: number | undefined;
  rooms_to: number | undefined;
  area_of: string | undefined;
  area_to: string | undefined;
  repair_status: string | undefined;
  bunker: string | undefined;
  balcony: string | undefined;
  animals: string | undefined;
  distance_metro: number;
  distance_stop: number;
  distance_green: number;
  distance_shop: number;
  distance_parking: number;
  option_pay: number | undefined;
  day_counts: string | undefined;
  purpose_rent: any;
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
  days: number | undefined;
  weeks: number | undefined;
  mounths: number | undefined;
  years: number | undefined;
  about: string | undefined;
}

export interface UserInfoSearch {
  price: number | undefined;
  region: string | undefined;
  city: string | undefined;
  rooms: number | undefined;
  area: string | undefined;
  repair_status: string | undefined;
  bunker: string | undefined;
  balcony: string | undefined;
  animals: string | undefined;
  distance_metro: string | undefined;
  distance_stop: string | undefined;
  distance_green: string | undefined;
  distance_shop: string | undefined;
  distance_parking: string | undefined;
  option_pay: any;
  purpose_rent: string | undefined;
  looking_woman: boolean | undefined;
  looking_man: boolean | undefined;
  students: number | undefined;
  woman: number | undefined;
  man: number | undefined;
  family: number | undefined;
  days: number | undefined;
  weeks: number | undefined;
  months: number | undefined;
  years: number | undefined;
  day_counts: string | undefined;
  room: boolean | undefined;
  house: number | undefined;
  flat: number | undefined;
  limit: number;
  kitchen_area: number | undefined;
}

export interface HouseInfo {
  about: string;
  animals: any;
  agent_id: any;
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
  family: any;
  flat_id: string;
  flat_index: string;
  floor: string;
  houseNumber: string;
  id: number;
  img: string;
  kitchen_area: string;
  limit: string;
  man: any;
  metro: string;
  name: string;
  owner_id: any;
  option_flat: any;
  option_pay: number;
  photos: any[];
  price_d: any;
  price_m: any;
  price_y: string;
  private: number;
  region: string;
  repair_status: string;
  rent: any;
  rooms: string;
  room: any;
  selectedKitchen_area: string;
  street: string;
  students: any;
  woman: any;
};

export interface Chat {
  user_id: string;
  chat_id: string;
  flat_id: string;
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



