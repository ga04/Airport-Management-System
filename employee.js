
   document.getElementById("viewButton").addEventListener("click", function () {
    const employeeId = document.getElementById("employeeId").value;

    console.log("Fetching employee data for ID:", employeeId);

    fetch(`/get-employee/${employeeId}`)
      .then(response => response.json())
      .then(data => {
        console.log("Received data:", data);

        // Handle the data and update the HTML with the retrieved employee details
        document.getElementById("employeeName").textContent = `Employee Name: ${data.first_name+" "+data.last_name}`;
        document.getElementById("employeePosition").textContent = `Position: ${data.position}`;
        document.getElementById("employeeAirlineId").textContent = `Airline ID: ${data.airline_id}`;
        document.getElementById("employeeSalary").textContent = `Salary: ${data.salary}`;
          // Show the result container
          const resultContainer = document.getElementById('result');
          resultContainer.style.display = 'block';

          // Animate the employee card
          const employeeCard = document.getElementById('employeeCard');
          setTimeout(function() {
            employeeCard.style.opacity = '1';
            employeeCard.style.transform = 'translateY(0)';
          }, 100);
      })
      
      .catch(error => {
        console.error("Error fetching employee data:", error);
      });
  });
