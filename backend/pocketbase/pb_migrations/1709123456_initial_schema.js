migrate((db) => {
  const collections = require('./pocketbase-schema.json');
  
  // Create collections from schema
  collections.forEach((collection) => {
    const { name, type, listRule, viewRule, createRule, updateRule, deleteRule, fields, indexes } = collection;
    
    // Create collection
    const col = new Collection({
      name,
      type,
      listRule,
      viewRule,
      createRule,
      updateRule,
      deleteRule,
      indexes
    });

    // Add fields
    fields.forEach((field) => {
      col.schema.addField(field);
    });

    return db.saveCollection(col);
  });
}, (db) => {
  // Revert
  const collections = require('./pocketbase-schema.json');
  collections.forEach((collection) => {
    db.deleteCollection(collection.name);
  });
}); 