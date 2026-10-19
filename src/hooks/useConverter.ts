"use client";

import { useState } from "react";
import { FormatType } from "@/types/converter";
import { convertClientSide } from "@/services/converters/localConverters";
import { convertWithBackend } from "@/services/api";

const DEFAULT_SAMPLE_JSON = `[
  {
    "id": 1,
    "name": "Somchai Jaidee",
    "email": "somchai@example.com",
    "role": "admin",
    "isActive": true
  },
  {
    "id": 2,
    "name": "Manee Meeta",
    "email": "manee@example.com",
    "role": "editor",
    "isActive": false
  }
]`;

export function useConverter() {
  const [jsonInput, setJsonInput] = useState<string>(DEFAULT_SAMPLE_JSON);
  const [targetFormat, setTargetFormat] = useState<FormatType>("csv");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [useBackend, setUseBackend] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const convert = async (customInput?: unknown, customFormat?: FormatType) => {
    const inputToUse = typeof customInput === "string" ? customInput : jsonInput;
    const formatToUse = typeof customFormat === "string" ? customFormat : targetFormat;

    if (!inputToUse || !inputToUse.trim()) {
      setOutput("");
      setError("Please enter or upload JSON data first");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      if (useBackend) {
        const result = await convertWithBackend({
          jsonData: inputToUse,
          targetType: formatToUse,
        });
        setOutput(result);
        return result;
      } else {
        const result = convertClientSide(inputToUse, formatToUse);
        setOutput(result);
        return result;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during conversion";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    setError(null);

    if (!file.name.toLowerCase().endsWith(".json") && file.type && !file.type.includes("json")) {
      setError(`Warning: "${file.name}" may not be a JSON file. Please upload a .json file.`);
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const rawText = e.target?.result as string;
      if (!rawText) {
        setError(`File "${file.name}" is empty`);
        return;
      }

      setUploadedFileName(file.name);

      try {
        const parsed = JSON.parse(rawText);
        const formatted = JSON.stringify(parsed, null, 2);
        setJsonInput(formatted);

        // Auto-convert to current target format
        try {
          if (!useBackend) {
            const result = convertClientSide(formatted, targetFormat);
            setOutput(result);
          } else {
            convertWithBackend({
              jsonData: formatted,
              targetType: targetFormat,
            }).then((res) => setOutput(res)).catch(() => {});
          }
        } catch {
          // If auto-convert fails, keep output blank for manual convert
          setOutput("");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setJsonInput(rawText);
        setError(`JSON Parse Error in "${file.name}": ${message}`);
        setOutput("");
      }
    };

    reader.onerror = () => {
      setError(`Failed to read file "${file.name}"`);
    };

    reader.readAsText(file, "UTF-8");
  };

  const exportOutput = () => {
    if (!output) {
      setError("No converted output to export");
      return false;
    }

    try {
      // Determine base file name
      let baseName = "export";
      if (uploadedFileName) {
        baseName = uploadedFileName.replace(/\.[^/.]+$/, "");
      } else {
        const dateStr = new Date().toISOString().slice(0, 10);
        baseName = `data_${dateStr}`;
      }

      let mimeType = "text/plain;charset=utf-8;";
      let extension = targetFormat as string;
      let content = output;

      switch (targetFormat) {
        case "csv":
          mimeType = "text/csv;charset=utf-8;";
          extension = "csv";
          // Prepend UTF-8 BOM (\uFEFF) so Excel handles Thai and special characters correctly
          content = "\uFEFF" + output;
          break;
        case "yaml":
          mimeType = "text/yaml;charset=utf-8;";
          extension = "yaml";
          break;
        case "xml":
          mimeType = "application/xml;charset=utf-8;";
          extension = "xml";
          break;
        case "typescript":
          mimeType = "text/typescript;charset=utf-8;";
          extension = "ts";
          break;
        case "sql":
          mimeType = "text/plain;charset=utf-8;";
          extension = "sql";
          break;
      }

      const fileName = `${baseName}.${extension}`;
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`Failed to export: ${message}`);
      return false;
    }
  };

  const clear = () => {
    setJsonInput("");
    setOutput("");
    setError(null);
    setUploadedFileName(null);
  };

  return {
    jsonInput,
    setJsonInput,
    targetFormat,
    setTargetFormat,
    output,
    error,
    isLoading,
    useBackend,
    setUseBackend,
    uploadedFileName,
    setUploadedFileName,
    handleFileUpload,
    exportOutput,
    convert,
    clear,
  };
}
