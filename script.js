(function () {
  const STORAGE_KEY = "notes-app-items";

  const btnEl = document.getElementById("btn");
  const appEl = document.getElementById("App");

  // Restore notes
  getNotes().forEach((note) => {
    const noteEl = createNoteEl(note.id, note.content);
    appEl.insertBefore(noteEl, btnEl);
  });

  // Create a note textarea element
  function createNoteEl(id, content = "") {
    const el = document.createElement("textarea");
    el.className = "note";
    el.placeholder = "Empty Note";
    el.value = content;

    // Persist on input (debounced)
    let timer;
    el.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        updateNote(id, el.value);
      }, 150);
    });

    // Delete on double click with confirm
    el.addEventListener("dblclick", () => {
      const doDelete = confirm("Delete this note?");
      if (!doDelete) return;
      deleteNote(id, el);
    });

    return el;
  }

  // Get notes from localStorage
  function getNotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("Failed to parse notes; resetting store.", e);
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  }

  // Save notes to localStorage
  function saveNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  // Add a new note
  function addNote() {
    const notes = getNotes();
    const note = { id: Date.now(), content: "" };
    const el = createNoteEl(note.id, note.content);
    notes.push(note);
    saveNotes(notes);
    appEl.insertBefore(el, btnEl);
    el.focus();
  }

  // Update an existing note
  function updateNote(id, content) {
    const notes = getNotes();
    const target = notes.find(n => n.id === id);
    if (!target) return;
    target.content = content;
    saveNotes(notes);
  }

  // Delete a note
  function deleteNote(id, el) {
    const notes = getNotes().filter(n => n.id !== id);
    saveNotes(notes);
    el.remove();
  }

  // Wire up the add button
  btnEl.addEventListener("click", addNote);
})();