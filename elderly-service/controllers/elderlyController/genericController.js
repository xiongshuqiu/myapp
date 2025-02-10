const mongoose = require('mongoose');

// Function to get the next ID
const getNextId = async (modelName, prefix, idField) => {
    try {
        // Dynamically get the model
        const Model = mongoose.model(modelName);
        // Find the current maximum ID
        const lastRequest = await Model.findOne().sort({ [idField]: -1 });
        let seq = 0;
        if (lastRequest && lastRequest[idField]) {
            seq = parseInt(lastRequest[idField].replace(prefix, ''), 10);
        }

        // Generate the new ID
        seq += 1;
        const newId = `${prefix}${String(seq).padStart(3, '0')}`;
        return newId;
    } catch (err) {
        console.error('Error getting next ID:', err);
        throw err;
    }
};


module.exports = getNextId ;
