document.addEventListener('DOMContentLoaded', function () {
    // Toggle switches
    const toggleSwitches = document.querySelectorAll('.switch input[type="checkbox"]');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function () {
            const toggleText = this.parentElement.querySelector('.toggle-text');
            if (toggleText) {
                toggleText.textContent = this.checked ? 'YES' : 'NO';
            }
        });
    });

    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });

    // Dropdown functionality
    const dropdowns = document.querySelectorAll('.custom-select select');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function () {
            console.log(`Selected ${this.id}: ${this.value}`);
        });
    });

    // Date selector dropdown
    const dateSelector = document.querySelector('.date-selector');
    if (dateSelector) {
        dateSelector.addEventListener('click', function () {
            // This would typically show a date picker
            console.log('Date selector clicked');
        });
    }

    // Apply button
    const applyButton = document.querySelector('.apply-btn');
    if (applyButton) {
        applyButton.addEventListener('click', function () {
            // Collect all form data
            const formData = {
                country: document.getElementById('country').value,
                zone: document.getElementById('zone').value,
                state: document.getElementById('state').value,
                city: document.getElementById('city').value,
                store: document.getElementById('store').value,
                // Add more form fields as needed
            };

            console.log('Form submitted with data:', formData);
            alert('Configuration applied successfully!');
        });
    }

    // Replace placeholder banner with actual image
    // const bannerImg = document.querySelector('.banner-img');
    // if (bannerImg) {
    //     bannerImg.src = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Store%20Control%20Configuration%20after%20%281%29-8cFHtHIeAnle8mCHrTcf049yw1QwOK.png';
    //     bannerImg.onerror = function() {
    //         // If image fails to load, keep the placeholder
    //         this.src = '/placeholder.svg?height=240&width=800';
    //     };
    // }

    // Radio button groups
    const radioGroups = document.querySelectorAll('input[type="radio"]');
    radioGroups.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.checked) {
                console.log(`Selected ${this.id} in group ${this.name}`);
            }
        });
    });

    // Initialize logo images
    // const logoImages = document.querySelectorAll('.logo-img');
    // logoImages.forEach(img => {
    //     // Create a new SynTecSys logo SVG
    //     const svgLogo = createSynTecSysLogo();
    //     img.parentNode.replaceChild(svgLogo, img);
    // });

    // Function to create SynTecSys logo SVG
    // function createSynTecSysLogo() {
    //     const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    //     svg.setAttribute("width", "40");
    //     svg.setAttribute("height", "40");
    //     svg.setAttribute("viewBox", "0 0 40 40");
    //     svg.setAttribute("class", "logo-img");

    //     // Create the logo path
    //     const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    //     path.setAttribute("d", "M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm-5 30V10l15 10-15 10z");
    //     path.setAttribute("fill", "#00c2a8");

    //     svg.appendChild(path);
    //     return svg;
    // }
});