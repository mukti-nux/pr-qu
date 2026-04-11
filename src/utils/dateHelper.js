import { format, differenceInDays, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return format(parseISO(dateStr.substring(0, 10)), 'EEEE, dd MMMM yyyy', { locale: id });
};

export const getCountdown = (dateStr) => {
  if (!dateStr) return { text: '-', color: 'gray' };
  const deadline = parseISO(dateStr.substring(0, 10));
  if (isPast(deadline) && !isToday(deadline)) return { text: 'Terlambat!', color: 'red' };
  if (isToday(deadline)) return { text: 'HARI INI!', color: 'red' };
  if (isTomorrow(deadline)) return { text: 'Besok!', color: 'yellow' };
  const days = differenceInDays(deadline, new Date());
  return { text: `${days} hari lagi`, color: 'green' };
};

export const getDeadlineColor = (dateStr) => {
  const { color } = getCountdown(dateStr);
  return color;
};
