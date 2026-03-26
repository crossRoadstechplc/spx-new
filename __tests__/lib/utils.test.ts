/* Phase 1: Unit tests for utility functions */
import { cn, formatDate } from '@/lib/utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'truthy', false && 'falsy')).toBe('base truthy');
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
  });

  it('should handle undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('should merge tailwind classes without conflicts', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});

describe('formatDate', () => {
  it('should format Date object', () => {
    const date = new Date('2024-03-15');
    const result = formatDate(date);
    expect(result).toMatch(/March 1[45], 2024/);
  });

  it('should format date string', () => {
    const result = formatDate('2024-03-15');
    expect(result).toMatch(/March 1[45], 2024/);
  });

  it('should handle ISO date strings', () => {
    const result = formatDate('2024-12-25T10:00:00Z');
    expect(result).toMatch(/December 2[45], 2024/);
  });
});
