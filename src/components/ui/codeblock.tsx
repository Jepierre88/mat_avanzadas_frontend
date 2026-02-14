import { useTheme } from "@/app/presentation/components/theme-provider";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CodeBlock({ code, language = "python", className = "", style }: CodeBlockProps) {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"));

  return (
    <SyntaxHighlighter
      language={language}
      style={isDark ? vscDarkPlus : oneLight}
      customStyle={{
        borderRadius: "0.75rem",
        width: "100%",
        margin: 0,
        fontSize: "0.95rem",
        padding: "1.25rem 1rem",
        background: "transparent",
        ...style,
      }}
      className={className + " shadow-sm border"}
      showLineNumbers
      wrapLongLines
    >
      {code}
    </SyntaxHighlighter>
  );
}
