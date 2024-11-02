document.addEventListener("DOMContentLoaded", () => {
    const galleryElement = document.getElementById("gallery");

    console.log("Fetching directory listing...");

    fetch("images/")
        .then(response => {
            console.log("Response received:", response);
            return response.text();
        })
        .then(data => {
            console.log("Directory listing data:", data);

            // Parse the response as HTML
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, "text/html");

            // Check if parsing worked
            console.log("Parsed HTML Document:", htmlDoc);

            // Select all links within the directory listing
            const fileLinks = htmlDoc.querySelectorAll("a");

            // Log the found links
            console.log("File links found:", fileLinks);

            // Clear the gallery and add images
            fileLinks.forEach(link => {
                let fileName = link.getAttribute("href");
                console.log("Processing file:", fileName);

                // Only include files that end with image extensions (including those with .preview)
                if (fileName.match(/\.(jpg|jpeg|png|gif)(\.preview)?$/i)) {
                    console.log("Adding image file to gallery:", fileName);

                    if (!fileName.startsWith("images/")) {
                        fileName = `${fileName}`;
                    }

                    // Create an image element and set its source
                    const imgElement = document.createElement("img");
                    imgElement.src = fileName;
                    imgElement.alt = fileName;

                    // Append the image to the gallery
                    galleryElement.appendChild(imgElement);
                } else {
                    console.log("Skipping non-image file:", fileName);
                }
            });
        })
        .catch(error => console.error("Error loading images:", error));
});
