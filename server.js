const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create a connection to your MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'gatikarya',
  database: 'dbsproj'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});



app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/public/index.html');
});

app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/public/employee.html');
});
// Serve the add_employee.html page
app.get('/add_employee.html', (req, res) => {
  res.sendFile(__dirname + '/public/add_employee.html');
});
app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/public/ticket.html');
});
function getRandomDate(startDate, endDate) {
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();
  const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
  return new Date(randomTimestamp);
}

// Function to generate a random time (HH:MM:SS)
function getRandomTime() {
  const hours = Math.floor(Math.random() * 24);      // 0-23
  const minutes = Math.floor(Math.random() * 60);    // 0-59
  const seconds = Math.floor(Math.random() * 60);    // 0-59

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
// Handle GET requests to /get-ticket-info route
// Function to generate a random cost between 10000 and 25000 with 3 zeroes at the end
function getRandomCost() {
  const minCost = 10000;
  const maxCost = 25000;
  const range = (maxCost - minCost) / 1000; // Calculate the range in thousands

  // Generate a random integer within the range
  const randomValue = Math.floor(Math.random() * range);

  // Calculate the cost by adding the random value to the minimum cost and appending three zeros
  const cost = (minCost + randomValue * 1000).toFixed(0);

  return cost;
}

//login
app.post('/add-login', (req, res) => {
  const { email,username,password} = req.body;

  const loginSql = 'INSERT INTO login (email, username, password) VALUES (?, ?, ?)';

  db.query(loginSql, [email, username, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('New login added');
    } else {
      console.log('New Login added to the database');
    }
  });
});


// Inside the login route
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log('Received email:', email);
  console.log('Received password:', password);
  // Query to fetch user data based on email and password
  const sql = 'SELECT * FROM login WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Query result:', result);

    // Check if user exists with provided credentials
    if (result.length > 0) {
      // User found, send response indicating role
      const username = result[0].username;
      if (username === 'Admin1') {
        res.send('admin'); // Send 'admin' if user is admin
      } else {
        res.send('user'); // Send 'user' if user is regular user
      }
    } else {
      // User not found with provided credentials
      res.status(401).send('Invalid email or password');
    }
  });
});




// Handle POST requests to add a flight
// FETCHING AIRLINE INFO
app.post('/add-flight', (req, res) => {
  const { flight_id, departure, destination, airline_id, date, time, cost, intervals } = req.body;

  // Your predefined list of aircraft_ids
  const aircraftIds = ['AI200', 'AI201', 'I200', 'I201', 'BA200', 'BA201', 'E200', 'E201', 'E202', 'CF201', 'QA200', 'QA201'];

  // Filter aircraft IDs based on the first letter of airline ID
  const matchingAircraftIds = aircraftIds.filter(id => id.startsWith(airline_id.charAt(0)));

  // Randomly select an aircraft_id from the filtered list
  const randomAircraftId = matchingAircraftIds[Math.floor(Math.random() * matchingAircraftIds.length)];

  // Generate random date and time
  const randomDate = getRandomDate(new Date(2023, 0, 1), new Date(2023, 11, 31));
  const randomTime = getRandomTime();

  // Generate a random cost
  const randomCost = getRandomCost();

  // Insert the flight into the Flight table
  const flightSql = 'INSERT INTO Flight (flight_id, aircraft_id, airline_id) VALUES (?, ?, ?)';

  db.query(flightSql, [flight_id, randomAircraftId, airline_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error adding flight');
    } else {
      console.log('Flight added to the database');

      // Insert the flight details into the FlightDetails table
      const procedureSql = 'INSERT INTO FlightDetails (flight_id, departure, destination, date, time, Cost) VALUES (?,?,?,?,?,?)';

      db.query(procedureSql, [flight_id, departure, destination, date, time, cost], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error adding flight details');
        } else {
          console.log('Flight details added to the database');
          res.json('Flight and details added successfully');
        }
      });
    }
  });
});
// Handle POST requests to delete a flight from FlightDetails
app.post('/delete-flight', (req, res) => {
  const { flightId } = req.body;

  // Implement the SQL query to delete the flight from FlightDetails
  const deleteDetailsSql = 'DELETE FROM FlightDetails WHERE flight_id = ?';
  
  db.query(deleteDetailsSql, [flightId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting flight details');
    } else {
      // After deleting the flight details, delete the flight from the Flight table
      const deleteFlightSql = 'DELETE FROM Flight WHERE flight_id = ?';

      db.query(deleteFlightSql, [flightId], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error deleting flight');
        } else {
          console.log('Flight and details deleted successfully');
          res.send('Flight and details deleted successfully');
        }
      });
    }
  });
});

