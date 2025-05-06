const { listeners } = require("process");

// Base URLs used across the script
const domain = "events.blackthorn.io";
const instanceUrl = `https://${domain}`;
const scriptSrc = `${instanceUrl}/embed.js`;

// When the user clicks the "Load Event" button
document.getElementById("loadEvent").addEventListener("click", () => {
  // Get and sanitize user input for orgId and path
  const orgId = document.getElementById("orgId").value.trim();
  let path = document.getElementById("path").value.trim();
  if (!path.startsWith("/")) path = "/" + path;

  // Construct the full iframe URL with virtual height query param
  const iframeSrc = `${instanceUrl}${path}?_vh=1152`;

  // Create the iframe and set its properties
  const iframe = Object.assign(document.createElement("iframe"), {
    src: iframeSrc, // URL to load in iframe
    className: "events-container",
    style: "width:100%;height:1152px;",
  });

  // Create the <script> element to load the Events embed script
  const script = document.createElement("script");
  script.src = scriptSrc;

  // When the script is loaded, initialize the Events app
  script.onload = () => {
    if (typeof initializeEventsApp === "function") {
      initializeEventsApp(orgId, path, instanceUrl);
    } else {
      console.error("initializeEventsApp is not defined.");
    }
  };

  // Add the script and iframe to the page
  document.body.append(script, iframe);

  // Log the generated URLs for debugging
  console.log("iFrame Source:", iframeSrc);
  console.log("Script Source:", scriptSrc);
});

// Initializes the Blackthorn Events App and sets up listeners
function initializeEventsApp(orgId, path, instanceUrl) {
  const app = new EventsApp({
    orgId,
    path,
    instanceUrl,
    listeners: [
      {
        event: "FORM_SUBMITTED",
        handler: (params) => {
          logEvent("FORM_SUBMITTED: " + JSON.stringify(params));
          openNewTab(); // Handle the event (e.g., open a new tab)
        },
      },
    ],
  });

  // Mount the app inside the iframe's container
  app.mount(".events-container");

  // Listen for postMessage events from the iframe
  window.addEventListener("message", (event) => {
    if (event.data === "FORM_SUBMITTED") {
      logEvent("Received FORM_SUBMITTED message from redirecting now...");
      openNewTab(); // Trigger redirect when message is received
    }
  });
}

// Opens a new tab to Google when the form is submitted
function openNewTab() {
  window.open("https://www.google.com", "_blank");
}

// Appends messages to the event log area on the page
function logEvent(message) {
  const log = document.getElementById("eventLog");
  log.innerText += message + "\n";
}

// Clears the event log when the "Clear Log" button is clicked
document.getElementById("clearLog").addEventListener("click", () => {
  document.getElementById("eventLog").innerText = "";
});
