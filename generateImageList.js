const fs = require("fs");
const path = require("path");

const imgDir = path.join(__dirname, "public/img");
const outputFile = path.join(__dirname, "public/images.json");

const files = fs.readdirSync(imgDir);

const data = {
  filenames: files.map(f => {
    let name = path.parse(f).name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = name.replace(/-/g, " ");
    return name;
  }),
  paths: files.map(f => `img/${f}`)
};

fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
console.log("✅ images.json generated successfully!");
