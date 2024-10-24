// employee-form.js
document.getElementById("employeeForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
  
    const formData = new FormData(this);
  
    fetch('/add-employee', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response (e.g., show a success message)
        console.log(data);
      })
      .catch(error => {
        console.error("Error adding employee:", error);
      });
  });
  