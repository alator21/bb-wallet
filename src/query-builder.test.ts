import { describe, test, expect } from 'bun:test';
import { QueryBuilder } from './query-builder.ts';
import type { TextFilter, RangeFilter } from './filters.ts';

describe('QueryBuilder', () => {
  describe('add (scalar values)', () => {
    test('adds string parameter', () => {
      const query = QueryBuilder.create()
        .add('name', 'test')
        .build();

      expect(query).toBe('?name=test');
    });

    test('adds number parameter', () => {
      const query = QueryBuilder.create()
        .add('limit', 50)
        .build();

      expect(query).toBe('?limit=50');
    });

    test('adds boolean parameter', () => {
      const query = QueryBuilder.create()
        .add('agentHints', true)
        .build();

      expect(query).toBe('?agentHints=true');
    });

    test('ignores undefined values', () => {
      const query = QueryBuilder.create()
        .add('name', undefined)
        .add('limit', 50)
        .build();

      expect(query).toBe('?limit=50');
    });

    test('adds multiple scalar parameters', () => {
      const query = QueryBuilder.create()
        .add('limit', 30)
        .add('offset', 10)
        .add('agentHints', false)
        .build();

      expect(query).toBe('?limit=30&offset=10&agentHints=false');
    });
  });

  describe('addArray', () => {
    test('adds array as comma-separated values', () => {
      const query = QueryBuilder.create()
        .addArray('id', ['id1', 'id2', 'id3'])
        .build();

      expect(query).toBe('?id=id1%2Cid2%2Cid3');
    });

    test('ignores empty array', () => {
      const query = QueryBuilder.create()
        .addArray('id', [])
        .add('limit', 10)
        .build();

      expect(query).toBe('?limit=10');
    });

    test('ignores undefined array', () => {
      const query = QueryBuilder.create()
        .addArray('id', undefined)
        .add('limit', 10)
        .build();

      expect(query).toBe('?limit=10');
    });

    test('handles single item array', () => {
      const query = QueryBuilder.create()
        .addArray('id', ['single'])
        .build();

      expect(query).toBe('?id=single');
    });
  });

  describe('addTextFilters', () => {
    test('adds single eq filter', () => {
      const filters: TextFilter[] = [{ eq: 'Checking' }];
      const query = QueryBuilder.create()
        .addTextFilters('name', filters)
        .build();

      expect(query).toBe('?name=eq.Checking');
    });

    test('adds single contains filter', () => {
      const filters: TextFilter[] = [{ contains: 'savings' }];
      const query = QueryBuilder.create()
        .addTextFilters('name', filters)
        .build();

      expect(query).toBe('?name=contains.savings');
    });

    test('adds single containsInsensitive filter', () => {
      const filters: TextFilter[] = [{ containsInsensitive: 'cash' }];
      const query = QueryBuilder.create()
        .addTextFilters('name', filters)
        .build();

      expect(query).toBe('?name=contains-i.cash');
    });

    test('adds multiple filters for AND logic', () => {
      const filters: TextFilter[] = [
        { containsInsensitive: 'savings' },
        { containsInsensitive: 'account' }
      ];
      const query = QueryBuilder.create()
        .addTextFilters('name', filters)
        .build();

      expect(query).toBe('?name=contains-i.savings&name=contains-i.account');
    });

    test('ignores empty filter array', () => {
      const query = QueryBuilder.create()
        .addTextFilters('name', [])
        .add('limit', 10)
        .build();

      expect(query).toBe('?limit=10');
    });

    test('ignores undefined filters', () => {
      const query = QueryBuilder.create()
        .addTextFilters('name', undefined)
        .add('limit', 10)
        .build();

      expect(query).toBe('?limit=10');
    });
  });

  describe('addRangeFilter', () => {
    test('adds single eq filter', () => {
      const filter: RangeFilter = { eq: '2024-01-01' };
      const query = QueryBuilder.create()
        .addRangeFilter('createdAt', filter)
        .build();

      expect(query).toBe('?createdAt=eq.2024-01-01');
    });

    test('adds single gte filter', () => {
      const filter: RangeFilter = { gte: '100' };
      const query = QueryBuilder.create()
        .addRangeFilter('amount', filter)
        .build();

      expect(query).toBe('?amount=gte.100');
    });

    test('adds range with gte and lt', () => {
      const filter: RangeFilter = { gte: '100', lt: '500' };
      const query = QueryBuilder.create()
        .addRangeFilter('amount', filter)
        .build();

      expect(query).toBe('?amount=gte.100&amount=lt.500');
    });

    test('adds date range', () => {
      const filter: RangeFilter = {
        gte: '2024-01-01T00:00:00Z',
        lt: '2024-02-01T00:00:00Z'
      };
      const query = QueryBuilder.create()
        .addRangeFilter('createdAt', filter)
        .build();

      expect(query).toBe('?createdAt=gte.2024-01-01T00%3A00%3A00Z&createdAt=lt.2024-02-01T00%3A00%3A00Z');
    });

    test('ignores empty range filter', () => {
      const filter: RangeFilter = {};
      const query = QueryBuilder.create()
        .addRangeFilter('createdAt', filter)
        .add('limit', 10)
        .build();

      expect(query).toBe('?limit=10');
    });

    test('ignores undefined range filter', () => {
      const query = QueryBuilder.create()
        .addRangeFilter('createdAt', undefined)
        .add('limit', 10)
        .build();

      expect(query).toBe('?limit=10');
    });
  });

  describe('build', () => {
    test('returns empty string when no parameters', () => {
      const query = QueryBuilder.create().build();
      expect(query).toBe('');
    });

    test('combines different parameter types', () => {
      const query = QueryBuilder.create()
        .add('limit', 50)
        .add('offset', 10)
        .addArray('id', ['id1', 'id2'])
        .addTextFilters('name', [{ containsInsensitive: 'savings' }])
        .addRangeFilter('createdAt', { gte: '2024-01-01' })
        .build();

      expect(query).toContain('limit=50');
      expect(query).toContain('offset=10');
      expect(query).toContain('id=id1%2Cid2');
      expect(query).toContain('name=contains-i.savings');
      expect(query).toContain('createdAt=gte.2024-01-01');
      expect(query.startsWith('?')).toBe(true);
    });
  });

  describe('chaining', () => {
    test('supports method chaining', () => {
      const builder = QueryBuilder.create();
      const result = builder
        .add('limit', 10)
        .add('offset', 0)
        .addArray('id', ['test']);

      expect(result).toBe(builder);
    });

    test('builds complex query with chaining', () => {
      const query = QueryBuilder.create()
        .add('limit', 30)
        .add('offset', 0)
        .add('agentHints', true)
        .addArray('id', ['acc1', 'acc2', 'acc3'])
        .addTextFilters('name', [{ containsInsensitive: 'checking' }])
        .add('accountType', 'CurrentAccount')
        .add('currencyCode', 'USD')
        .addRangeFilter('createdAt', { gte: '2024-01-01', lt: '2024-12-31' })
        .build();

      expect(query).toContain('limit=30');
      expect(query).toContain('offset=0');
      expect(query).toContain('agentHints=true');
      expect(query).toContain('id=acc1%2Cacc2%2Cacc3');
      expect(query).toContain('name=contains-i.checking');
      expect(query).toContain('accountType=CurrentAccount');
      expect(query).toContain('currencyCode=USD');
      expect(query).toContain('createdAt=gte.2024-01-01');
      expect(query).toContain('createdAt=lt.2024-12-31');
    });
  });
});
