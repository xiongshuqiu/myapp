const mongoose = require('mongoose');
// BedStatus Schema
const bedStatusSchema = new mongoose.Schema({
    bedId: { type: String, required: true, unique: true }, // 床位编号 3-1-101s-01
    building: { type: Number, required: true }, // 楼栋号 3
    floor: { type: Number, required: true }, // 楼层1
    room: { type: String, required: true }, // 房间号101
    roomType: { type: String, enum: ['s', 'b'], default: 's' }, // 房型s或b
    bedNumber: { type: String, required: true }, // 床位编号01/02/03/04/05
    status: { type: String, required: true }, // occupied/available/reserved/maintenance
  });
  const BedStatus = mongoose.model('BedStatus', bedStatusSchema);
module.exports =  BedStatus
   
  
