document.getElementById("getInfoButton").addEventListener("click", function () {
    // Get the selected airline value
    var selectedAirline = document.getElementById("airlineSelect").value;
  
    // Make an AJAX request to your server
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/get-financial-info?airline=" + selectedAirline, true);
  
    xhr.onload = function () {
      if (xhr.status === 200) {
        // Parse the JSON response
        var data = JSON.parse(xhr.responseText);
  
        // Update the frontend with the obtained information
        document.getElementById("airlineAccountNo").innerHTML = "<strong>Airline Account No:</strong> " + data.airlineAccountNo;
        document.getElementById("employeeCount").innerHTML = "<strong>Employee Count:</strong> " + data.employeeCount;
        document.getElementById("passengerCount").innerHTML = "<strong>Tickets Booked:</strong> " + data.passengerCount;
        document.getElementById("totalSalary").innerHTML = "<strong>Total Salary:</strong> " + data.totalSalary;
        document.getElementById("totalTicketAmount").innerHTML = "<strong>Total Ticket Amount:</strong> " + data.totalTicketAmount;
        document.getElementById("Profit").innerHTML = "<strong>Total Profit Generated:</strong> " + data.Profit;
      } else {
        console.error("Failed to fetch financial information");
      }
    };
  
    xhr.send();
  });
  