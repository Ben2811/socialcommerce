import { format } from "date-fns";

export function formatCreatedAt(value: string | Date | undefined | null): string {
  if (!value) {
    return "Không rõ thời gian";
  }

  const parsedDate = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Không rõ thời gian";
  }

  return format(parsedDate, "dd/MM/yyyy HH:mm");
}