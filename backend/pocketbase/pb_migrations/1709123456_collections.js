migrate((app) => {
    const collections = JSON.parse(`YOUR_SCHEMA_JSON_HERE`);
    
    collections.forEach(collection => {
        const newCollection = new Collection(collection);
        app.save(newCollection);
    });
}, (app) => {
    // revert
    ["users", "inboxes", "people", "textSnippets"].forEach(name => {
        try {
            const collection = app.findCollectionByNameOrId(name);
            if (collection) {
                app.delete(collection);
            }
        } catch {}
    });
}); 