app.get('/get-employee/:id', (req, res) => {
  const employeeId = req.params.id;
  // Use MySQL queries to fetch data for the specified employee
  db.query('SELECT * FROM employee WHERE Emp_id = ?', [employeeId], (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Database error' });
      } else if (results.length > 0) {
          res.json(results[0]);
      } else {
          res.status(404).json({ error: 'Employee not found' });
      }
  });
});

app.get('/get-airline-info', (req, res) => {
  const { departure, destination, date } = req.query;

  // Define your SQL query here
  const sql = `SELECT name, flight_id, time
               FROM airline natural join flight natural join flightDetails
               WHERE destination = ? AND departure = ? AND date = ?`;

  db.query(sql, [destination, departure, date], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    } else {
      if (result.length > 0) {
        // Data found; send it to the client as JSON
        res.json(result);
      } else {
        // Data not found
        res.status(404).send('Airline information not found');
      }
    }
  });
});


const employeeSql = 'INSERT INTO Employee (emp_id, first_name, last_name, airline_id, salary, position) VALUES (?, ?, ?, ?, ?, ?)';
const financeSql = 'INSERT INTO Fin (airline_id, name, airAccount_no, ticket_id, emp_id, amount, finance_type) VALUES (?, ?, ?, ?, ?, ?, ?)';

app.post('/add-employee', (req, res) => {
  const {
    employeeId,
    firstName,
    lastName,
    airlineId,
    salary,
    position,
    airAccount_no,
    ticket_id,
  } = req.body;

  // Fetch the airline name based on airlineId
  db.query('SELECT name,airAccount_no FROM Airline WHERE airline_id = ?', [airlineId], (err, results) => {
    if (err) {
      console.error('Error fetching airline name:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (results.length === 0) {
        console.error('Airline not found');
        res.status(404).json({ error: 'Airline not found' });
      } else {
        const airlineName = results[0].name;
        const airAccount_no=results[0].airAccount_no;

        // Execute the SQL queries with parameters
        db.beginTransaction((err) => {
          if (err) {
            console.error('Error starting a database transaction:', err);
            res.status(500).json({ error: 'Database error' });
            return;
          }

          db.query(employeeSql, [employeeId, firstName, lastName, airlineId, salary, position], (err, result) => {
            if (err) {
              db.rollback(() => {
                console.error('Error inserting data into Employee table:', err);
                res.status(500).json({ error: 'Database error' });
              });
            } else {
              // If Employee data is successfully inserted, insert data into Finance table with finance_type set to 'salary'
              db.query(financeSql, [airlineId, airlineName, airAccount_no, ticket_id, employeeId, salary, 'salary'], (err, result) => {
                if (err) {
                  db.rollback(() => {
                    console.error('Error inserting data into Finance table:', err);
                    res.status(500).json({ error: 'Database error' });
                  });
                } else {
                  // Commit the transaction if everything is successful
                  db.commit((err) => {
                    if (err) {
                      db.rollback(() => {
                        console.error('Error committing the transaction:', err);
                        res.status(500).json({ error: 'Database error' });
                      });
                    } else {
                      console.log('Data inserted into Employee and Finance tables');
                      res.json({ message: 'Data submitted successfully' });
                    }
                  });
                }
              });
            }
          });
        });
      }
    }
  });
});
app.get('/get-cost', (req, res) => {
  const { departure, destination } = req.query;

  // Define your SQL query to fetch the cost based on departure and destination
  const sql = `SELECT Cost FROM FlightDetails WHERE departure = ? AND destination = ?`;

  db.query(sql, [departure, destination], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).send('An error occurred');
      } else {
          if (result.length > 0) {
              // Data found; send it to the client as JSON
              res.json(result[0]);
          } else {
              // Data not found
              res.status(404).send('Flight cost not found');
          }
      }
  });
});

