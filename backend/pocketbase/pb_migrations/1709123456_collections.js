migrate((db) => {
  const collections = require('./pocketbase-schema.json');

  // Create collections
  collections.forEach(collection => {
    const { id, name, type, listRule, viewRule, createRule, updateRule, deleteRule, fields, indexes } = collection;
    
    const newCollection = new Collection({
      id,
      name, 
      type,
      listRule,
      viewRule,
      createRule,
      updateRule,
      deleteRule,
      indexes
    });

    fields.forEach(field => {
      newCollection.schema.addField(field);
    });

    return db.saveCollection(newCollection);
  });

  return Promise.resolve();
}, (db) => {
  // Revert
  const collections = require('./pocketbase-schema.json');
  
  collections.forEach(collection => {
    db.deleteCollection(collection.name);
  });
  
  return Promise.resolve();
}); 