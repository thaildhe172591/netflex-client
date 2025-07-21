export interface ReportDto {
  id: number;
  reason: string;
  description?: string;
  process: string;
  createdAt?: Date;
  createdBy?: string;
}

export interface UpdateReportPayload {
  reason?: string;
  description?: string;
}

export interface UpdateReportPayload {
  reason?: string;
  description?: string;
}

export interface ReportFilter {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
}
