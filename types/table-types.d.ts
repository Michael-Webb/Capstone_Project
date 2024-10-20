// types/table-types.d.ts

import '@tanstack/react-table'

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    headerName?: string;
    className?: string;
    style?: CSSProperties;
    width?: Property.Width<string | number>;
  }
}