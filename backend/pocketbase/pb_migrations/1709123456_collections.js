migrate((app) => {
    // Step 1: Create collections without relations
    const snapshot = [
        {
            "id": "pbc_725385852",
            "listRule": "",
            "viewRule": "",
            "createRule": "@request.auth.id != \"\"",
            "updateRule": "@request.auth.id != \"\"",
            "deleteRule": "@request.auth.id != \"\"",
            "name": "inboxes",
            "type": "base",
            "fields": [
                {
                    "autogeneratePattern": "[a-z0-9]{15}",
                    "hidden": false,
                    "id": "text3208210256",
                    "max": 15,
                    "min": 15,
                    "name": "id",
                    "pattern": "^[a-z0-9]+$",
                    "presentable": false,
                    "primaryKey": true,
                    "required": true,
                    "system": true,
                    "type": "text"
                },
                {
                    "autogeneratePattern": "",
                    "hidden": false,
                    "id": "text770105660",
                    "max": 0,
                    "min": 0,
                    "name": "chatId",
                    "pattern": "",
                    "presentable": false,
                    "primaryKey": false,
                    "required": false,
                    "system": false,
                    "type": "text"
                },
                {
                    "convertURLs": false,
                    "hidden": false,
                    "id": "editor3065852031",
                    "maxSize": 0,
                    "name": "message",
                    "presentable": false,
                    "required": false,
                    "system": false,
                    "type": "editor"
                },
                {
                    "autogeneratePattern": "",
                    "hidden": false,
                    "id": "text2764284122",
                    "max": 0,
                    "min": 0,
                    "name": "messageId",
                    "pattern": "",
                    "presentable": false,
                    "primaryKey": false,
                    "required": false,
                    "system": false,
                    "type": "text"
                },
                {
                    "hidden": false,
                    "id": "date2782324286",
                    "max": "",
                    "min": "",
                    "name": "timestamp",
                    "presentable": false,
                    "required": false,
                    "system": false,
                    "type": "date"
                },
                {
                    "hidden": false,
                    "id": "select105650625",
                    "maxSelect": 1,
                    "name": "category",
                    "presentable": false,
                    "required": false,
                    "system": false,
                    "type": "select",
                    "values": [
                        "love-your-content",
                        "collab-proposal"
                    ]
                },
                {
                    "hidden": false,
                    "id": "bool1985015592",
                    "name": "isFromMe",
                    "presentable": false,
                    "required": false,
                    "system": false,
                    "type": "bool"
                },
                {
                    "hidden": false,
                    "id": "autodate2990389176",
                    "name": "created",
                    "onCreate": true,
                    "onUpdate": false,
                    "presentable": false,
                    "system": false,
                    "type": "autodate"
                },
                {
                    "hidden": false,
                    "id": "autodate3332085495",
                    "name": "updated",
                    "onCreate": true,
                    "onUpdate": true,
                    "presentable": false,
                    "system": false,
                    "type": "autodate"
                }
            ],
            "indexes": [],
            "system": false
        },
        {
            "id": "pbc_520427368",
            "listRule": "@request.auth.id != \"\"",
            "viewRule": "@request.auth.id != \"\"",
            "createRule": "@request.auth.id != \"\"",
            "updateRule": "@request.auth.id != \"\"",
            "deleteRule": null,
            "name": "people",
            "type": "base",
            "fields": [
                {
                    "autogeneratePattern": "[a-z0-9]{15}",
                    "hidden": false,
                    "id": "text3208210256",
                    "max": 15,
                    "min": 15,
                    "name": "id",
                    "pattern": "^[a-z0-9]+$",
                    "presentable": false,
                    "primaryKey": true,
                    "required": true,
                    "system": true,
                    "type": "text"
                },
                {
                    "exceptDomains": null,
                    "hidden": false,
                    "id": "url869342508",
                    "name": "linkedinUrl",
                    "onlyDomains": null,
                    "presentable": false,
                    "required": false,
                    "system": false,
                    "type": "url"
                },
                {
                    "autogeneratePattern": "",
                    "hidden": false,
                    "id": "text1579384326",
                    "max": 0,
                    "min": 0,
                    "name": "firstName",
                    "pattern": "",
                    "presentable": false,
                    "primaryKey": false,
                    "required": false,
                    "system": false,
                    "type": "text"
                },
                {
                    "hidden": false,
                    "id": "number2215181735",
                    "max": null,
                    "min": null,
                    "name": "followers",
                    "onlyInt": false,
                    "presentable": false,
                    "required": false,
                    "system": false,
                    "type": "number"
                },
                {
                    "autogeneratePattern": "",
                    "hidden": false,
                    "id": "text2434144904",
                    "max": 0,
                    "min": 0,
                    "name": "lastName",
                    "pattern": "",
                    "presentable": false,
                    "primaryKey": false,
                    "required": false,
                    "system": false,
                    "type": "text"
                },
                {
                    "exceptDomains": null,
                    "hidden": false,
                    "id": "url376926767",
                    "name": "avatar",
                    "onlyDomains": null,
                    "presentable": false,
                    "required": false,
                    "system": false,
                    "type": "url"
                },
                {
                    "hidden": false,
                    "id": "autodate2990389176",
                    "name": "created",
                    "onCreate": true,
                    "onUpdate": false,
                    "presentable": false,
                    "system": false,
                    "type": "autodate"
                },
                {
                    "hidden": false,
                    "id": "autodate3332085495",
                    "name": "updated",
                    "onCreate": true,
                    "onUpdate": true,
                    "presentable": false,
                    "system": false,
                    "type": "autodate"
                }
            ],
            "indexes": [],
            "system": false
        },
        {
            "id": "pbc_321265102",
            "listRule": null,
            "viewRule": null,
            "createRule": null,
            "updateRule": null,
            "deleteRule": null,
            "name": "textSnippets",
            "type": "base",
            "fields": [
                {
                    "autogeneratePattern": "[a-z0-9]{15}",
                    "hidden": false,
                    "id": "text3208210256",
                    "max": 15,
                    "min": 15,
                    "name": "id",
                    "pattern": "^[a-z0-9]+$",
                    "presentable": false,
                    "primaryKey": true,
                    "required": true,
                    "system": true,
                    "type": "text"
                },
                {
                    "autogeneratePattern": "",
                    "hidden": false,
                    "id": "text1579384326",
                    "max": 128,
                    "min": 0,
                    "name": "name",
                    "pattern": "",
                    "presentable": false,
                    "primaryKey": false,
                    "required": true,
                    "system": false,
                    "type": "text"
                },
                {
                    "autogeneratePattern": "",
                    "hidden": false,
                    "id": "text494360628",
                    "max": 0,
                    "min": 0,
                    "name": "value",
                    "pattern": "",
                    "presentable": false,
                    "primaryKey": false,
                    "required": false,
                    "system": false,
                    "type": "text"
                },
                {
                    "hidden": false,
                    "id": "autodate2990389176",
                    "name": "created",
                    "onCreate": true,
                    "onUpdate": false,
                    "presentable": false,
                    "system": false,
                    "type": "autodate"
                },
                {
                    "hidden": false,
                    "id": "autodate3332085495",
                    "name": "updated",
                    "onCreate": true,
                    "onUpdate": true,
                    "presentable": false,
                    "system": false,
                    "type": "autodate"
                }
            ],
            "indexes": [],
            "system": false
        }
    ];

    // Step 1: Create base collections
    return new Promise((resolve, reject) => {
        const collections = snapshot.map((item) => new Collection(item));
        Promise.all(collections.map(collection => app.save(collection)))
            .then(() => {
                // Step 2: Add relations
                try {
                    const inboxes = app.findCollectionByNameOrId("pbc_725385852");
                    const people = app.findCollectionByNameOrId("pbc_520427368");
                    
                    inboxes.schema.addField({
                        "cascadeDelete": false,
                        "collectionId": "pbc_520427368",
                        "id": "relation1593854671",
                        "name": "sender",
                        "type": "relation"
                    });

                    people.schema.addField({
                        "cascadeDelete": false,
                        "collectionId": "pbc_725385852",
                        "id": "relation1542800728",
                        "name": "messages",
                        "type": "relation"
                    });

                    Promise.all([
                        app.save(inboxes),
                        app.save(people)
                    ]).then(resolve).catch(reject);
                } catch (err) {
                    reject(err);
                }
            })
            .catch(reject);
    });
}, (app) => {
    // Down migration
    const snapshot = [
        // Same collections without relations
    ];
    const collections = snapshot.map((item) => new Collection(item));
    return Promise.all(collections.map(collection => app.save(collection)));
}); 