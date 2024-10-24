document.getElementById("passengerForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
  
    const formData = new FormData(this);
    const passengerData = {};
  
    // Convert FormData to a JSON object
    formData.forEach((value, key) => {
        passengerData[key] = value;
    });
  
    fetch('/add-passenger', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(passengerData),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Error adding passenger:", error);
    });
  });
  