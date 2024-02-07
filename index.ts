import type {
  Message,
  Filter,
  DateType,
  StringFilter,
  NumberFilter,
  BooleanFilter,
  DateFilter,
} from "./types";

function evaluateStringFilter(
  fieldValue: string | boolean | DateType | number,
  filter: StringFilter
): boolean {
  if (typeof fieldValue !== "string") return false;
  switch (filter.operation) {
    case "eq":
      return fieldValue === filter.value;
    case "startsWith":
      return fieldValue.startsWith(filter.value);
    case "endsWith":
      return fieldValue.endsWith(filter.value);
    case "contains":
      return fieldValue.includes(filter.value);
    default:
      return false;
  }
}

function evaluateNumberFilter(
  fieldValue: string | boolean | DateType | number,
  filter: NumberFilter
): boolean {
  if (typeof fieldValue !== "number") return false;
  switch (filter.operation) {
    case "eq":
      return fieldValue === filter.value;
    case "gt":
      return fieldValue > filter.value;
    case "lt":
      return fieldValue < filter.value;
    case "gte":
      return fieldValue >= filter.value;
    case "lte":
      return fieldValue <= filter.value;
    default:
      return false;
  }
}

function evaluateBooleanFilter(
  fieldValue: string | boolean | DateType | number,
  filter: BooleanFilter
): boolean {
  if (typeof fieldValue !== "boolean") return false;
  return filter.operation === "eq" && fieldValue === filter.value;
}

function evaluateDateFilter(
  fieldValue: string | boolean | DateType | number,
  filter: DateFilter
): boolean {
  if (!(typeof fieldValue === "string" || fieldValue instanceof Date))
    return false;
  const dateFieldValue = new Date(fieldValue);
  const comparisonDate = new Date(filter.value);
  switch (filter.operation) {
    case "eq":
      return dateFieldValue.getTime() === comparisonDate.getTime();
    case "after":
      return dateFieldValue.getTime() > comparisonDate.getTime();
    case "before":
      return dateFieldValue.getTime() < comparisonDate.getTime();
    default:
      return false;
  }
}

function evaluateFilter(message: Message, filter: Filter): boolean {
  if ("field" in filter) {
    const fieldValue = message[filter.field];
    switch (filter.type) {
      case "string":
        return evaluateStringFilter(fieldValue, filter);
      case "number":
        return evaluateNumberFilter(fieldValue, filter);
      case "boolean":
        return evaluateBooleanFilter(fieldValue, filter);
      case "date":
        return evaluateDateFilter(fieldValue, filter);
    }
  } else if (filter.type === "or") {
    return filter.filters.some((subFilter) =>
      evaluateFilter(message, subFilter)
    );
  } else if (filter.type === "and") {
    return filter.filters.every((subFilter) =>
      evaluateFilter(message, subFilter)
    );
  }
  return false;
}

export function filterMessages(messages: Message[], filter: Filter): Message[] {
  return messages.filter((message) => evaluateFilter(message, filter));
}
