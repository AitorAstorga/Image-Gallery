document.addEventListener("DOMContentLoaded", () => {
    const galleryElement = document.getElementById("gallery");
    const modal = document.getElementById("modal");
    const modalImage = document.getElementById("modalImage");
    const closeBtn = document.querySelector(".close");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const downloadBtn = document.getElementById("downloadBtn");
    const modalCaption = document.getElementById("modalCaption");

    let images = [];
    let currentIndex = 0;
    let scale = 1;
    const scaleFactor = 2; // Factor by which the image will be zoomed
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentTranslateX = 0;
    let currentTranslateY = 0;
    let prevTranslateX = 0;
    let prevTranslateY = 0;

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
            images = data; // Store the image list

            // Clear the gallery before adding images
            galleryElement.innerHTML = '';

            // Iterate over the image filenames
            data.forEach((fileName, index) => {
                console.log("Processing file:", fileName);

                // Create an image element and set its source
                const imgElement = document.createElement("img");
                imgElement.src = `images/${fileName}`;
                imgElement.alt = `Image ${index + 1}`;
                imgElement.classList.add("gallery-image"); // Add a class for styling if needed
                imgElement.dataset.index = index; // Store index for navigation
                imgElement.loading = "lazy"; // Lazy Loading

                // Add click event to open modal
                imgElement.addEventListener("click", () => {
                    openModal(index);
                });

                // Append the image to the gallery
                galleryElement.appendChild(imgElement);
            });
        })
        .catch(error => console.error("Error loading images:", error));

    // Function to open modal
    function openModal(index) {
        currentIndex = index;
        modal.style.display = "block";
        modal.setAttribute("aria-hidden", "false");
        updateModalImage();
        resetZoom(); // Ensure zoom is reset when opening a new image
        trapFocus();
    }

    // Function to close modal
    function closeModal() {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        releaseFocus();
    }

    // Function to update modal image
    function updateModalImage() {
        const fileName = images[currentIndex];
        modalImage.classList.remove("loaded", "zoomed");
        modalImage.src = `images/${fileName}`;
        modalImage.alt = `Image ${currentIndex + 1}`;
        downloadBtn.href = modalImage.src;
        modalCaption.textContent = `Image ${currentIndex + 1} of ${images.length}`;
        preloadImage((currentIndex + 1) % images.length);
        preloadImage((currentIndex - 1 + images.length) % images.length);
    }

    // Function to show next image
    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateModalImage();
        resetZoom();
    }

    // Function to show previous image
    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateModalImage();
        resetZoom();
    }

    // Function to reset zoom and panning
    function resetZoom() {
        scale = 1;
        currentTranslateX = 0;
        currentTranslateY = 0;
        prevTranslateX = 0;
        prevTranslateY = 0;
        modalImage.style.transform = `scale(${scale}) translate(0px, 0px)`;
        modalImage.style.transformOrigin = `center center`;
        modalImage.classList.remove("zoomed");
    }

    // Function to toggle zoom
    function toggleZoom(event) {
        if (scale === 1) {
            // Zoom in
            const rect = modalImage.getBoundingClientRect();
            const clickX = event.clientX - rect.left; // X coordinate within the image
            const clickY = event.clientY - rect.top;  // Y coordinate within the image

            const xPercent = (clickX / rect.width) * 100;
            const yPercent = (clickY / rect.height) * 100;

            scale = scaleFactor;
            modalImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
            modalImage.style.transform = `scale(${scale}) translate(${currentTranslateX}px, ${currentTranslateY}px)`;
            modalImage.classList.add("zoomed");
        } else {
            // Zoom out
            scale = 1;
            modalImage.style.transform = `scale(${scale}) translate(0px, 0px)`;
            modalImage.style.transformOrigin = `center center`;
            modalImage.classList.remove("zoomed");
            // Reset translation values
            currentTranslateX = 0;
            currentTranslateY = 0;
            prevTranslateX = 0;
            prevTranslateY = 0;
        }
    }


    // Function to preload images
    function preloadImage(index) {
        const img = new Image();
        img.src = `images/${images[index]}`;
    }

    // Event listeners
    closeBtn.addEventListener("click", closeModal);
    nextBtn.addEventListener("click", showNext);
    prevBtn.addEventListener("click", showPrev);
    modalImage.addEventListener("click", toggleZoom); // Add click-to-zoom

    // Close modal when clicking outside the image
    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    window.addEventListener("keydown", (event) => {
        if (modal.style.display === "block") {
            switch(event.key) {
                case "ArrowRight":
                    showNext();
                    break;
                case "ArrowLeft":
                    showPrev();
                    break;
                case "Escape":
                    closeModal();
                    break;
                default:
                    break;
            }
        }
    });

    // Touch swipe for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    modalImage.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    modalImage.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
    });

    function handleGesture() {
        if (touchEndX < touchStartX - 50) { // Swipe left
            showNext();
        }
        if (touchEndX > touchStartX + 50) { // Swipe right
            showPrev();
        }
    }

    // Accessibility: Trap focus within modal
    let focusableElementsString = 'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';
    let focusableElements;
    let firstFocusableElement;
    let lastFocusableElement;

    function trapFocus() {
        focusableElements = modal.querySelectorAll(focusableElementsString);
        if (focusableElements.length === 0) return;
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];
        firstFocusableElement.focus();

        modal.addEventListener('keydown', handleFocus);
    }

    function handleFocus(e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstFocusableElement) {
                e.preventDefault();
                lastFocusableElement.focus();
            }
        } else { // Tab
            if (document.activeElement === lastFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
            }
        }
    }

    function releaseFocus() {
        modal.removeEventListener('keydown', handleFocus);
    }

    // Smooth image loading
    modalImage.addEventListener("load", () => {
        modalImage.classList.add("loaded");
    });

    /* Panning Functionality */

    // Mouse Events
    modalImage.addEventListener("mousedown", dragStart);
    modalImage.addEventListener("mouseup", dragEnd);
    modalImage.addEventListener("mouseleave", dragEnd);
    modalImage.addEventListener("mousemove", dragAction);

    // Touch Events for Panning
    modalImage.addEventListener("touchstart", dragStart, { passive: false });
    modalImage.addEventListener("touchend", dragEnd);
    modalImage.addEventListener("touchmove", dragAction, { passive: false });

    function dragStart(event) {
        if (scale === 1) return; // Do not allow panning if not zoomed in

        isDragging = true;
        modalImage.classList.add("grabbing");

        if (event.type === "touchstart") {
            startX = event.touches[0].clientX - prevTranslateX;
            startY = event.touches[0].clientY - prevTranslateY;
        } else {
            event.preventDefault(); // Prevent image dragging
            startX = event.clientX - prevTranslateX;
            startY = event.clientY - prevTranslateY;
        }
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        modalImage.classList.remove("grabbing");
        prevTranslateX = currentTranslateX;
        prevTranslateY = currentTranslateY;
        checkBounds();
    }

    function dragAction(event) {
        if (!isDragging) return;
        event.preventDefault(); // Prevent scrolling on touch devices

        let currentX, currentY;

        if (event.type === "touchmove") {
            currentX = event.touches[0].clientX - startX;
            currentY = event.touches[0].clientY - startY;
        } else {
            currentX = event.clientX - startX;
            currentY = event.clientY - startY;
        }

        currentTranslateX = currentX;
        currentTranslateY = currentY;

        modalImage.style.transform = `scale(${scale}) translate(${currentTranslateX}px, ${currentTranslateY}px)`;
    }

    // Ensure the image does not go out of bounds
    function checkBounds() {
        const rect = modalImage.getBoundingClientRect();
        const container = modal.querySelector(".image-container").getBoundingClientRect();

        let maxTranslateX = (rect.width - container.width) / 2;
        let maxTranslateY = (rect.height - container.height) / 2;

        // If the image is smaller than the container, no translation is needed
        if (maxTranslateX < 0) maxTranslateX = 0;
        if (maxTranslateY < 0) maxTranslateY = 0;

        // Clamp the translation values
        if (currentTranslateX > maxTranslateX) currentTranslateX = maxTranslateX;
        if (currentTranslateX < -maxTranslateX) currentTranslateX = -maxTranslateX;
        if (currentTranslateY > maxTranslateY) currentTranslateY = maxTranslateY;
        if (currentTranslateY < -maxTranslateY) currentTranslateY = -maxTranslateY;

        // Apply the clamped values
        modalImage.style.transform = `scale(${scale}) translate(${currentTranslateX}px, ${currentTranslateY}px)`;
        prevTranslateX = currentTranslateX;
        prevTranslateY = currentTranslateY;
    }
});
