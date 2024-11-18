// Function to handle adding recommendation
function addRecommendation() {
  // Get the message of the new recommendation
  let recommendation = document.getElementById("new_recommendation");

  // If the user has left a recommendation, display a pop-up
  if (recommendation.value != null && recommendation.value.trim() != "") {
    console.log("New recommendation added");
    
    // Show popup
    showPopup(true);

    // Create a new 'recommendation' element and set its value to the user's message
    var element = document.createElement("div");
    element.setAttribute("class", "recommendation");
    element.innerHTML = "<span>&#8220;</span>" + recommendation.value + "<span>&#8221;</span>";

    // Add this element to the end of the list of recommendations
    document.getElementById("all_recommendations").appendChild(element);

    // Reset the value of the textarea
    recommendation.value = "";

    // Send the recommendation to the backend (Express server)
    saveRecommendationToServer(recommendation.value);
  }
}

// Function to send recommendation to your Express server
async function saveRecommendationToServer(message) {
  try {
    const response = await fetch('http://localhost:3000/addRecommendation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message })  // Send message to server
    });

    const result = await response.json();

    if (result.success) {
      console.log("Recommendation successfully added on the server");
    } else {
      console.error("Error adding recommendation:", result.error);
    }
  } catch (error) {
    console.error("Error connecting to server:", error);
  }
}

// Show or hide the popup message
function showPopup(bool) {
  if (bool) {
    document.getElementById('popup').style.visibility = 'visible';
  } else {
    document.getElementById('popup').style.visibility = 'hidden';
  }
}

