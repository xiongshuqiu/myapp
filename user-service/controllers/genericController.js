const mongoose = require('mongoose');

// Function to get the next ID
const getNextId = async (modelName, prefix, idField) => {
  try {
    // Dynamically get the model
    const Model = mongoose.model(modelName);
    // Find the maximum ID for the given prefix
    const lastRequest = await Model.findOne({
      [idField]: { $regex: `^${prefix}` },
    }).sort({ [idField]: -1 });
    let seq = 0;

    if (lastRequest && lastRequest[idField]) {
      console.log(`上一个请求的ID: ${lastRequest[idField]}`);
      // Extract the numeric part after removing the prefix
      const numericPart = lastRequest[idField].slice(prefix.length);
      seq = parseInt(numericPart, 10);
    }

    // Generate the new ID
    seq += 1;
    const newId = `${prefix}${String(seq).padStart(3, '0')}`;
    console.log(`生成的新ID: ${newId}`);
    return newId;
  } catch (err) {
    console.error('获取下一个ID时出错:', err);
    throw err;
  }
};

module.exports = getNextId;
