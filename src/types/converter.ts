export type FormatType = "csv" | "yaml" | "xml" | "typescript" | "sql";

export interface ConvertRequest {
  jsonData: string;
  targetType: FormatType;
}

export interface ConvertResponse {
  success: boolean;
  result?: string;
  error?: string;
}
