import { getInternalDashboardData, type InternalDashboardData } from "@/lib/v2";

export function loadDashboard(): InternalDashboardData {
  return getInternalDashboardData();
}

export function formatPercent(value: number, decimals = 0) {
  return `${value.toFixed(decimals)}%`;
}

export function formatRatio(value: number) {
  return `${Math.round(value * 100)}%`;
}