// Server-side code for fetching flight cost
app.get('/get-flight-cost', (req, res) => {
  const { departure, destination } = req.query;

  // Define your SQL query to fetch the cost based on departure and destination
  const sql = `SELECT Cost FROM FlightDetails WHERE departure = ? AND destination = ?`;

  db.query(sql, [departure, destination], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    } else {
      if (result.length > 0) {
        // Data found; send it to the client as JSON
        res.json({ cost: result[0].Cost });
      } else {
        // Data not found
        res.status(404).send('Flight cost not found');
      }
    }
  });
});

// Handle GET requests to /get-ticket-info route
app.get('/get-ticket-info', (req, res) => {
  const ticketId = req.query.ticketId;

  const sql = `
    SELECT
      P.first_name AS Passenger_FirstName,
      DATE_FORMAT(P.DOB, '%Y-%m-%d') AS Date_of_Birth,
      F.flight_id AS Flight_ID,
      A.name AS Airline_Name,
      T.departure AS Departure,
      T.destination AS Destination,
      DATE_FORMAT(T.ticket_date, '%Y-%m-%d') AS Ticket_Date,
      DATE_FORMAT(T.travelling_date, '%Y-%m-%d') AS Travel_Date,
      P.loyalty_type AS Loyalty_Type,
      T.status AS Status_Type
    FROM Ticket T
    JOIN Passenger P ON T.passenger_id = P.passenger_id
    JOIN Flight F ON T.flight_id = F.flight_id
    JOIN Airline A ON F.airline_id = A.airline_id
    WHERE T.ticket_id = ?`;

  db.query(sql, [ticketId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).send('Ticket not found');
      }
    }
  });
});

function generateRandomSeatNumber() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
  const randomNumber = Math.floor(Math.random() * 9) + 1;
  return randomLetter + randomNumber;
}
const ticketSql =
  'INSERT INTO Ticket (ticket_date, travelling_date, airline_name, flight_id, passenger_id, departure, destination, seat_no, final_cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
const finSql =
  'INSERT INTO Fin (airline_id, name, airAccount_no, ticket_id, emp_id, amount, finance_type) VALUES (?, ?, ?, ?, ?, ?, ?)';
  app.post('/book-ticket', (req, res) => {
    const {
      date,
      airlineName,
      flightId,
      PassengerId,
      departure,
      destination,
      finalPrice,
      emp_id,
      loyaltyType  // Assuming loyaltyType is part of the request body
    } = req.body;
  
    const ticketDate = new Date().toISOString().split('T')[0];
    const seatNo = generateRandomSeatNumber();
  
    // Fetch the airline information based on airlineName
    db.query('SELECT airline_id, name, airAccount_no FROM Airline WHERE name = ?', [airlineName], (err, results) => {
      if (err) {
        console.error('Error fetching airline information:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        if (results.length === 0) {
          console.error('Airline not found');
          res.status(404).json({ error: 'Airline not found' });
        } else {
          const airlineId = results[0].airline_id;
          const airlineName = results[0].name;
          const airAccount_no = results[0].airAccount_no;
  
          // Execute the SQL queries with parameters
          db.beginTransaction((err) => {
            if (err) {
              console.error('Error starting a database transaction:', err);
              res.status(500).json({ error: 'Database error' });
              return;
            }
  
            // Ticket insertion query
            db.query(
              ticketSql,
              [ticketDate, date, airlineName, flightId, PassengerId, departure, destination, seatNo, finalPrice],
              (err, result) => {
                if (err) {
                  db.rollback(() => {
                    console.error('Error inserting data into Ticket table:', err);
                    res.status(500).json({ error: 'Database error' });
                  });
                } else {
                  const ticketId = result.insertId;
  
                  // Fin insertion query
                  db.query(
                    finSql,
                    [airlineId, airlineName, airAccount_no, ticketId, emp_id, finalPrice, 'ticket'],
                    (err, result) => {
                      if (err) {
                        db.rollback(() => {
                          console.error('Error inserting data into Finance table:', err);
                          res.status(500).json({ error: 'Database error' });
                        });
                      } else {
                        // Commit the transaction if everything is successful
                        db.commit((err) => {
                          if (err) {
                            db.rollback(() => {
                              console.error('Error committing the transaction:', err);
                              res.status(500).json({ error: 'Database error' });
                            });
                          } else {
                            console.log('Data inserted into Ticket and Finance tables');
  
                            // Check if membership is selected, and update Passenger table
                            if (loyaltyType) {
                              db.query(
                                'UPDATE Passenger SET loyalty_type = ? WHERE passenger_id = ?',
                                [loyaltyType, PassengerId],
                                (updateErr, updateResult) => {
                                  if (updateErr) {
                                    console.error('Error updating loyalty_type:', updateErr);
                                    // You might want to handle this error case
                                  }
                                }
                              );
                            }
  
                            res.json({ message: 'Ticket booked successfully' });
                          }
                        });
                      }
                    }
                  );
                }
              }
            );
          });
        }
      }
    });
  });
  
