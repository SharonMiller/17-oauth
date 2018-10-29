'use strict';

import mongoose from 'mongoose';

let Schema = mongoose.Schema;

const playerSchema = Schema({
  playerName: { type: String, required: true },
  position: { type: Number, min: 1, max: 22 },
  matches: { type: Number, min: 0, default: 0 },
  tries: { type: Number, min: 0, default: 0 },
  points: { type: Number, min: 0, default: 0 },
});

export default mongoose.model('players', playerSchema);