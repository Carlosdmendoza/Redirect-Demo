document.getElementById("loadEvent").addEventListener("click", function () {
  const orgId = document.getElementById("orgId").value.trim();
  const path = document.getElementById("path").value.trim();
  const instanceUrl = "https://events.blackthorn.io"; // Your instance URL

  // Construct the dynamic script source
  const domain = "events.blackthorn.io";
  const scriptSrc = `https://${domain}/embed.js`;
  const appSrc = `https://${domain}${
    path.startsWith("/") ? path : "/" + path
  }?_vh=1152`; // Add vh=1152 parameter
  const iframe = document.createElement("iframe");

  // Set iframe properties
  iframe.src = appSrc;
  iframe.scrolling = "yes"; // Set scrolling to "yes"
  iframe.classList.add("events-container"); // Assuming you want to apply the same class for styling purposes

  // Explicitly set iframe height (1152px)
  iframe.style.height = "1152px";
  iframe.style.width = "100%"; // Make sure the iframe takes up the full width

  // Log the constructed URLs for debugging
  console.log("iFrame Source:", appSrc);
  console.log("Script Source:", scriptSrc);

  // Load the script dynamically
  const script = document.createElement("script");
  script.src = scriptSrc;
  script.onload = function () {
    // Initialize the Events App
    if (typeof initializeEventsApp === "function") {
      initializeEventsApp(orgId, path, instanceUrl);
    } else {
      console.error("initializeEventsApp is not defined.");
    }
  };

  document.body.appendChild(script);
  document.body.appendChild(iframe); // Add the iframe to the body
});

// Function to initialize the EventsApp
function initializeEventsApp(orgId, path, instanceUrl) {
  const app = new EventsApp({
    orgId: orgId,
    path: path,
    instanceUrl: instanceUrl,
    listeners: [
      {
        event: "APP_READY",
        handler: function () {
          logEvent("APP READY");
        },
      },
      {
        event: "ROUTE_CHANGED",
        handler: function (params) {
          logEvent("ROUTE_CHANGED: " + JSON.stringify(params));
        },
      },
      {
        event: "CONTENT_SIZE_CHANGED",
        handler: function (params) {
          logEvent("CONTENT_SIZE_CHANGED: " + JSON.stringify(params));
        },
      },
      {
        event: "FORM_SUBMITTED",
        handler: function (params) {
          logEvent("FORM_SUBMITTED: " + JSON.stringify(params));
          onFormSubmitted(); // Call the function to handle the submission
        },
      },
    ],
  });
  app.mount(".events-container");

  // Listen for messages from the iFrame
  window.addEventListener("message", function (event) {
    if (event.data === "FORM_SUBMITTED") {
      logEvent("Received FORM_SUBMITTED message from redirecting now...");
      onFormSubmitted(); // Trigger redirect on message
    }
  });
}

// Function to handle the form submitted event
function onFormSubmitted() {
  // Open Google.com in a new tab when the event is triggered
  window.open("https://www.google.com", "_blank");
}

// Function to log events to the event log
function logEvent(message) {
  const eventLog = document.getElementById("eventLog");
  eventLog.innerText += message + "\n";
}

// Clear log button functionality
document.getElementById("clearLog").addEventListener("click", function () {
  document.getElementById("eventLog").innerText = "";
});
