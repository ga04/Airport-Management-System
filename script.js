const loyaltyTypeDropdown = document.getElementById("loyaltyType");
const membershipFeesInput = document.getElementById("membershipfees");

// Add an event listener to the loyalty dropdown
loyaltyTypeDropdown.addEventListener("change", function () {
  const selectedLoyaltyType = loyaltyTypeDropdown.value;

  // Calculate the membership fees based on the selected loyalty type
  let membershipFees = 0;
  const selectedAirline = document.getElementById("loyaltyAirline").value;

  if (selectedLoyaltyType.includes("Availed")) {
    // Set fees to 0 for availed membership types
    membershipFees = 0;
  } else {
    // Update membership fees based on the selected airline
    switch (selectedAirline) {
      case "Air India":
        if (selectedLoyaltyType === "Gold") {
          membershipFees = 3500;
        } else if (selectedLoyaltyType === "Silver") {
          membershipFees = 7500;
        } else if (selectedLoyaltyType === "Platinum") {
          membershipFees = 10000;
        }
        break;
      case "Qatar Airways":
        if (selectedLoyaltyType === "Gold") {
          membershipFees = 4000;
        } else if (selectedLoyaltyType === "Silver") {
          membershipFees = 8000;
        } else if (selectedLoyaltyType === "Platinum") {
          membershipFees = 11000;
        }
        break;
      case "Emirates":
        if (selectedLoyaltyType === "Gold") {
          membershipFees = 4500;
        } else if (selectedLoyaltyType === "Silver") {
          membershipFees = 8500;
        } else if (selectedLoyaltyType === "Platinum") {
          membershipFees = 12000;
        }
        break;
      default:
        membershipFees = 0; // Default to 0 if the airline is not recognized
    }
  }

  // Update the membership fees input field
  membershipFeesInput.value = membershipFees;

  // You can also update the final price here if needed
});

