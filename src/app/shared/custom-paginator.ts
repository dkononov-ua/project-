import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Карток на сторінці:';
  override nextPageLabel = 'Наступна сторінка';
  override previousPageLabel = 'Попередня сторінка';
  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 з ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} з ${length}`;
  };
}
