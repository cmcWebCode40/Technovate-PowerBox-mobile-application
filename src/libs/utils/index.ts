export * from './sizeScale';
export * from './storeManager';


export function formatDate(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()]; 
    const dayOfMonth = date.getDate(); 
    const year = date.getFullYear(); 

    return `${dayName} ${dayOfMonth}, ${year}`;
  }