document.getElementById("fetchButton").addEventListener("click", function () {
    const departure = document.getElementById("departure").value;
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("date").value;
  
    fetch(`/get-airline-info?departure=${departure}&destination=${destination}&date=${date}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const resultContainer = document.getElementById("result");
        resultContainer.innerHTML = ''; // Clear previous results
  
        if (data.length === 0) {
          resultContainer.textContent = "No matching flights found.";
        } else {
          for (const flight of data) {
            const flightInfo = document.createElement('div');
            flightInfo.classList.add('flight-info');
  
            const selectButton = document.createElement('button');
            selectButton.textContent = 'Select';
            selectButton.type='button';
            selectButton.classList.add('select-button');
            selectButton.addEventListener('click', () => handleFlightSelection(flight));
  
            const airlineName = document.createElement('p');
            airlineName.textContent = `Airline Name: ${flight.name}`;
  
            const flightId = document.createElement('p');
            flightId.textContent = `Flight ID: ${flight.flight_id}`;
  
            const flightTime = document.createElement('p');
            flightTime.textContent = `Flight Time: ${flight.time}`;
  
            flightInfo.appendChild(selectButton);
            flightInfo.appendChild(airlineName);
            flightInfo.appendChild(flightId);
            flightInfo.appendChild(flightTime);
  
            resultContainer.appendChild(flightInfo);
          }
        }
      })
      .catch(error => {
        console.error("Error fetching airline information:", error);
        const resultContainer = document.getElementById("result");
        resultContainer.innerHTML = '<strong style="font-size: 24px;">Airline information not found.</strong>';
      });
  });
  
  function displayPopup(message) {
    alert(message);
  }
  
  function handleFlightSelection(selectedFlight) {
    const loyaltyAirline = document.getElementById('loyaltyAirline');
    const selectedAirline = selectedFlight.name;
  
    // List of eligible airlines
    const eligibleAirlines = ["Air India", "Emirates", "Qatar Airways"];
  
    if (eligibleAirlines.includes(selectedAirline)) {
      loyaltyAirline.value = selectedAirline;
  
      const departure = document.getElementById("departure").value;
        const destination = document.getElementById("destination").value;
  
        
        fetch(`/get-flight-cost?departure=${departure}&destination=${destination}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const basePriceInput = document.getElementById("ticketPrice");
                basePriceInput.value = `${data.Cost}`;
            })
            .catch(error => {
                console.error("Error fetching flight cost:", error);
                const finalPriceInput = document.getElementById("ticketPrice");
                finalPriceInput.value = "Error fetching flight cost.";
            });

            // Send the selected flight's airline name and flight ID to the server
        document.getElementById("airlineNameInput").value = selectedAirline;
        document.getElementById("flightIdInput").value = selectedFlight.flight_id;
  
    fetch('/book-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ airlineName: selectedAirline, flightId }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Handle the response from the server (if needed)
        console.log(data);
      })
      .catch(error => {
        console.error("Error sending data to the server:", error);
      });
    } else {
        const resContainer = document.getElementById("res");
        resContainer.innerHTML = '<strong style="font-size: 28px;">Membership not available for this airline.</strong>';
  
        
        const departure = document.getElementById("departure").value;
        const destination = document.getElementById("destination").value;
  
         // Set the selected flight's airline name and flight ID
    document.getElementById("airlineNameInput").value = selectedAirline;
    document.getElementById("flightIdInput").value = selectedFlight.flight_id;
    
        fetch(`/get-cost?departure=${departure}&destination=${destination}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const finalPriceInput = document.getElementById("ticketPrice");
                finalPriceInput.value = `${data.Cost}`;
  
                const priceInput=document.getElementById("finalPrice");
                priceInput.value=`${data.Cost}`;
            })
            .catch(error => {
                console.error("Error fetching flight cost:", error);
                const finalPriceInput = document.getElementById("ticketPrice");
                finalPriceInput.value = "Error fetching flight cost.";
            });
    }
  }
  
   
  // Add an event listener to the "View Updated Fare" button
// Add an event listener to the "View Updated Fare" button
document.getElementById("updatedPrice").addEventListener("click", function () {
  const basePriceInput = document.getElementById("ticketPrice");
  const membershipFeesInput = document.getElementById("membershipfees");
  const finalPriceInput = document.getElementById("finalPrice");

  // Get the base price, membership fees, and selected membership type
  const basePrice = parseFloat(basePriceInput.value) || 0;
  const membershipFees = parseFloat(membershipFeesInput.value) || 0;
  const selectedMembershipType = document.getElementById("loyaltyType").value;

  // Get the selected flight's airline
  const selectedAirline = document.getElementById("loyaltyAirline").value;

  // Calculate the total fare by adding the base price and membership fees
  let totalFare = basePrice + membershipFees;

  // Check if the selected airline is "Air India" and apply discounts accordingly
  if (selectedAirline === "Air India") {
    if (selectedMembershipType === "Gold" || selectedMembershipType === "Availed-Gold") {
      totalFare *= 0.95; // 5% discount
    } else if (selectedMembershipType === "Silver" || selectedMembershipType === "Availed-Silver") {
      totalFare *= 0.90; // 10% discount
    } else if (selectedMembershipType === "Platinum" || selectedMembershipType === "Availed-Platinum") {
      totalFare *= 0.85; // 15% discount
    }
  } else if (selectedAirline === "Emirates") {
    // Apply discounts for "Emirates" airline
    if (selectedMembershipType === "Gold" || selectedMembershipType === "Availed-Gold") {
      totalFare *= 0.94; // 6% discount
    } else if (selectedMembershipType === "Silver" || selectedMembershipType === "Availed-Silver") {
      totalFare *= 0.89; // 11% discount
    } else if (selectedMembershipType === "Platinum" || selectedMembershipType === "Availed-Platinum") {
      totalFare *= 0.84; // 16% discount
    }
  } else if (selectedAirline === "Qatar Airways") {
    // Apply discounts for "Qatar Airways" airline
    if (selectedMembershipType === "Gold" || selectedMembershipType === "Availed-Gold") {
      totalFare *= 0.94; // 6% discount
    } else if (selectedMembershipType === "Silver" || selectedMembershipType === "Availed-Silver") {
      totalFare *= 0.88; // 12% discount
    } else if (selectedMembershipType === "Platinum" || selectedMembershipType === "Availed-Platinum") {
      totalFare *= 0.83; // 17% discount
    }
  }
  // Update the "Final Price" input field with the calculated total fare
  finalPriceInput.value = totalFare.toFixed(2); // Display the total fare with two decimal places
});
