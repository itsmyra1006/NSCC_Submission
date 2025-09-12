import { JSONFilePreset } from 'lowdb/node';

// Default data to ensure the file is created correctly if it's missing
const defaultData = { users: [], posts: [], comments: [] };

const db = await JSONFilePreset('db.json', defaultData);

export default db;

