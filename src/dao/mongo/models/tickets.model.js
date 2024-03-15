const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const ticketsCollection = 'tickets';


const ticketsSchema = new mongoose.Schema ({
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: Number,
    purchaser: { type: String, required: true },
});


ticketsSchema.plugin(mongoosePaginate);

const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);


module.exports = {
    ticketsModel
};
