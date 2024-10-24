document.querySelector('.display-button').addEventListener('click', async () => {
    try {
      // Retrieve input values
      const airline = document.getElementById('airlineName').value;
      const date = document.querySelector('.date-input input').value;
      const time = document.getElementById('time-dropdown').value;
  
      // Fetch flight information from the server
      const response = await fetch(`/search?airline=${airline}&date=${date}&time=${time}`);
      const data = await response.json();
  
      // Display flight information on the webpage
      const value = document.querySelector('.values');
      value.innerHTML = `
        
        <table>
          
          ${data.map(info => `
            <tr>
              <td>${info.name}</td>
              <td>${info.aircraft_type}</td>
              <td>${info.flight_id}</td>
              <td>${info.departure}</td>
            </tr>
          `).join('')}
        </table>
      `;
    
    } catch (error) {
      console.error('Error fetching and displaying data:', error);
    }
  });
  
  // Function to toggle Arrival and Departure text and redirect to FlightDeparture.html
  function toggleArrivalDeparture() {
    var isChecked = document.getElementById('toggleArrivalDeparture').checked;
  
    if (isChecked) {
      window.location.href = 'FlightDeparture.html';
    }
  }
  