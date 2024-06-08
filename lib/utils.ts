import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface urlQueryParams {
  key: string;
  params: string;
  value: string | null;
  removePage: boolean;
}

interface removeUrlQueryParams {
  key: string[];
  params: string;
}

export const urlQueryParams = ({
  params,
  key,
  value,
  removePage,
}: urlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  if (removePage) delete currentUrl["page"];

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

export const removeUrlQueryParams = ({ params, key }: removeUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  key.forEach((item) => {
    delete currentUrl[item];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

export function formatTanggal(tanggalIso: string): string {
  const tanggal = new Date(tanggalIso);

  const hari = tanggal.getDate().toString().padStart(2, "0");
  const bulan = (tanggal.getMonth() + 1).toString().padStart(2, "0");
  const tahun = tanggal.getFullYear();

  return `${tahun}-${bulan}-${hari}`;
}

export function getMonths() {
  const months = [];
  const date = new Date();
  const currentYear = date.getFullYear();
  const bulanIni = date.getMonth() + 1;

  for (let i = 1; i <= bulanIni; i++) {
    months.push(new Date(currentYear, i, 1).toISOString().slice(0, 7));
  }

  return months;
}
