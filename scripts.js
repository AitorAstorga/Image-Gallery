document.addEventListener("DOMContentLoaded", () => {
    const galleryElement = document.getElementById("gallery");

    console.log("Fetching image list...");

    fetch("images.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Image list received:", data);

            // Clear the gallery before adding images
            galleryElement.innerHTML = '';

            // Iterate over the image filenames
            data.forEach(fileName => {
                console.log("Processing file:", fileName);

                // Create an image element and set its source
                const imgElement = document.createElement("img");
                imgElement.src = `images/${fileName}`;
                imgElement.alt = fileName;
                imgElement.classList.add("gallery-image"); // Add a class for styling if needed

                // Append the image to the gallery
                galleryElement.appendChild(imgElement);
            });
        })
        .catch(error => console.error("Error loading images:", error));
});
