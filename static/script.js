document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("guestbook-form");
    const entriesContainer = document.getElementById("entries");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const author = document.getElementById("author").value;
        const message = document.getElementById("message").value;

        if (author && message) {
            const entry = {
                author: author,
                message: message,
                timestamp: new Date().toISOString()
            };

            fetch("/add_entry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(entry)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    addEntryToDOM(entry, data.index);
                    form.reset();
                } else {
                    alert("Failed to add entry.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        }
    });

    function addEntryToDOM(entry, index) {
        const entryElement = document.createElement("div");
        entryElement.classList.add("entry");

        const authorElement = document.createElement("div");
        authorElement.classList.add("author");
        authorElement.textContent = entry.author;

        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = entry.message;

        const timestampElement = document.createElement("div");
        timestampElement.classList.add("timestamp");
        timestampElement.textContent = new Date(entry.timestamp).toLocaleString();

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function() {
            fetch(`/entries/${index}`, {
                method: "DELETE"
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    entryElement.remove();
                } else {
                    alert("Failed to delete entry.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        });

        entryElement.appendChild(authorElement);
        entryElement.appendChild(messageElement);
        entryElement.appendChild(timestampElement);
        entryElement.appendChild(deleteButton);

        entriesContainer.appendChild(entryElement);
    }

    fetch("/entries")
    .then(response => response.json())
    .then(data => {
        data.entries.forEach((entry, index) => addEntryToDOM(entry, index));
    })
    .catch(error => {
        console.error("Error:", error);
    });
});
