import { describe, it, expect } from 'vitest';
import {
  calculateHourlyPUE,
  calculatePUE,
  getPUEStatus,
  getTemperatureStatus,
  getHumidityStatus,
} from '../types';

describe('PUE math', () => {
  it('calculateHourlyPUE divides power by load', () => {
    expect(calculateHourlyPUE(200, 150)).toBeCloseTo(1.333, 2);
  });
  it('returns 0 when IT load is 0 (no divide-by-zero)', () => {
    expect(calculateHourlyPUE(200, 0)).toBe(0);
    expect(calculatePUE(100, 0)).toBe(0);
  });
});

describe('status thresholds', () => {
  it.each([
    [1.4, 'good'],
    [1.5, 'good'],
    [1.8, 'warning'],
    [2.0, 'warning'],
    [2.5, 'critical'],
  ])('getPUEStatus(%f) -> %s', (v, want) => {
    expect(getPUEStatus(v)).toBe(want);
  });

  it.each([
    [22, 'good'],
    [17, 'warning'],
    [28, 'warning'],
    [32, 'critical'],
    [10, 'critical'],
  ])('getTemperatureStatus(%f) -> %s', (v, want) => {
    expect(getTemperatureStatus(v)).toBe(want);
  });

  it.each([
    [55, 'good'],
    [35, 'warning'],
    [75, 'warning'],
    [85, 'critical'],
    [20, 'critical'],
  ])('getHumidityStatus(%f) -> %s', (v, want) => {
    expect(getHumidityStatus(v)).toBe(want);
  });
});
