import fs from "fs";
import path from "path";

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".git" && file !== "dist") {
        walkDir(fullPath);
      }
    } else if (file.endsWith(".jsx") || file.endsWith(".js") || file.endsWith(".css")) {
      let content = fs.readFileSync(fullPath, "utf8");
      let original = content;
      content = content.replace(/bg-linear-to-r/g, "bg-gradient-to-r");
      content = content.replace(/bg-linear-to-l/g, "bg-gradient-to-l");
      content = content.replace(/bg-linear-to-br/g, "bg-gradient-to-br");
      content = content.replace(/backdrop-blur-xs/g, "backdrop-blur-sm");
      if (content !== original) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log("Normalized classes in:", fullPath);
      }
    }
  }
}

walkDir("src");
console.log("Tailwind class normalization complete.");
