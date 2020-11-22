const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MSHighscore = new Schema({
    mode: { type: String, required: true },
    name: { type: String, required: true },
    high_score: { type: Number, required: true },
    time_stamp: { type: Number, required: true },
});

module.exports = mongoose.model('Highscore', MSHighscore, 'ms_schemas');

const MSSave = new Schema({
    name: { type: String, required: true, unique: true },
    save: Schema.Types.Mixed,
});

module.exports = mongoose.model('Save', MSSave, 'ms_schemas');

const MSUser = new Schema({
    name: { type: String, required: true, unique: true },
    salt: { type: String, required: true },
    pass: { type: String, required: true },
    //save: { type: Schema.Types.ObjectId, ref: 'MSSave' },
});

module.exports = mongoose.model('User', MSUser, 'ms_schemas');