
import fs from 'fs';
import path from 'path';

/**
 * Returns a list of all files in a directory and its subdirectories
 * @param {*} dir directory to traverse
 * @param {*} file_list list to append files to
 */
function recursively_traverse_directories(dir, file_list) { 
    fs.readdirSync(dir).forEach(file => {
        let dirPath = path.join(dir, file);
        let isFile = !fs.statSync(dirPath).isDirectory();
        isFile 
            ? file_list.push(dirPath)
            : recursively_traverse_directories(dirPath, file_list)
            ;
    });
}

/**
 * Generate a list of all nodes in the public/js/nodes directory
 * @returns {Array} List of all nodes in the public/js/nodes directory
 */
export default function generate_module_list() { 

    let node_directories = ['./public/js/nodes'];
    let node_list = [];

    node_directories.forEach(dir => {
        recursively_traverse_directories(dir, node_list);
    });

    node_list = node_list.map(e => e.split('/').slice(1).join('/'));

    return node_list;   
}