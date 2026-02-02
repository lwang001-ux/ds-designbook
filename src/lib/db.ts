import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Generic read/write functions for JSON files
export async function readData<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return empty array/object if file doesn't exist
    if (filename.endsWith('.json')) {
      return (filename === 'threads.json' ? {} : []) as T;
    }
    throw error;
  }
}

export async function writeData<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
