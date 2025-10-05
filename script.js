// Global data storage
let scheduleData = null;
let currentFilter = 'all';

// Category names in Hebrew
const categoryNames = {
    'all': 'הכל',
    'music': 'מוזיקה',
    'tour': 'סיורים',
    'workshop': 'סדנאות',
    'theatre': 'תיאטרון',
    'lecture': 'הרצאות',
    'wellness': 'בריאות',
    'kids_family': 'ילדים ומשפחה',
    'open_houses': 'בתים פתוחים',
    'dj': 'DJ',
    'street_art': 'אמנות רחוב',
    'community': 'קהילה',
    'museum_tour': 'מוזיאון',
    'sports': 'ספורט',
    'street_show': 'תיאטרון רחוב',
    'exhibition': 'תערוכה',
    'parade_music': 'תהלוכה מוזיקלית'
};

// Day names in Hebrew
const dayNames = {
    '2025-10-09': 'יום חמישי',
    '2025-10-10': 'יום שישי',
    '2025-10-11': 'יום שבת'
};

// Load and initialize
async function init() {
    try {
        const response = await fetch('schedule.json');
        scheduleData = await response.json();
        
        // Update header
        document.getElementById('festival-name').textContent = scheduleData.festival.name;
        document.getElementById('festival-location').textContent = scheduleData.festival.location;
        
        // Format dates
        const dates = scheduleData.festival.dates;
        const startDate = formatHebrewDate(dates[0]);
        const endDate = formatHebrewDate(dates[dates.length - 1]);
        document.getElementById('festival-dates').textContent = `${startDate} - ${endDate}`;
        
        // Create filter buttons
        createFilterButtons();
        
        // Render events
        renderCalendar();
    } catch (error) {
        console.error('Error loading schedule:', error);
        document.getElementById('events-container').innerHTML = 
            '<div class="no-events"><h3>שגיאה בטעינת הלוח</h3><p>אנא נסה שוב מאוחר יותר</p></div>';
    }
}

// Create filter buttons
function createFilterButtons() {
    const categories = new Set(['all']);
    scheduleData.events.forEach(event => {
        if (event.category) {
            categories.add(event.category);
        }
    });
    
    const filterContainer = document.getElementById('filter-buttons');
    filterContainer.innerHTML = '';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.category = category;
        button.textContent = categoryNames[category] || category;
        
        if (category === 'all') {
            button.classList.add('active');
        }
        
        button.addEventListener('click', () => filterEvents(category));
        filterContainer.appendChild(button);
    });
}

// Filter events
function filterEvents(category) {
    currentFilter = category;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    // Re-render calendar
    renderCalendar();
}

// Render calendar view
function renderCalendar() {
    const container = document.getElementById('events-container');
    container.innerHTML = '';
    
    // Group events by date
    const eventsByDate = {};
    scheduleData.events.forEach(event => {
        if (currentFilter === 'all' || event.category === currentFilter) {
            if (!eventsByDate[event.date]) {
                eventsByDate[event.date] = [];
            }
            eventsByDate[event.date].push(event);
        }
    });
    
    // Sort dates
    const sortedDates = Object.keys(eventsByDate).sort();
    
    if (sortedDates.length === 0) {
        container.innerHTML = '<div class="no-events"><h3>אין אירועים</h3><p>נסה לבחור קטגוריה אחרת</p></div>';
        return;
    }
    
    // Create calendar container for all days
    const calendarContainer = document.createElement('div');
    calendarContainer.className = 'calendar-container';
    
    // Render each day as a column
    sortedDates.forEach(date => {
        const dayCalendar = createDayCalendar(date, eventsByDate[date]);
        calendarContainer.appendChild(dayCalendar);
    });
    
    container.appendChild(calendarContainer);
}

// Create a day calendar column
function createDayCalendar(date, events) {
    const dayCalendar = document.createElement('div');
    dayCalendar.className = 'day-calendar';
    
    // Day header
    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';
    
    const formattedDate = formatHebrewDate(date);
    const dayName = dayNames[date] || '';
    
    dayHeader.innerHTML = `
        <h3>${formattedDate}</h3>
        <div class="day-name">${dayName}</div>
    `;
    
    // Timeline
    const timeline = document.createElement('div');
    timeline.className = 'timeline-container';
    
    // Group events by hour
    const eventsByHour = groupEventsByHour(events);
    
    // Create time slots from 7:00 to 22:00
    for (let hour = 7; hour <= 22; hour++) {
        const timeSlot = createTimeSlot(hour, eventsByHour[hour] || []);
        timeline.appendChild(timeSlot);
    }
    
    dayCalendar.appendChild(dayHeader);
    dayCalendar.appendChild(timeline);
    
    return dayCalendar;
}

// Group events by starting hour
function groupEventsByHour(events) {
    const grouped = {};
    
    events.forEach(event => {
        const hour = parseInt(event.start.split(':')[0]);
        if (!grouped[hour]) {
            grouped[hour] = [];
        }
        grouped[hour].push(event);
    });
    
    return grouped;
}

// Create a time slot
function createTimeSlot(hour, events) {
    const timeSlot = document.createElement('div');
    timeSlot.className = 'time-slot';
    
    const timeLabel = document.createElement('div');
    timeLabel.className = 'time-label';
    timeLabel.textContent = `${hour.toString().padStart(2, '0')}:00`;
    
    const eventsColumn = document.createElement('div');
    eventsColumn.className = 'events-column';
    
    // Sort events by start time within this hour
    const sortedEvents = events.sort((a, b) => a.start.localeCompare(b.start));
    
    sortedEvents.forEach(event => {
        const eventElement = createCalendarEvent(event);
        eventsColumn.appendChild(eventElement);
    });
    
    timeSlot.appendChild(timeLabel);
    timeSlot.appendChild(eventsColumn);
    
    return timeSlot;
}

// Create a calendar event element
function createCalendarEvent(event) {
    const eventEl = document.createElement('div');
    eventEl.className = 'calendar-event';
    eventEl.dataset.category = event.category;
    
    const timeRange = `${event.start} - ${event.end}`;
    const venue = event.venue ? event.venue : '';
    
    eventEl.innerHTML = `
        <div class="event-time-range">${timeRange}</div>
        <div class="event-title-cal">${event.title}</div>
        ${venue ? `<div class="event-venue-cal">📍 ${venue}</div>` : ''}
    `;
    
    eventEl.addEventListener('click', () => addToGoogleCalendar(event));
    
    return eventEl;
}

// Add to Google Calendar
function addToGoogleCalendar(event) {
    const startDateTime = `${event.date}T${event.start.replace(':', '')}00`;
    const endDateTime = `${event.date}T${event.end.replace(':', '')}00`;
    
    let location = event.venue || '';
    if (event.address) {
        location += location ? `, ${event.address}` : event.address;
    }
    if (!location) {
        location = scheduleData.festival.location;
    }
    
    const details = `חלק מ${scheduleData.festival.name}\n\nמיקום: ${location}`;
    
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', event.title);
    url.searchParams.append('dates', `${startDateTime}/${endDateTime}`);
    url.searchParams.append('details', details);
    url.searchParams.append('location', location);
    url.searchParams.append('ctz', scheduleData.festival.timezone);
    
    window.open(url.toString(), '_blank');
}

// Format date in Hebrew
function formatHebrewDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate();
    const months = [
        'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
        'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    const month = months[date.getMonth()];
    
    return `${day} ${month}`;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
