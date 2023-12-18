// pagination-config.ts
import { PageEvent } from '@angular/material/paginator';

export const PaginationConfig = {
  offs: 0,
  counterFound: 0,
  currentPage: 1,
  totalPages: 1,
  pageEvent: {
    length: 0,
    pageSize: 5, // Встановлюємо кількісь яку пропускаємо
    pageIndex: 0,
  } as PageEvent, // Встановлюємо тип PageEvent
};
