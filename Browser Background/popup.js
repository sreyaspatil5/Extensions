document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('upload');
  const previewImage = document.getElementById('previewImage');

  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      previewImage.src = e.target.result;
      previewImage.style.display = 'block'; // Display the image preview
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('setBackground').addEventListener('click', function() {
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

  // Retrieve and apply background image if available
  chrome.storage.local.get(['backgroundImage'], (result) => {
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed'; // Keep background fixed

      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      const elementsToAdjust = document.querySelectorAll('.kp-blk, .kp-header, .xpdopen, .exp-outline, .ifM9O');

      elementsToAdjust.forEach(element => {
        if (prefersDarkMode) {
          element.style.backgroundColor = '#222'; // Dark mode background color
          element.style.color = '#fff'; // Light text color
        } else {
          element.style.backgroundColor = '#fff'; // Light mode background color
          element.style.color = '#222'; // Dark text color
        }
      });

      console.log('Background image set successfully.');
    
  });
});
