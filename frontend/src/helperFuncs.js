export const getStyles = (notes, note, search) => {

    const filteredNotes = notes.reduce((filtered, note) => {
        if (note.text.toLowerCase().includes(search) || note.heading.toLowerCase().includes(search)) {
            filtered.push(note._id);
        } return filtered;
    }, []);

    const isSearched = filteredNotes.includes(note._id);
    const noteStyle = {
        border: isSearched ? ".5px solid black" : ".5px solid #ecf0f1",
        boxShadow: isSearched ? "4px 4px 0px 0px black" : "4px 4px 0px 0px #ecf0f1",
        color: isSearched ? "black" : "#ecf0f1",
        zIndex: isSearched ? note.zIndex : 0,
    };
    const noteTopStyle = {
        borderBottom: isSearched ? ".5px solid black" : ".5px solid #ecf0f1",
        backgroundColor: isSearched ? note.color : note.color + "25",
    }
    return { noteStyle, noteTopStyle };
}

export const calculateWidth = (text) => {
    const words = text.split(" ").length;
    if (words < 30) {
        return 200;
    } else if (words < 75) {
        return 300;
    } else if (words < 125) {
        return 400
    }
    return 600;
}

export const getRandomPosition = (width, window) => {
    const X = Math.random() * ((window.innerWidth - width) - 30) + 30;
    const Y = Math.random() * (window.innerHeight - 400) + 200;
    return [X, Y];
}

const getNoteAndZindex = (id, notes) => {
    const noteToMove = notes.find(note => note._id === id);
    const initialZindex = noteToMove.zIndex;
    return { noteToMove, initialZindex };
}

export const sendToBack = (id, notes) => {
    var updatedNotes = notes;
    const { noteToMove, initialZindex } = getNoteAndZindex(id, notes);
    for (let i = 0; i < updatedNotes.length; i++) {
        if (updatedNotes[i].zIndex < initialZindex) {
            updatedNotes[i].zIndex += 1;
        }
    }
    noteToMove.zIndex = 1;
    return updatedNotes;
}

export const bringToFront = (id, notes) => {
    var updatedNotes = notes;
    const { noteToMove, initialZindex } = getNoteAndZindex(id, notes);
    for (let i = 0; i < updatedNotes.length; i++) {
        if (updatedNotes[i].zIndex > initialZindex) {
            updatedNotes[i].zIndex -= 1;
        }
    }
    noteToMove.zIndex = updatedNotes.length;
    return updatedNotes;
}

export const sendNoteToFrontOrBack = (id, notes, toFront) => {
    const noteToMove = notes.find(note => note._id === id);
    const remainingNotes = notes.filter(note => note._id !== id);
    return toFront ? [...remainingNotes, noteToMove] : [noteToMove, ...remainingNotes]
}