document
  .getElementById("event-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    // Extract fields from the form
    const form = event.target;
    const formData = new FormData(form);
    const eventData = {
      title: formData.get("eventName"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      description: formData.get("description"),
    };
    console.log(eventData);
    const response = await fetch("/add-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (response.ok) {
      alert("Event created successfully.");
    } else {
      alert("Failed to create event. Please try again.");
    }
  });
