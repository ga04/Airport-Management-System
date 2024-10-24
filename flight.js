document.getElementById("addFlightButton").addEventListener("click", function () {
  const flightId = document.getElementById("flightId").value;
  const departure = document.getElementById("departureCity").value;
  const destination = document.getElementById("destinationCity").value;
  const airlineId = document.getElementById("airlineId").value;
  const departureDate = document.getElementById("departureDate").value;
  const departureTime = document.getElementById("departureTime").value;
  const intervals = document.getElementById("intervals").value;
  const cost=document.getElementById("journeyHours").value;

  // Create an object with the flight data
  const data = {
      flight_id: flightId,
      departure: departure,
      destination: destination,
      airline_id: airlineId,
      date: departureDate,
      time: departureTime,
      cost:cost,
      intervals: intervals
  };

  // Log data before sending
  console.log("Sending data to server:", data);

  // Send a POST request to the server
  fetch('/add-flight', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
      .then(response => {
          if (response.ok) {
              return response.text();
          } else {
              throw new Error('Failed to add flight');
          }
      })
      .then(responseText => {
          // Log server response
          console.log("Server response:", responseText);
          alert("Flight and details added successfully");
          alert(responseText);
          
          // Optionally, clear input fields
          document.getElementById("flightId").value = "";
          document.getElementById("departureCity").value = "";
          document.getElementById("destinationCity").value = "";
      })
      .catch(error => {
          console.error(error);
          alert('Failed to add flight');
      });
});

  document.getElementById("deleteFlightButton").addEventListener("click", function () {
    const flightId = document.getElementById("flightId").value;
  
    // Create a data object to send to the server
    const data = {
      flightId: flightId
    };
  
    // Send a POST request to the server to delete the flight
    fetch('/delete-flight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        console.log("Flight Deleted")
      } else {
        throw new Error('Failed to delete flight');
      }
    })
    .then(responseText => {
      alert(responseText);
      // Optionally, clear input fields
      document.getElementById("flightId").value = "";
    })
    .catch(error => {
      console.error(error);
      alert('Failed to delete flight');
    });
  });
  