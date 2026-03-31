import { describe, test, expect } from 'bun:test';
import { textFilterToString, rangeFilterToStrings } from './filters.ts';
import type { TextFilter, RangeFilter } from './filters.ts';

describe('textFilterToString', () => {
  test('converts eq filter', () => {
    const filter: TextFilter = { eq: 'Checking' };
    expect(textFilterToString(filter)).toBe('eq.Checking');
  });

  test('converts contains filter', () => {
    const filter: TextFilter = { contains: 'savings' };
    expect(textFilterToString(filter)).toBe('contains.savings');
  });

  test('converts containsInsensitive filter', () => {
    const filter: TextFilter = { containsInsensitive: 'cash' };
    expect(textFilterToString(filter)).toBe('contains-i.cash');
  });

  test('handles special characters', () => {
    const filter: TextFilter = { eq: 'Account #123' };
    expect(textFilterToString(filter)).toBe('eq.Account #123');
  });
});

describe('rangeFilterToStrings', () => {
  test('converts single eq filter', () => {
    const filter: RangeFilter = { eq: '2024-01-01' };
    expect(rangeFilterToStrings(filter)).toEqual(['eq.2024-01-01']);
  });

  test('converts gt filter', () => {
    const filter: RangeFilter = { gt: '100' };
    expect(rangeFilterToStrings(filter)).toEqual(['gt.100']);
  });

  test('converts gte filter', () => {
    const filter: RangeFilter = { gte: '2024-01-01T00:00:00Z' };
    expect(rangeFilterToStrings(filter)).toEqual(['gte.2024-01-01T00:00:00Z']);
  });

  test('converts lt filter', () => {
    const filter: RangeFilter = { lt: '500' };
    expect(rangeFilterToStrings(filter)).toEqual(['lt.500']);
  });

  test('converts lte filter', () => {
    const filter: RangeFilter = { lte: '2024-12-31' };
    expect(rangeFilterToStrings(filter)).toEqual(['lte.2024-12-31']);
  });

  test('converts multiple filters (range)', () => {
    const filter: RangeFilter = { gte: '100', lte: '500' };
    expect(rangeFilterToStrings(filter)).toEqual(['gte.100', 'lte.500']);
  });

  test('converts date range', () => {
    const filter: RangeFilter = {
      gte: '2024-01-01T00:00:00Z',
      lt: '2024-02-01T00:00:00Z'
    };
    expect(rangeFilterToStrings(filter)).toEqual([
      'gte.2024-01-01T00:00:00Z',
      'lt.2024-02-01T00:00:00Z'
    ]);
  });

  test('returns empty array for empty filter', () => {
    const filter: RangeFilter = {};
    expect(rangeFilterToStrings(filter)).toEqual([]);
  });

  test('preserves order: eq, gt, gte, lt, lte', () => {
    const filter: RangeFilter = {
      lte: '500',
      gte: '100',
      gt: '99',
      lt: '501',
      eq: '300'
    };
    expect(rangeFilterToStrings(filter)).toEqual([
      'eq.300',
      'gt.99',
      'gte.100',
      'lt.501',
      'lte.500'
    ]);
  });
});
