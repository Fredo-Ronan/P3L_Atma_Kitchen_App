import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface urlQueryParams {
  key: string;
  params: string;
  value: string | null;
}

interface removeUrlQueryParams {
  key: string[];
  params: string;
}

export const urlQueryParams = ({ params, key, value }: urlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

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
