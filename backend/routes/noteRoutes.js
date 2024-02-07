const express = require('express');
const router = express.Router();
const { getNotes, getNote, postNote, deleteNote, patchNote, patchMultiple } = require('../controllers/controllers')

// get single note
router.get('/:id', getNote)

// get all notes
router.get('/', getNotes)

// create // insert note
router.post('/', postNote)

// update existing note
router.patch('/:id', patchNote)

// update existing note
router.patch('/', patchMultiple)

// delete note
router.delete('/:id', deleteNote)

module.exports = router; 