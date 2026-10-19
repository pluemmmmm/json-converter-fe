import { FormatType } from "@/types/converter";

export function convertToCSV(parsed: unknown): string {
  let list: Record<string, unknown>[] = Array.isArray(parsed)
    ? (parsed as Record<string, unknown>[])
    : [parsed as Record<string, unknown>];

  // If parsed is an object containing an array under a single wrapper key like { "data": [...] } or { "items": [...] }
  if (!Array.isArray(parsed) && typeof parsed === "object" && parsed !== null) {
    const obj = parsed as Record<string, unknown>;
    const objKeys = Object.keys(obj);
    const arrayKey = objKeys.find(
      (k) => Array.isArray(obj[k]) && (obj[k] as unknown[]).length > 0 && typeof (obj[k] as unknown[])[0] === "object"
    );
    if (arrayKey && objKeys.length === 1) {
      list = obj[arrayKey] as Record<string, unknown>[];
    }
  }

  if (list.length === 0) return "";
  const keys = Array.from(
    new Set(list.flatMap((item) => (typeof item === "object" && item !== null ? Object.keys(item) : [])))
  );
  const header = keys.join(",");
  const rows = list.map((item) =>
    keys
      .map((k) => {
        const val = item?.[k] ?? "";
        const valStr = typeof val === "object" ? JSON.stringify(val) : String(val);
        return `"${valStr.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  return [header, ...rows].join("\n");
}

export function convertToYAML(obj: unknown, indent = 0): string {
  const spaces = " ".repeat(indent);
  if (obj === null) return "null";
  if (typeof obj !== "object") return String(obj);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          const inner = convertToYAML(item, indent + 2);
          const [first, ...rest] = inner.split("\n");
          return `${spaces}- ${first.trimStart()}\n${rest.map((r) => (r ? `${spaces}  ${r}` : "")).join("\n")}`.trimEnd();
        }
        return `${spaces}- ${convertToYAML(item, indent + 2)}`;
      })
      .join("\n");
  }
  return Object.entries(obj as Record<string, unknown>)
    .map(([k, v]) => {
      if (typeof v === "object" && v !== null) {
        return `${spaces}${k}:\n${convertToYAML(v, indent + 2)}`;
      }
      return `${spaces}${k}: ${convertToYAML(v, indent + 2)}`;
    })
    .join("\n");
}

export function convertToTypeScript(parsed: unknown): string {
  const inferType = (val: unknown): string => {
    if (val === null) return "unknown";
    if (Array.isArray(val)) {
      return val.length > 0 ? `${inferType(val[0])}[]` : "unknown[]";
    }
    if (typeof val === "object") {
      const entries = Object.entries(val as Record<string, unknown>).map(
        ([k, v]) => `  ${k}: ${inferType(v)};`
      );
      return `{\n${entries.join("\n")}\n}`;
    }
    return typeof val;
  };

  const sample = Array.isArray(parsed) ? parsed[0] : parsed;
  return `export interface RootObject ${inferType(sample)}`;
}

export function convertToSQL(parsed: unknown, tableName = "records"): string {
  const list: Record<string, unknown>[] = Array.isArray(parsed)
    ? (parsed as Record<string, unknown>[])
    : [parsed as Record<string, unknown>];
  if (list.length === 0) return "";
  const keys = Object.keys(list[0] || {});
  const inserts = list.map((item) => {
    const vals = keys.map((k) => {
      const v = item[k];
      if (typeof v === "number" || typeof v === "boolean") return v;
      if (v === null || v === undefined) return "NULL";
      return `'${String(v).replace(/'/g, "''")}'`;
    });
    return `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${vals.join(", ")});`;
  });
  return inserts.join("\n");
}

export function convertToXML(val: unknown, name = "item"): string {
  if (val === null || val === undefined) return `<${name}></${name}>`;
  if (Array.isArray(val)) {
    return val.map((item) => convertToXML(item, name)).join("\n");
  }
  if (typeof val === "object") {
    const children = Object.entries(val as Record<string, unknown>)
      .map(([k, v]) => convertToXML(v, k))
      .join("\n");
    return `<${name}>\n${children}\n</${name}>`;
  }
  return `<${name}>${String(val)}</${name}>`;
}

export function convertClientSide(rawJSON: string, format: FormatType): string {
  const parsed = JSON.parse(rawJSON);
  switch (format) {
    case "csv":
      return convertToCSV(parsed);
    case "yaml":
      return convertToYAML(parsed);
    case "typescript":
      return convertToTypeScript(parsed);
    case "sql":
      return convertToSQL(parsed);
    case "xml":
      return `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${convertToXML(parsed)}\n</root>`;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
