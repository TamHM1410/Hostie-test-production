import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}
export function formatDate(date: any) {
  const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based) and pad
  const year = String(date.getFullYear()).slice(0); // Get last two digits of the year

  return `${day}-${month}-${year}`;
}
export const formatDateToDDMMYYYY = (date: string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const day = String(dateObj.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Get month (0-based) and pad
  const year = String(dateObj.getFullYear()); // Get full year

  return `${day}-${month}-${year}`;
};
export const formattedAmountCalender = (amount: number): string => {
  if (amount >= 1000) {
    const thousands=Math.floor(amount / 1000)
    return `${thousands.toLocaleString('vi-VN')} k`;

  }
  return `${amount} k`;
};


export const formattedAmount = (amount: number): string => {
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(amount);

  return `${formattedPrice} VND`;
};


export const fDateVn = (date: any) => {
  const day = date.getDate().toString().padStart(2, '0'); // Đảm bảo luôn có 2 chữ số
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Đảm bảo luôn có 2 chữ số
  const year = date.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
};
