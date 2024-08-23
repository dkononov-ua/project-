
export interface HouseComunalCompanyInfo {
  comunal_company: string;
  comunal_name: string;
  comunal_address: string;
  comunal_site: string;
  comunal_phone: string;
  iban: string;
  edrpo: string;
  personalAccount: string;
  about_comun: string;
}

export const HouseComunalCompanyInfoConfig = {
  comunal_company: '',
  comunal_name: '',
  comunal_address: '',
  comunal_site: '',
  comunal_phone: '',
  iban: '',
  edrpo: '',
  personalAccount: '',
  about_comun: '',
};

export const defaultImageUrl: string = "../../../assets/example-comun/default_services.svg";

export const comunalServices = [
  { name: "Опалення", imageUrl: "../../../assets/example-comun/comun_cat3.jpg", unit: "Гкал" },
  { name: "Водопостачання", imageUrl: "../../../assets/example-comun/water.jfif", unit: "м3" },
  { name: "Вивіз сміття", imageUrl: "../../../assets/example-comun/car_scavenging3.jpg", unit: "внесок" },
  { name: "Електроенергія", imageUrl: "../../../assets/example-comun/comun_rozetka1.jpg", unit: "кВт" },
  { name: "Газопостачання", imageUrl: "../../../assets/example-comun/gas_station4.jpg", unit: "м3" },
  { name: "Комунальна плата за утримання будинку", imageUrl: "../../../assets/example-comun/default_services.svg", unit: "внесок" },
  { name: "Охорона будинку", imageUrl: "../../../assets/example-comun/ohorona.jpg", unit: "внесок" },
  { name: "Ремонт під'їзду", imageUrl: "../../../assets/example-comun/default_services.svg", unit: "внесок" },
  { name: "Ліфт", imageUrl: "../../../assets/example-comun/default_services.svg", unit: "внесок" },
  { name: "Інтернет та телебачення", imageUrl: "../../../assets/example-comun/internet.jpg", unit: "внесок" },
  { name: "Домофон", imageUrl: "../../../assets/example-comun/default_services.svg", unit: "внесок" }
];

export interface HouseComunalCounter {
  comunal_before: any;
  comunal_now: any;
  howmuch_pay: any;
  about_pay: any;
  tariff: any;
  consumed: any;
  calc_howmuch_pay: any;
  option_sendData: any;
  user_id: any;
}

export const HouseComunalCounterConfig = {
  comunal_before: null,
  comunal_now: null,
  howmuch_pay: null,
  about_pay: '',
  tariff: null,
  consumed: null,
  calc_howmuch_pay: null,
  option_sendData: null,
  user_id: null,
};

