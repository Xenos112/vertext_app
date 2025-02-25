import { describe, it, expect } from 'vitest';
import formatDate from '@/utils/format-date';

describe('formatDate', () => {

  it('should return "Just now" for the current date', () => {
    const now = new Date();
    expect(formatDate(now)).toBe("Just now");
  });

  it('should return the correct time ago in minutes', () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 10); // 10 minutes ago
    expect(formatDate(date)).toBe('10m ago');
  });

  it('should return the correct time ago in hours', () => {
    const date = new Date();
    date.setHours(date.getHours() - 5); // 5 hours ago
    expect(formatDate(date)).toBe('5h ago');
  });

  it('should return the correct time ago in days', () => {
    const date = new Date();
    date.setDate(date.getDate() - 3); // 3 days ago
    expect(formatDate(date)).toBe('3d ago');
  });

  it('should return the correct formatted date for more than 7 days ago', () => {
    const date = new Date();
    date.setDate(date.getDate() - 10); // 10 days ago
    expect(formatDate(date)).toBe(date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }));
  });

  it('should handle string input in "YYYY-MM-DD" format correctly', () => {
    const dateString = '2025-02-13';
    expect(formatDate(dateString)).toBe('13/02/2025');
  });

  it('should handle string input with time and return time ago', () => {
    const dateString = '2025-02-23T10:00:00';
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60));
    expect(formatDate(dateString)).toBe(`${diffInHours}h ago`);
  });

  it('should handle invalid date strings gracefully', () => {
    const invalidDate = 'invalid-date';
    expect(formatDate(invalidDate)).toBe("Just now"); // Or any default fallback value
  });

  it('should return "Just now" for the date just milliseconds ago', () => {
    const now = new Date();
    const justNow = new Date(now.getTime() - 500); // 500 milliseconds ago
    expect(formatDate(justNow)).toBe('Just now');
  });

  it('should correctly format a date from the past year', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1); // 1 year ago
    expect(formatDate(date)).toBe(date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }));
  });

});

