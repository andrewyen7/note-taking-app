// Notes Module
const Notes = (() => {
    // API URL
    const API_URL = 'http://localhost:5000/api';
    
    // DOM Elements
    const notesContainer = document.getElementById('notes-container');
    const addNoteBtn = document.getElementById('add-note-btn');
    const noteForm = document.getElementById('note-form');
    const saveNoteForm = document.getElementById('save-note-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const formTitle = document.getElementById('form-title');
    const noteIdInput = document.getElementById('note-id');
    const noteTitleInput = document.getElementById('note-title');
    const noteContentInput = document.getElementById('note-content');
    
    // State
    let notes = [];
    let isEditing = false;
    
    // Event Listeners
    function initEventListeners() {
        // Add note button
        addNoteBtn.addEventListener('click', showAddNoteForm);
        
        // Cancel button
        cancelBtn.addEventListener('click', hideNoteForm);
        
        // Save note form
        saveNoteForm.addEventListener('submit', handleSaveNote);
    }
    
    // Load all notes
    async function loadNotes() {
        if (!Auth.getToken()) return;
        
        try {
            // Show loading state
            notesContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading notes...</div>';
            
            const response = await fetch(`${API_URL}/notes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to load notes');
            }
            
            notes = data.data;
            renderNotes();
            
        } catch (error) {
            console.error('Error loading notes:', error);
            Auth.showAlert('Failed to load notes', 'error');
            notesContainer.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Failed to load notes. Please try again.</div>';
        }
    }
    
    // Render notes to DOM
    function renderNotes() {
        notesContainer.innerHTML = '';
        
        if (notes.length === 0) {
            notesContainer.innerHTML = `
                <div class="no-notes">
                    <i class="fas fa-sticky-note fa-3x"></i>
                    <p>No notes yet. Click "Add Note" to create one.</p>
                </div>
            `;
            return;
        }
        
        // Sort notes by updated date (newest first)
        const sortedNotes = [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        
        sortedNotes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'note-card';
            
            // Format the date
            const updatedDate = new Date(note.updatedAt);
            const formattedDate = updatedDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            noteCard.innerHTML = `
                <h3>${escapeHtml(note.title)}</h3>
                <p>${formatContent(note.content)}</p>
                <div class="note-meta">
                    <span class="note-date"><i class="far fa-clock"></i> ${formattedDate}</span>
                </div>
                <div class="note-actions">
                    <button class="edit-btn" data-id="${note._id}" title="Edit Note">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" data-id="${note._id}" title="Delete Note">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            notesContainer.appendChild(noteCard);
            
            // Add event listeners to buttons
            noteCard.querySelector('.edit-btn').addEventListener('click', () => editNote(note._id));
            noteCard.querySelector('.delete-btn').addEventListener('click', () => deleteNote(note._id));
        });
    }
    
    // Format content for display
    function formatContent(content) {
        // Truncate content if it's too long
        const maxLength = 150;
        let formattedContent = escapeHtml(content);
        
        if (content.length > maxLength) {
            formattedContent = formattedContent.substring(0, maxLength) + '...';
        }
        
        // Replace newlines with <br> tags
        return formattedContent.replace(/\n/g, '<br>');
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Show add note form
    function showAddNoteForm() {
        isEditing = false;
        formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Add Note';
        noteIdInput.value = '';
        noteTitleInput.value = '';
        noteContentInput.value = '';
        noteForm.classList.remove('hidden');
        
        // Focus on title input
        setTimeout(() => noteTitleInput.focus(), 100);
        
        // Scroll to form
        noteForm.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show edit note form
    function editNote(id) {
        const note = notes.find(note => note._id === id);
        
        if (!note) return;
        
        isEditing = true;
        formTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Note';
        noteIdInput.value = note._id;
        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
        noteForm.classList.remove('hidden');
        
        // Focus on title input
        setTimeout(() => noteTitleInput.focus(), 100);
        
        // Scroll to form
        noteForm.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Hide note form
    function hideNoteForm() {
        noteForm.classList.add('hidden');
    }
    
    // Handle save note form submission
    async function handleSaveNote(e) {
        e.preventDefault();
        
        const noteId = noteIdInput.value;
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();
        
        if (!title || !content) {
            Auth.showAlert('Please fill in all fields', 'error');
            return;
        }
        
        // Show loading state on button
        const submitBtn = saveNoteForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;
        
        try {
            if (isEditing) {
                await updateNote(noteId, title, content);
            } else {
                await createNote(title, content);
            }
            
            hideNoteForm();
            
        } catch (error) {
            console.error('Error saving note:', error);
            Auth.showAlert(error.message, 'error');
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    }
    
    // Create a new note
    async function createNote(title, content) {
        try {
            const response = await fetch(`${API_URL}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({ title, content })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create note');
            }
            
            Auth.showAlert('Note created successfully', 'success');
            await loadNotes();
            
        } catch (error) {
            console.error('Error creating note:', error);
            throw error;
        }
    }
    
    // Update an existing note
    async function updateNote(id, title, content) {
        try {
            const response = await fetch(`${API_URL}/notes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({ title, content })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update note');
            }
            
            Auth.showAlert('Note updated successfully', 'success');
            await loadNotes();
            
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        }
    }
    
    // Delete a note
    async function deleteNote(id) {
        if (!confirm('Are you sure you want to delete this note?')) return;
        
        try {
            // Find the note card and add a deleting class for visual feedback
            const noteCard = document.querySelector(`.note-card .delete-btn[data-id="${id}"]`).closest('.note-card');
            noteCard.classList.add('deleting');
            
            const response = await fetch(`${API_URL}/notes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete note');
            }
            
            Auth.showAlert('Note deleted successfully', 'success');
            await loadNotes();
            
        } catch (error) {
            console.error('Error deleting note:', error);
            Auth.showAlert('Failed to delete note', 'error');
        }
    }
    
    // Initialize notes module
    function init() {
        initEventListeners();
        if (Auth.checkAuth()) {
            loadNotes();
        }
    }
    
    // Public methods
    return {
        init,
        loadNotes
    };
})();

// Initialize notes module when DOM is loaded
document.addEventListener('DOMContentLoaded', Notes.init);
