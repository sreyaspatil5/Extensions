chrome.storage.local.get(['backgroundImage'], (result) => {
  if (result.backgroundImage) {
    console.log('Background image retrieved:', result.backgroundImage);

    // Apply background image to the entire body
    document.body.style.backgroundImage = `url(${result.backgroundImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed'; // Keep background fixed

    // Detect user's browser theme color preference
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Select elements to adjust based on the detected mode
    const elementsToAdjust = document.querySelectorAll('.kp-blk, .kp-header, .xpdopen, .exp-outline, .ifM9O');

    // Apply background styles based on mode
    elementsToAdjust.forEach(element => {
      if (prefersDarkMode) {
        // Dark mode background
        element.style.backgroundColor = '#222'; // Example dark background color
        element.style.color = '#fff'; // Example light text color
      } else {
        // Light mode background (default)
        element.style.backgroundColor = '#fff'; // Example light background color
        element.style.color = '#222'; // Example dark text color
      }
    });

    console.log('Background image set successfully.');
  } else {
    console.log('No background image found in storage.');
  }
});
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      const previewImage = document.getElementById('previewImage');
      previewImage.src = e.target.result;
      previewImage.style.display = 'block'; // Display the image preview
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('setBackground').addEventListener('click', function() {
    const fileInput = document.getElementById('upload');
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const result = e.target.result;
        console.log('Image data URL:', result);
        chrome.storage.local.set({ backgroundImage: result }, () => {
          console.log('Background image set in storage');
          alert('Background image set!');
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.reload(tabs[0].id); // Reload the current active tab
          });
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file.');
    }
  });

  document.getElementById('closePopup').addEventListener('click', function() {
    window.close(); // Close the popup window when close button is clicked
  });
});