app.get('/get-all-financial-info', (req, res) => {
  // Assuming your FIN table structure, adjust the queries accordingly
  const allAirlineInfoQuery = `
    SELECT name AS airline, airAccount_no AS airlineAccountNo,
           (SELECT COUNT(DISTINCT emp_id) FROM FIN WHERE FIN.name = airline AND finance_type = 'salary') AS employeeCount,
           (SELECT COUNT(DISTINCT ticket_id) FROM FIN WHERE FIN.name = airline AND finance_type = 'ticket') AS passengerCount,
           (SELECT SUM(amount) FROM FIN WHERE FIN.name = airline AND finance_type = 'salary') AS totalSalary,
           (SELECT SUM(amount) FROM FIN WHERE FIN.name = airline AND finance_type = 'ticket') AS totalTicketAmount
    FROM FIN
    GROUP BY airline, airlineAccountNo;
  `;

  db.query(allAirlineInfoQuery, (err, results) => {
    if (err) {
      console.error('Error fetching all airline financial info:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Send the information as JSON
      res.json(results);
    }
  });
});

//FETCHING AIRLINE INFO
app.get('/get-airline', (req, res) => {
  const selectedAircraft = req.query.aircraft;
  console.log(selectedAircraft);

  if (!selectedAircraft) {
      return res.status(400).json({ error: 'Aircraft type is required.' });
  }

  // Fetch airlines, number of flights, and total seating capacity from the database
  const sql = `
  SELECT A.name, COUNT(F.flight_id) AS num_flights, MAX(AC.seating_cap) AS seating_cap
FROM Airline A
LEFT JOIN Flight F ON A.airline_id = F.airline_id
LEFT JOIN Aircraft AC ON F.aircraft_id = AC.aircraft_id
WHERE AC.aircraft_type = ?
GROUP BY A.airline_id, AC.aircraft_id;
  `;

  db.query(sql, [selectedAircraft], (err, results) => {
      if (err) {
          console.error('Error fetching airline information:', err);
          return res.status(500).json({ error: 'Internal server error.' });
      }

      console.log('Results from the database:', results);
      if (results.length === 0) {
          return res.status(404).json({ error: 'No airlines found for the selected aircraft type.' });
      }

      // Return the result as JSON
      res.json({ airlines: results });
  });
});
 
// Define a new API endpoint to handle passenger data insertion
app.post('/add-passenger', (req, res) => {
  const { passengerId, firstName, lastName, DOB, passportId } = req.body;
console.log(passengerId);
  // Assuming loyalty_type in the table corresponds to membershipType
  const sql = 'INSERT INTO Passenger (passenger_id, first_name, last_name, DOB, passport_id) VALUES (?, ?, ?, ?, ?)';
  const values = [passengerId, firstName, lastName, DOB, passportId];

  db.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error inserting passenger data:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          console.log('Passenger data inserted successfully.');
          res.json({ success: true, message: 'Passenger data inserted successfully.' });
      }
  });
});


