const ical = require("node-ical");
const path = require("path");

// Path to your .ics file (or use a URL if it's an online calendar)
const calendarPath = path.join(__dirname, "my_calendar.ics");

// Get events for the next year
const now = new Date();
const oneYearLater = new Date();
oneYearLater.setFullYear(now.getFullYear() + 1);

// Function to check for event conflicts
async function checkConflicts() {
  try {
    const events = await ical.parseFile(calendarPath);
    const eventList = Object.values(events).filter(
      (event) => event.type === "VEVENT"
    );

    // Filter events within the next year
    const upcomingEvents = eventList.filter((event) => {
      return event.start >= now && event.start <= oneYearLater;
    });

    // Sort events by start time
    upcomingEvents.sort((a, b) => a.start - b.start);

    let conflicts = [];
    for (let i = 0; i < upcomingEvents.length - 1; i++) {
      let currentEvent = upcomingEvents[i];
      let nextEvent = upcomingEvents[i + 1];

      if (currentEvent.end > nextEvent.start) {
        conflicts.push({
          event1: currentEvent.summary,
          event2: nextEvent.summary,
          time1: `${currentEvent.start} - ${currentEvent.end}`,
          time2: `${nextEvent.start} - ${nextEvent.end}`,
        });
      }
    }

    // Output results
    if (conflicts.length > 0) {
      console.log("Conflicts Found:");
      conflicts.forEach((conflict) => {
        console.log(
          `⚠️ Conflict: ${conflict.event1} overlaps with ${conflict.event2}`
        );
        console.log(`  ${conflict.time1} ↔ ${conflict.time2}`);
      });
    } else {
      console.log("✅ No conflicts detected.");
    }
  } catch (error) {
    console.error("Error parsing calendar:", error);
  }
}

// Run the function
checkConflicts();

// Checking GitHub
