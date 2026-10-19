import { ConvertRequest, ConvertResponse } from "@/types/converter";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function convertWithBackend(req: ConvertRequest): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/convert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });

  const data: ConvertResponse = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to convert using Golang backend");
  }

  return data.result || "";
}
