import React, { forwardRef, useContext, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import ColorSelect from './ColorSelect';
import DialogTextForm from './DialogTextForm';
import DialogHeadingForm from './DialogHeadingForm';
import { updateNoteDB, createNoteDB, getNotesDB } from '../api';
import { calculateWidth, getRandomPosition } from '../helperFuncs';
import { draggingContext } from '../components/Home';

const NoteDialog = forwardRef((props, ref) => {

    // get dragging context in order to disable dragging while note is being edited / created
    const setDraggingDisabled = useContext(draggingContext).setDraggingDisabled;

    // state --> if new note, set to empty string and color white, else set to current note's values
    const [newHeading, setNewHeading] = useState(props.newNote ? "" : props.note.heading);
    const [newText, setNewText] = useState(props.newNote ? "" : props.note.text);
    const [newColor, setNewColor] = useState(props.newNote ? "#FFFFFF" : props.note.color);

    // add new note --> create new note with values from form, then update DB first,
    // then set state. If state is set first mismatch arises because of lack of Mongo _id
    const handleAddNewNote = async () => {
        if (!newText && !newHeading) return;
        setDraggingDisabled(false);
        const width = calculateWidth(newText);
        const randomPosition = getRandomPosition(width, window);
        const newNote = {
            heading: newHeading,
            text: newText,
            size: [width, 'auto'],
            position: randomPosition,
            color: newColor,
            zIndex: props.notes.length + 1,
        };
        await createNoteDB(newNote);
        const updatedNotes = await getNotesDB();
        props.setNotes(updatedNotes)
        setNewText('')
        setNewHeading('')
        setNewColor('#FFFFFF')
    }

    // update note --> update state with new properties, then update DB
    const handleEditNote = () => {
        setDraggingDisabled(false);
        const newNoteProps = { heading: newHeading, text: newText, color: newColor }
        const updatedNotes = props.notes.map(note =>
            note._id === props.note._id ? { ...note, ...newNoteProps } : note)
        props.setNotes(updatedNotes);
        updateNoteDB(props.note._id, newNoteProps);
    }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className='overlay' />
            <Dialog.Content className='note-dialog' onInteractOutside={() => setDraggingDisabled(false)}>
                <h2 className='new-note-title'>{props.newNote ? 'New Note' : 'Edit Note'}</h2>
                <DialogHeadingForm text={newHeading} setHeading={setNewHeading} />
                <DialogTextForm text={newText} setText={setNewText} />
                <ColorSelect color={newColor} setColor={setNewColor} />
                <div className="buttons">
                    <Dialog.Close onClick={() => setDraggingDisabled(false)} className='btn'>Cancel</Dialog.Close>
                    <Dialog.Close
                        className='btn'
                        onClick={props.newNote ? handleAddNewNote : handleEditNote}>{props.newNote ? 'Add Note' : 'Save'}</Dialog.Close>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    )
})

export default NoteDialog;