✈️ Skywings – Travel Agency Website

A modern, responsive, single-page travel agency website built with HTML, CSS and vanilla JavaScript. Visitors can explore popular destinations, browse holiday packages, read reviews, and use an interactive flight search form that validates input and shows an instant price estimate.

Note: This is a front-end project. Prices, fares and package details are sample data, and the forms do not send data to a server.

✨ Features
Responsive design – mobile-first layout that adapts to phones, tablets and desktops
Floating navigation bar with active-section highlighting and a mobile slide-down menu
Hero section with an animated plane and clear call to action
Flight search form
Round trip / one way toggle
City suggestions, plus a swap button for origin and destination
Date pickers that block past dates (return date must be after departure)
Traveler stepper and cabin class selector
Inline validation with helpful error messages
Price estimate shown in an accessible pop-up (<dialog>)
Destination cards – "Book flights" pre-fills the form and scrolls to it
Holiday packages – three bundles with a highlighted "Most popular" plan
Animated stats counters that count up on scroll
Testimonials slider (Swiper) with autoplay and pagination
FAQ accordion built with native <details>
Newsletter sign-up with email validation and toast notifications
Polish – scroll-progress bar, scroll-reveal animations, back-to-top button
Accessibility – skip link, ARIA attributes, visible focus states, keyboard support, and prefers-reduced-motion support
🛠️ Tech Stack
Area	Technology
Structure	HTML5 (semantic elements, <dialog>, <details>)
Styling	CSS3 (variables, Grid, Flexbox, animations)
Behaviour	Vanilla JavaScript (ES6+)
Slider	Swiper 11
Icons	Remix Icon
Fonts	Google Fonts – DM Sans, Sora
📁 Project Structure
Skywings/
├── index.html      # Page structure and content
├── style.css       # All styling and responsive rules
├── app.js          # Interactivity, form logic, animations
├── assets/         # Images (hero, destinations, clients, etc.)
└── README.md
🚀 Getting Started
Download or clone this project.
Open index.html in any modern browser — no build step or installation needed.
An internet connection is required for the icons, fonts and slider, which load from a CDN.

Optional: run a local server (for example with the VS Code Live Server extension, or python -m http.server).

🧠 How It Works
Design tokens: colors, radii and shadows are CSS variables in :root, so the theme can be changed in one place.
Scroll reveal and counters: IntersectionObserver adds a class when elements enter the viewport; CSS handles the animation.
Active menu link: another IntersectionObserver tracks which section is on screen.
Form validation: custom JavaScript checks cities, dates and email format, shows inline errors and focuses the first invalid field.
Price estimate: max(a, b) + 10% × min(a, b) for the route, × 1.85 for round trips, × cabin multiplier, × number of travelers. This is a sample formula, not real fare data.
🔧 Customisation
Colors and look: edit the variables at the top of style.css.
Cities and fares: edit the CITIES object in app.js.
Packages and destinations: edit the matching sections in index.html.
Contact details: update the phone, email and address in the footer of index.html.
🔮 Future Improvements
Back-end API for real flight search and bookings
User accounts and saved trips
Search results page with filters
Image optimisation (WebP, responsive srcset)
Dark mode
Automated tests and a Lighthouse performance/accessibility audit
📸 Credits
Icons by Remix Icon
Slider by Swiper
Fonts by Google Fonts
Original project template: Web Design Mastery; redesigned and extended with new features
📄 License

This project is for learning and portfolio purposes. Replace this section with your preferred license (for example, MIT) before publishing.

Readme
MD
Skywings travel agency
ZIP
Uploads
1791315998119_Travel Agency.zip
