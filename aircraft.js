document.getElementById("GoButton").addEventListener("click", function () {
    // Get the selected aircraft value
    var selectedAircraft = document.getElementById("Aircraft-Type").value;
  
    // Make an AJAX request to your server
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/get-airline?aircraft=" + selectedAircraft, true);
  
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Parse the JSON response
            var data = JSON.parse(xhr.responseText);
  
            // Display the result on the frontend
            displayAirlines(data);
        } else {
            console.error("Failed to fetch airline information");
        }
    };
  
    xhr.send();
  });
  
  function displayAirlines(data) {
    var resultContainer = document.getElementById("result");
  
    // Clear previous results
    resultContainer.innerHTML = "";
  
    if (data.error) {
        // Display error message
        resultContainer.innerHTML = `<p>${data.error}</p>`;
    } else {
        // Display airline information
        resultContainer.innerHTML = "<h3>Airlines and Information:</h3><ul>";
        data.airlines.forEach(airline => {
            const airlineName = airline.name || 'Unknown Airline';
            const numFlights = airline.num_flights || 0;
            const seatingCapacity = airline.seating_cap || 0;
  
            resultContainer.innerHTML += `
                <li>
                    <strong>${airlineName}</strong>
                    <ul>
                        <li>Number of Flights: ${numFlights}</li>
                        <li>Seating Capacity: ${seatingCapacity}</li>
                    </ul>
                </li>`;
        });
        resultContainer.innerHTML += "</ul>";
    }
  }
  