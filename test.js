import path from 'path';
import mock from 'mock-fs';
import { tree, runCLI } from '.';
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('tree function', () => {
    let consoleSpy;

    beforeEach(() => {        
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        mock.restore();
    });

    test('должна корректно выводить директории и файлы (глубина 1)', async () => {        
        mock({
            '/test': {
                'folder1': {
                    'file1.txt': 'содержимое 1',
                    'file2.txt': 'содержимое 2'
                },
                'file3.txt': 'содержимое 3'
            }
        });

        const testPath = path.resolve('/test');
        await tree(testPath, 1);
        
        const calls = consoleSpy.mock.calls.map(call => call[0]);

        expect(calls).toEqual(expect.arrayContaining([
            'folder1',
            '│   file1.txt',
            '│   file2.txt',
            'file3.txt'
        ]));
        expect(calls.length).toBe(4);
    });

    test('должна корректно работать для пустой директории', async () => {
        mock({
            '/empty': {}
        });
        const testPath = path.resolve('/empty');
        await tree(testPath, 1);
        expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('должна выводить дерево до заданной глубины (глубина 2)', async () => {
        mock({
            '/test': {
                'folder1': {
                    'subfolder1': {
                        'fileA.txt': 'содержимое A'
                    }
                },
                'file1.txt': 'содержимое 1'
            }
        });
        const testPath = path.resolve('/test');
        await tree(testPath, 2);

        const calls = consoleSpy.mock.calls.map(call => call[0]);
        
        expect(calls).toEqual(expect.arrayContaining([
            'folder1',
            '│   subfolder1',
            '│   │   fileA.txt',
            'file1.txt'
        ]));
        expect(calls.length).toBe(4);
    });
    test('runCLI выводит ожидаемый результат', async () => {        
        mock({
            '/test': {
                'folder1': {
                    'file.txt': 'содержимое'
                },
                'file2.txt': 'содержимое'
            }
        }, { createCwd: false, createTmp: false });
        
        await runCLI(path.resolve('/test'));
        const calls = consoleSpy.mock.calls.map(call => call[0]);

        expect(calls).toEqual(expect.arrayContaining([
            'folder1',
            '│   file.txt',
            'file2.txt'
        ]));
    });
});