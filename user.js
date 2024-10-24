const loyaltyTypeDropdown = document.getElementById("loyaltyType");
const membershipFeesInput = document.getElementById("membershipfees");
let MembershipAirline=null
let baseCost=0
let airlineDiscount=null
let abc=0
let flightNum=null
let totalFare=0
// Add an event listener to the loyalty dropdown
loyaltyTypeDropdown.addEventListener("change", function () {
  const selectedLoyaltyType = loyaltyTypeDropdown.value;

  // Calculate the membership fees based on the selected loyalty type
  let membershipFees = 0;

  if (selectedLoyaltyType.includes("Availed")) {
    // Set fees to 0 for availed membership types
    membershipFees = 0;
  } else {
    // Update membership fees based on the selected airline
    switch (MembershipAirline) {
      case "Air India":
        console.log(selectedLoyaltyType)
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
  abc=membershipFees

  // Update the membership fees input field
  console.log(membershipFees)
  console.log(abc)
  membershipFeesInput.innerHTML = `One time membership fees is: <strong>${membershipFees}</strong>`;

  // You can also update the final price here if needed
});



document.getElementById("fetchButton").addEventListener("click", function () {
  const departure = document.getElementById("departure").value;
  const destination = document.getElementById("destination").value;
  const date = document.getElementById("date").value;

  fetch(`http://localhost:4000/get-airline-info?departure=${departure}&destination=${destination}&date=${date}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
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

        
          flightInfo.appendChild(airlineName);
          flightInfo.appendChild(flightId);
          flightInfo.appendChild(flightTime);
          flightInfo.appendChild(selectButton);

          resultContainer.appendChild(flightInfo);
        }
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
      const resultContainer = document.getElementById("result");
      resultContainer.innerHTML = '<strong style="font-size: 24px;">Airline information not found.</strong>';
    });
});

function handleFlightSelection(selectedFlight) {
const loyaltyAirlineDisplay = document.getElementById('loyaltyAirlineDisplay');
const selectedAirline = selectedFlight.name;
flightNum=selectedFlight.flight_id
airlineDiscount=selectedAirline
console.log(airlineDiscount)
const eligibleAirlines = ["Air India", "Emirates", "Qatar Airways"];
MembershipAirline=selectedAirline
if (eligibleAirlines.includes(selectedAirline)) {
  loyaltyAirlineDisplay.innerHTML = `Membership available for airline: <strong>${ selectedAirline}</strong>`
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
    const ticketPrice = document.getElementById("ticketPrice");
    baseCost=`${data.cost}`
    ticketPrice.innerHTML = `Base price of the ticket is <strong>${data.cost}</strong><br><br>Purchase membership or Already Availed ?`;
  })
  .catch(error => {
    console.error("Error fetching flight cost:", error);
    const ticketPrice = document.getElementById("ticketPrice");
    ticketPrice.textContent = "Error fetching flight cost.";
  });

  const loyaltyTypeGroup = document.getElementById("loyaltyTypeGroup");
loyaltyTypeGroup.style.display = "block";
//const loyaltyLabel = document.getElementById("loyaltyLabel");
//loyaltyLabel.style.display = "block";
//loyaltyLabel.textContent = "Purchase membership or Already Availed ?"; 



// Send the selected flight's airline name and flight ID to the server
document.getElementById("airlineNameInput").value = selectedAirline;
document.getElementById("flightIdInput").value = selectedFlight.flight_id;
document.getElementById("updatedPrice").style.display="block";


  
}
 
else {
  loyaltyAirlineDisplay.textContent = "This airline is not eligible for membership benefits.";
  const ticketPrice = document.getElementById("ticketPrice");
    ticketPrice.innerHTML = `Base price of the ticket is <strong>${baseCost}</strong>`;
  membershipFeesInput.innerHTML=""
  const loyaltyTypeGroup = document.getElementById("loyaltyTypeGroup");
  loyaltyTypeGroup.style.display = "none";
  document.getElementById("updatedPrice").style.display="block";
}

}


document.getElementById("updatedPrice").addEventListener("click", function () {
  const basePriceInput =`${baseCost}`;
  const membershipFeesInput = `${abc}`;
  const finalPriceInput = document.getElementById("finalPrice");
console.log(basePriceInput)
console.log(membershipFeesInput)

  // Get the base price, membership fees, and selected membership type
  const basePrice = parseFloat(basePriceInput) || 0;
  const membershipFeesInt = parseFloat(membershipFeesInput) || 0;
  const selectedMembershipType = document.getElementById("loyaltyType").value;

  // Get the selected flight's airline
  //const selectedAirline = document.getElementById("loyaltyAirlineDisplay").value;
//console.log(selectedAirline)
  // Calculate the total fare by adding the base price and membership fees
   totalFare = basePrice + membershipFeesInt;
console.log(totalFare)
  // Check if the selected airline is "Air India" and apply discounts accordingly
  if ( airlineDiscount=== "Air India") {
    if (selectedMembershipType === "Gold" || selectedMembershipType === "Availed-Gold") {
      totalFare *= 0.95; // 5% discount
    } else if (selectedMembershipType === "Silver" || selectedMembershipType === "Availed-Silver") {
      totalFare *= 0.90; // 10% discount
    } else if (selectedMembershipType === "Platinum" || selectedMembershipType === "Availed-Platinum") {
      totalFare *= 0.85; // 15% discount
    }
  } else if (airlineDiscount === "Emirates") {
    // Apply discounts for "Emirates" airline
    if (selectedMembershipType === "Gold" || selectedMembershipType === "Availed-Gold") {
      totalFare *= 0.94; // 6% discount
    } else if (selectedMembershipType === "Silver" || selectedMembershipType === "Availed-Silver") {
      totalFare *= 0.89; // 11% discount
    } else if (selectedMembershipType === "Platinum" || selectedMembershipType === "Availed-Platinum") {
      totalFare *= 0.84; // 16% discount
    }
  } else if (airlineDiscount === "Qatar Airways") {
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
  finalPriceInput.innerHTML = `The total cost of the ticket is <strong>`+totalFare.toFixed(2)+`</strong>`; // Display the total fare with two decimal places
  document.getElementById("bookTicketButton").style.display="block";
  
});

document.getElementById('bookTicketButton').addEventListener('click',function(){
  const date = document.getElementById("date").value;
  const departure = document.getElementById("departure").value;
  const destination = document.getElementById("destination").value;
  const PassengerId=document.getElementById("PassengerId").value;
  const selectedLoyaltyType = loyaltyTypeDropdown.value;
  const flightId=flightNum;
  const finalPrice=totalFare;
  const data ={
    date:date,
    airlineName:airlineDiscount,
    flightId:flightId,
    PassengerId:PassengerId,
    departure:departure,
    destination:destination,
    finalPrice:finalPrice,
    selectedLoyaltyType:selectedLoyaltyType
  };

  fetch('/book-ticket',{
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    console.log(data);
    alert(data); // Display success message
    //prompt('Ticket booked successfully');
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error occurred. Please try again.');
  });

});

  fetch('http://localhost:4000/travellers')
  .then(response => response.json())
  .then(data => {
    const travellerCards = document.querySelectorAll('.travellers__card');

    // Hide all cards initially
    travellerCards.forEach(card => {
      card.style.display = 'none';
    });

    // Show only the necessary number of cards based on the received data
    data.forEach((traveller, index) => {
      const cardContent = travellerCards[index].querySelector('.travellers__card__content');
      const nameElement = cardContent.querySelector('h4');

      // Use the correct property names based on your server-side response
      nameElement.textContent = `${traveller.first_name} ${traveller.last_name}`;

      // Show the card
      travellerCards[index].style.display = 'block';
    });
  })
  .catch(error => console.error('Error fetching data:', error));
