import type { Message, Filter, DateType } from "./types";

function evaluateFilter(message: Message, filter: Filter): boolean {
  if ("field" in filter) {
    const fieldValue = message[filter.field];
    switch (filter.type) {
      case "string":
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
        }

      case "number":
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
        }

      case "boolean":
        if (typeof fieldValue !== "boolean") return false;
        return filter.operation === "eq" && fieldValue === filter.value;

      case "date":
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
        }
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
