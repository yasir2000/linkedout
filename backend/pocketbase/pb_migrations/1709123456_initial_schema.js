migrate((app) => {
    // Import schema from JSON file
    const schema = require('./pocketbase-schema.json');

    // Create collections from schema
    schema.forEach(collectionConfig => {
        const collection = new Collection({
            id: collectionConfig.id,
            name: collectionConfig.name,
            type: collectionConfig.type,
            listRule: collectionConfig.listRule,
            viewRule: collectionConfig.viewRule,
            createRule: collectionConfig.createRule,
            updateRule: collectionConfig.updateRule,
            deleteRule: collectionConfig.deleteRule,
            fields: collectionConfig.fields,
            indexes: collectionConfig.indexes,
            system: collectionConfig.system,
            // Add other collection properties as needed
            options: {
                authRule: collectionConfig.authRule,
                manageRule: collectionConfig.manageRule,
                authAlert: collectionConfig.authAlert,
                oauth2: collectionConfig.oauth2,
                passwordAuth: collectionConfig.passwordAuth,
                mfa: collectionConfig.mfa,
                otp: collectionConfig.otp,
                authToken: collectionConfig.authToken,
                passwordResetToken: collectionConfig.passwordResetToken,
                emailChangeToken: collectionConfig.emailChangeToken,
                verificationToken: collectionConfig.verificationToken,
                fileToken: collectionConfig.fileToken,
                verificationTemplate: collectionConfig.verificationTemplate,
                resetPasswordTemplate: collectionConfig.resetPasswordTemplate,
                confirmEmailChangeTemplate: collectionConfig.confirmEmailChangeTemplate
            }
        });

        app.dao.saveCollection(collection);
    });
}, (app) => {
    // Revert - get collection names from schema
    const schema = require('./pocketbase-schema.json');
    const collectionNames = schema.map(c => c.name);

    collectionNames.forEach(name => {
        try {
            const collection = app.dao.findCollectionByNameOrId(name);
            if (collection) {
                app.dao.deleteCollection(collection);
            }
        } catch {}
    });
}); 