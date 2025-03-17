import path from 'path';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'url';

const dirPath = path.resolve('D:/OTUS');

export const tree = async (dir, depth = 0, currentDepth = 0) => {
    const data = await readdir(dir, { withFileTypes: true})
    
    for (let item of data) {        
        const fullPath = path.join(dir, item.name)
        const isLastItem = data.indexOf(item) === data.length - 1;        
        if (item.isDirectory()) {            
            console.log(`${'│   '.repeat(currentDepth)}${item.name}`)
            if (currentDepth < depth) {await tree(fullPath, depth, currentDepth + 1)}
        } else {            
            console.log(`${'│   '.repeat(currentDepth)}${item.name}`);
        }
    }   
}

export const runCLI = async (dirPath = path.resolve('D:/OTUS')) => {
    await tree(dirPath, 1);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runCLI();
}