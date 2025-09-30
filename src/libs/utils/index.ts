export * from './sizeScale';
export * from './storeManager';
export * from './permission';


export function formatDate(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()]; 
    const dayOfMonth = date.getDate(); 
    const year = date.getFullYear(); 

    return `${dayName} ${dayOfMonth}, ${year}`;
  }


export const formatAmount = (value: number | string =0): string => {
  try {
    const parsedValue = typeof value === 'number' ? value : parseFloat(value);

    if (isNaN(parsedValue)) {
      return '0.00';
    }
    return parsedValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch {
    return '0.00';
  }
};