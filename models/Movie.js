const mongoose = require('mongoose');

// const EpisodeSchema = new mongoose.Schema({
//     id: Number,
//     title: String,
//     episodeNumber: Number,
//     description: String,
//     uploadedAt: String,
// });

const EpisodeSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    episodeNumber: { type: Number, required: true, index: true },
    downloadUrl: { type: String, required: true, trim: true},
    description: { type: String, trim: true },
    uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Add virtual `id` field
EpisodeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialized
EpisodeSchema.set('toJSON', {
    virtuals: true,
});

EpisodeSchema.set('toObject', {
    virtuals: true,
});

const Episode = mongoose.model('Episode', EpisodeSchema);


const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    youtubeUrl: { type: String, trim: true },
    episodes: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }],
        default: []
    }
}, { timestamps: true });

// Add virtual `id` field
MovieSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialized
MovieSchema.set('toJSON', {
    virtuals: true,
});

MovieSchema.set('toObject', {
    virtuals: true,
});

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = {
    Movie,
    Episode
};