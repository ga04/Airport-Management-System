/*document.getElementById("Submit").addEventListener("click", function () {
  const ticketId = document.getElementById("ticketId").value;

  fetch(`/get-ticket-info?ticketId=${ticketId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Handle the data and update the HTML with the retrieved ticket details
      document.getElementById("passengerName").textContent = data.Passenger_FirstName;
      document.getElementById("dob").textContent = data.Date_of_Birth;
      document.getElementById("flightId").textContent = data.Flight_ID;
      document.getElementById("airlineName").textContent = data.Airline_Name;
      document.getElementById("departure").textContent = data.Departure;
      document.getElementById("destination").textContent = data.Destination;
      document.getElementById("date").textContent = data.Ticket_Date;
      document.getElementById("Traveldate").textContent=data.Travel_Date;
      document.getElementById("loyaltyType").textContent = data.Loyalty_Type;
      document.getElementById("status").textContent=data.Status_Type;
    })
    .catch(error => {
      console.error("Error fetching ticket information:", error);
      // Display an error message to the user
      alert("Error fetching ticket information. Please try again.");
    });
});


*/

document.getElementById("Submit").addEventListener("click", function () {
  const ticketId = document.getElementById("ticketId").value;

  fetch(`/get-ticket-info?ticketId=${ticketId}`)
    .then(response => response.json())
    .then(data => {
      console.log("Received data: ", data);
      document.getElementById("passengerName").textContent = `Passenger Name: ${data.Passenger_FirstName}`;
      document.getElementById("dob").textContent = data.Date_of_Birth;
      document.getElementById("flightId").textContent = data.Flight_ID;
      document.getElementById("airlineName").textContent = data.Airline_Name;
      document.getElementById("departure").textContent = data.Departure;
      document.getElementById("destination").textContent = data.Destination;
      document.getElementById("date").textContent = data.Ticket_Date;
      document.getElementById("Traveldate").textContent = data.Travel_Date;
      document.getElementById("loyaltyType").textContent = data.Loyalty_Type;
      document.getElementById("status").textContent = data.Status_Type; 

      const resultContainer = document.getElementById('result');
      resultContainer.style.display = 'block';

       // Animate the employee card
       const passengerCard = document.getElementById('passengerCard');
       setTimeout(function() {
         passengerCard.style.opacity = '1';
         passengerCard.style.transform = 'translateY(0)';
       }, 100);
    })
    .catch(error => {
      console.error("Error fetching ticket information:", error);
      displayErrorMessage();
    });
});