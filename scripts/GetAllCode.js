/* eslint-disable */

const fs = require("node:fs");
const path = require("node:path");

const pathSRC = path.join(__dirname, "src")
const outputPath=  path.join(__dirname, "code.txt")
const outputFile = fs.createWriteStream(outputPath)

const getFiles = (link) => {
    const child = fs.readdirSync(link).map(item => path.join(link, item))
    for (const children of child) {
        const stat = fs.lstatSync(children)
        const ext = path.parse(children).ext
        if (stat.isFile() && [".ts",".tsx"].includes(ext)) {
            outputFile.write(fs.readFileSync(children, { encoding: "utf-8"}) + "\n")
        } else if (stat.isDirectory()){
            getFiles(children)
        }
    }
}

getFiles(pathSRC)
