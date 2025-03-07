import { format } from "date-fns";

export function localizeDateToPST(date: string): string {
  const correctedDate = new Date(`${date}T00:00:00`);

  return format(correctedDate, "LLL dd, yyyy");
}
