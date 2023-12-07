// параметри користувача
export interface UserInfo {
  animals: string | undefined;
  area_of: number | undefined;
  area_to: number | undefined;
  balcony: string | undefined;
  bunker: string | undefined;
  city: string | undefined;
  country: string | undefined;
  day_counts: number | undefined;
  days: number | undefined;
  distance_green: number | undefined;
  distance_metro: number | undefined;
  distance_parking: number | undefined;
  distance_shop: number | undefined;
  distance_stop: number | undefined;
  family: boolean | undefined;
  firstName: string | undefined;
  flat: string | undefined;
  house: string | undefined;
  img: string | undefined;
  lastName: string | undefined;
  looking_man: boolean | undefined;
  looking_woman: boolean | undefined;
  man: boolean | undefined;
  mounths: number | undefined;
  option_pay: number | undefined;
  price_of: number | undefined;
  price_to: number | undefined;
  purpose_rent: number | undefined;
  region: string | undefined;
  repair_status: string | undefined;
  room: boolean | undefined;
  rooms_of: number | undefined;
  rooms_to: number | undefined;
  students: boolean | undefined;
  user_id: string;
  weeks: number | undefined;
  woman: boolean | undefined;
  years: number | undefined;
  surName: string;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
  mail: any;
}

export interface HouseInfo {
  region: string;
  city: string;
  rooms: string;
  area: string;
  repair_status: string;
  selectedKitchen_area: string;
  balcony: string;
  bunker: string;
  animals: string;
  distance_metro: string;
  distance_stop: string;
  distance_green: string;
  distance_shop: string;
  distance_parking: string;
  limit: string;
  country: string;
  price: any;
  price_m: any;
  id: number;
  name: string;
  photos: string[];
  img: string;
  about: string;
  apartment: string;
  family: string;
  flat_id: string;
  flat_index: string;
  floor: string;
  houseNumber: string;
  kitchen_area: string;
  man: string;
  metro: string;
  price_y: string;
  street: string;
  students: string;
  woman: string;
  option_pay: number;
};

export interface Chat {
  user_id: string;
  chat_id: string;
  flat_id: string;
  isSelected?: boolean;
  lastMessage: string;
  unread: number;
  infFlat: {
    imgs: string;
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


