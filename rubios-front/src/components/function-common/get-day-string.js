import { es } from 'date-fns/locale';
import { format } from 'date-fns';

export function getDayString(date) {
    return format(date, 'EEEE', { locale: es });
}