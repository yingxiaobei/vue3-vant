/// <reference types="vite/client" />
interface AnyObject {
  [key: string]: any;
}

interface ResResult<T> {
  total: number;
  rows: T[];
}

interface CommonListQuery {
  [key: string]: any;
  limit: number;
  page: number;

  schoolId: string;
}

declare interface Window {
  API_BASEURL: string;
}

declare module "pdfjs-dist";
declare module "pdfjs-dist/build/pdf.worker.entry";
