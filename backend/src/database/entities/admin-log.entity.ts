export interface AdminLog {
  id: string;
  adminId: string;
  atISO: string;
  action: string;
  target?: string;
  details?: Record<string, any>;
}



