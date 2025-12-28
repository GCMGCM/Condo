const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection string from environment or default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/condo-platform';

// Collections to export
const collections = [
  'users',
  'condos',
  'condomanagers',
  'fractions',
  'condotypes',
  'condomanagerinvites',
  'supportinvites',
  'userlogs',
  'adminlogs'
];

// Convert object to CSV-safe string
function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Convert MongoDB document to flat object
function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && !(value._bsontype)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else if (Array.isArray(value)) {
      flattened[newKey] = JSON.stringify(value);
    } else if (value instanceof Date) {
      flattened[newKey] = value.toISOString();
    } else if (value && value._bsontype === 'ObjectId') {
      flattened[newKey] = value.toString();
    } else {
      flattened[newKey] = value;
    }
  }
  
  return flattened;
}

async function exportCollectionToCSV(collectionName) {
  try {
    const collection = mongoose.connection.collection(collectionName);
    const documents = await collection.find({}).toArray();
    
    if (documents.length === 0) {
      console.log(`⚠️  Collection "${collectionName}" is empty. Skipping.`);
      return;
    }
    
    // Flatten all documents
    const flatDocs = documents.map(doc => flattenObject(doc));
    
    // Get all unique keys from all documents
    const allKeys = new Set();
    flatDocs.forEach(doc => {
      Object.keys(doc).forEach(key => allKeys.add(key));
    });
    const headers = Array.from(allKeys);
    
    // Create CSV content
    let csv = headers.map(h => escapeCSV(h)).join(',') + '\n';
    
    flatDocs.forEach(doc => {
      const row = headers.map(header => escapeCSV(doc[header]));
      csv += row.join(',') + '\n';
    });
    
    // Write to file
    const outputDir = path.join(__dirname, '..', 'exports');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const filename = path.join(outputDir, `${collectionName}.csv`);
    fs.writeFileSync(filename, csv, 'utf8');
    
    console.log(`✅ Exported ${documents.length} documents from "${collectionName}" to ${filename}`);
  } catch (error) {
    console.error(`❌ Error exporting "${collectionName}":`, error.message);
  }
}

async function main() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    console.log('📊 Exporting collections to CSV...\n');
    
    for (const collectionName of collections) {
      await exportCollectionToCSV(collectionName);
    }
    
    console.log('\n✅ Export complete! CSV files saved in saas-site/exports/');
    
  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

main();
