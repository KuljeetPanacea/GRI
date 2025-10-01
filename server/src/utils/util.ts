import { QueryOptions } from "src/core/database/query-options.interface";

export const queryOptionKeys: (keyof QueryOptions)[] = [
    'page', 'readPreference', 'populate', 'sort', 'limit', 'skip', 'select', 'lean'
  ];

export function separateQueryOptions(query: Record<string, any>): {
  options: Partial<QueryOptions>;
  filter: Record<string, any>;
} {
  const options: Partial<QueryOptions> = {};
  const filter: Record<string, any> = {};

  Object.keys(query).forEach((key) => {
    const value = query[key];

    if (queryOptionKeys.includes(key as keyof QueryOptions)) {
      // Always include in options
      (options as any)[key] = value;
    } else {
      // Special case for createDtTime filter handling
      if (key === 'createDtTime') {
        if (value === 'lastWeek') {
          const now = new Date();
          const lastWeek = new Date();
          lastWeek.setDate(now.getDate() - 7);
          filter.createDtTime = { $gte: lastWeek, $lte: now };
        } else if (value === 'lastMonth') {
          const now = new Date();
          const lastMonth = new Date();
          lastMonth.setMonth(now.getMonth() - 1);
          filter.createDtTime = { $gte: lastMonth, $lte: now };
        } else if (value === 'last6Months') {
          const now = new Date();
          const last6Months = new Date();
          last6Months.setMonth(now.getMonth() - 6);
          filter.createDtTime = { $gte: last6Months, $lte: now };
        } else if (
          value !== '' &&
          value !== '""' &&
          value !== "''" &&
          value !== undefined &&
          value !== null
        ) {
          filter.createDtTime = value;
        }
      }

      // General filtering (ignore blank values)
      else if (
        value !== '' &&
        value !== '""' &&
        value !== "''" &&
        value !== undefined &&
        value !== null
      ) {
        filter[key] = value;
      }
    }
  });

  return { options, filter };
}