app.get('/getFlightCount', (req, res) => {
  const query = 'SELECT COUNT(flight_id) as flightCount FROM Flight';

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Send the count as JSON
    res.json({ flightCount: results[0].flightCount });
  });
});
app.get('/getAirlineCount', (req, res) => {
  db.query('SELECT COUNT(*) AS airlineCount FROM Airline', (err, results) => {
      if (err) {
          console.error('Error fetching airline count:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          const airlineCount = results[0].airlineCount;
          res.json({ airlineCount });
      }
  });
});

app.get('/getAircraftCount', (req, res) => {
  db.query('SELECT COUNT(*) AS aircraftCount FROM Aircraft', (err, results) => {
      if (err) {
          console.error('Error fetching aircraft count:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          const aircraftCount = results[0].aircraftCount;
          res.json({ aircraftCount });
      }
  });
});

app.get('/getPilotCount', (req, res) => {
  db.query('SELECT COUNT(emp_id) AS pilotCount FROM Employee WHERE position = "Pilot"', (err, results) => {
      if (err) {
          console.error('Error fetching pilot count:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          const pilotCount = results[0].pilotCount;
          res.json({ pilotCount });
      }
  });
});

// Route to get staff count
app.get('/getStaffCount', (req, res) => {
  db.query('SELECT COUNT(emp_id) AS staffCount FROM Employee WHERE position != "Pilot"', (err, results) => {
      if (err) {
          console.error('Error fetching staff count:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          const staffCount = results[0].staffCount;
          res.json({ staffCount });
      }
  });
});

// Route to get passenger count
app.get('/getPassengerCount', (req, res) => {
  db.query('SELECT COUNT(*) AS passengerCount FROM Passenger', (err, results) => {
      if (err) {
          console.error('Error fetching passenger count:', err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          const passengerCount = results[0].passengerCount;
          res.json({ passengerCount });
      }
  });
});
// Express route to handle the search request
// API endpoint for handling flight search
app.get('/search', async (req, res) => {
  try {
    const { airline, date, time } = req.query;

    // Validate and sanitize input parameters
    console.log('Input Parameters:', airline, date, time);

    // Query the database
    const [rows, fields] = await db.promise().query(
      'SELECT name, aircraft_type, flight_id, departure FROM airline ' +
      'NATURAL JOIN aircraft ' +
      'NATURAL JOIN flight ' +
      'NATURAL JOIN flightdetails ' +
      'WHERE name = ? AND date = ? AND time = ?',
      [airline, date, time]
    );

    // Log query results and fields
    console.log('Query Results:', rows);
    console.log('Query Fields:', fields);

    // Send the retrieved data as JSON response
    res.json(rows);
  } catch (error) {
    console.error('Error executing search query:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/searchDeparture', async (req, res) => {
  try {
    const { airline, date, time } = req.query;

    // Validate and sanitize input parameters
    console.log('Input Parameters:', airline, date, time);

    // Query the database
    const [rows, fields] = await db.promise().query(
      'SELECT name, aircraft_type, flight_id, destination FROM airline ' +
      'NATURAL JOIN aircraft ' +
      'NATURAL JOIN flight ' +
      'NATURAL JOIN flightdetails ' +
      'WHERE name = ? AND date = ? AND time = ?',
      [airline, date, time]
    );

    // Log query results and fields
    console.log('Query Results:', rows);
    console.log('Query Fields:', fields);

    // Send the retrieved data as JSON response
    res.json(rows);
  } catch (error) {
    console.error('Error executing search query:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/travellers', (req, res) => {
  const query = `
    SELECT first_name, last_name
    FROM passenger natural join ticket
    GROUP BY first_name, last_name
    HAVING COUNT(*) > 3
  `;
  
  // Use the correct database connection object, which is 'db' in this case
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error querying the database:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

app.get('/flights', (req, res) => {
  const selectedDate = req.query.date;

  // Query to select flight details based on the provided date
  const sql = `SELECT fd.flight_id, a.name AS airline_name, fd.departure, fd.destination, fd.time, fd.cost
  FROM FlightDetails fd
  INNER JOIN Flight f ON fd.flight_id = f.flight_id
  INNER JOIN Airline a ON f.airline_id = a.airline_id
  WHERE fd.date = ?`;


  // Execute the query with the selected date parameter
  db.query(sql, [selectedDate], (error, results) => {
    if (error) {
      console.error('Error executing query: ', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Send the query results as JSON response
    res.json(results);
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
