/* ============================================
   MAIN.JS — Auxano Institute of Technology
   Matches: auxano_first_webpage.html + styles.css
   ============================================ */

/* ============================================
   1. WAIT FOR THE PAGE TO FULLY LOAD
   ============================================ */
document.addEventListener("DOMContentLoaded", function () {

  /* ------------------------------------------
     2. SET TODAY'S DATE IN THE FOOTER
     ------------------------------------------ */
  // Finds any element with class "footer-date" or the footer <p>
  // and writes today's date into it automatically.
  const footerDate = document.querySelector(".footer-date");
  if (footerDate) {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    footerDate.textContent = today.toLocaleDateString("en-NG", options);
  }

  // Also update the plain footer paragraph in the simple HTML version
  // (the one that says "Made by [Your Name] | ... | [Today's Date]")
  const footerParagraphs = document.querySelectorAll("footer p");
  footerParagraphs.forEach(function (para) {
    if (para.textContent.includes("[Today's Date]")) {
      const today = new Date();
      const dateString = today.toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      para.textContent = para.textContent.replace("[Today's Date]", dateString);
    }
  });


  /* ------------------------------------------
     3. DARK MODE TOGGLE
     The CSS already has the styles for dark mode.
     This JavaScript turns it on and off.
     ------------------------------------------ */
  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  if (darkModeToggle) {
    // Remember the user's preference when they return to the page
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");

      // Save the choice so it persists after page reload
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
  }


  /* ------------------------------------------
     4. STICKY HEADER SHADOW ON SCROLL
     The CSS has a ".header.scrolled" class ready.
     This adds it when the user scrolls down.
     ------------------------------------------ */
  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }


  /* ------------------------------------------
     5. HAMBURGER (MOBILE) MENU TOGGLE
     The CSS has ".hamburger-menu.active" and
     ".nav-menu.active" styles ready and waiting.
     ------------------------------------------ */
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburgerMenu && navMenu) {
    hamburgerMenu.addEventListener("click", function () {
      hamburgerMenu.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close the menu when a nav link is clicked
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        hamburgerMenu.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }


  /* ------------------------------------------
     6. ACTIVE NAV LINK HIGHLIGHT
     Adds the "active" class to the nav link
     that matches the current page section.
     ------------------------------------------ */
  const allNavLinks = document.querySelectorAll(".nav-link");

  function setActiveLink() {
    allNavLinks.forEach(function (link) {
      link.classList.remove("active");
      // Check if the link's href matches the current page URL
      if (link.href === window.location.href) {
        link.classList.add("active");
      }
    });
  }
  setActiveLink();


  /* ------------------------------------------
     7. SCROLL-TO-TOP BUTTON
     The CSS has ".scroll-to-top.show" ready.
     This makes the button appear after scrolling
     down 300px, and scroll back to top on click.
     ------------------------------------------ */
  const scrollToTopBtn = document.querySelector(".scroll-to-top");
  if (scrollToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("show");
      } else {
        scrollToTopBtn.classList.remove("show");
      }
    });

    scrollToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


  /* ------------------------------------------
     8. SCROLL ANIMATIONS (Fade-in / Slide-up)
     The CSS has ".fade-in" and ".slide-up"
     animation classes. This uses the browser's
     IntersectionObserver to add those classes
     to elements as they scroll into view.
     ------------------------------------------ */
  const animatedElements = document.querySelectorAll(
    "h1, h2, h3, p, li, img, footer, [data-animate]"
  );

  // IntersectionObserver watches elements and fires when they enter the screen
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Add the animation class when the element becomes visible
            entry.target.classList.add("fade-in");
            // Stop watching once it has animated (so it doesn't repeat)
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 } // Trigger when 15% of the element is visible
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }


  /* ------------------------------------------
     9. CONTACT FORM VALIDATION
     The CSS has ".form-input.error", ".error-message",
     and ".success-message.show" ready.
     This validates the form before it is submitted.
     ------------------------------------------ */
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Stop the page from reloading

      let formIsValid = true;

      // --- Validate each required field ---
      const requiredFields = contactForm.querySelectorAll("[required]");
      requiredFields.forEach(function (field) {
        const errorMsg = document.querySelector(
          '[data-error="' + field.id + '"]'
        );

        if (field.value.trim() === "") {
          field.classList.add("error");
          if (errorMsg) errorMsg.textContent = "This field is required.";
          formIsValid = false;
        } else {
          field.classList.remove("error");
          if (errorMsg) errorMsg.textContent = "";
        }

        // Extra check: validate email format
        if (field.type === "email" && field.value.trim() !== "") {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(field.value)) {
            field.classList.add("error");
            if (errorMsg) errorMsg.textContent = "Please enter a valid email address.";
            formIsValid = false;
          }
        }
      });

      // --- If all fields are valid, show success message ---
      if (formIsValid) {
        const successMessage = contactForm.querySelector(".success-message");
        if (successMessage) {
          successMessage.classList.add("show");
          successMessage.textContent =
            "Thank you! Your message has been sent successfully.";
        }
        contactForm.reset(); // Clear the form fields
      }
    });

    // Remove the red "error" border as soon as the user starts typing
    const formInputs = contactForm.querySelectorAll(".form-input, .form-textarea");
    formInputs.forEach(function (input) {
      input.addEventListener("input", function () {
        input.classList.remove("error");
        const errorMsg = document.querySelector('[data-error="' + input.id + '"]');
        if (errorMsg) errorMsg.textContent = "";
      });
    });
  }


  /* ------------------------------------------
     10. AUTOMATIC FOOTER YEAR
     Keeps the copyright year up to date
     without editing the HTML manually.
     ------------------------------------------ */
  const yearSpan = document.querySelector(".footer-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }


  /* ------------------------------------------
     11. SMOOTH SCROLL FOR ANCHOR LINKS
     Works alongside the CSS "scroll-behavior: smooth".
     Ensures all internal links (#section) scroll
     smoothly even on older browsers.
     ------------------------------------------ */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });


  /* ------------------------------------------
     12. PLACEHOLDER TEXT REPLACEMENT
     Replaces the [Your Name] placeholders in
     the simple HTML version so you only need
     to change one variable here.
     ------------------------------------------ */
  const STUDENT_NAME = "Your Name"; // <-- Change this to the student's real name

  document.querySelectorAll("h1, h2, footer p").forEach(function (el) {
    if (el.innerHTML.includes("[Your Name]")) {
      el.innerHTML = el.innerHTML.replace(/\[Your Name\]/g, STUDENT_NAME);
    }
  });


  /* ------------------------------------------
     13. IMAGE LOAD ERROR FALLBACK
     If the placeholder image fails to load,
     shows a friendly message instead of a
     broken image icon.
     ------------------------------------------ */
  const images = document.querySelectorAll("img");
  images.forEach(function (img) {
    img.addEventListener("error", function () {
      img.alt = "Image could not be loaded.";
      img.style.border = "2px dashed #ccc";
      img.style.padding = "10px";
      img.style.backgroundColor = "#f8f9fa";
    });
  });


  /* ------------------------------------------
     14. CONSOLE WELCOME MESSAGE
     Shows a friendly message in the browser's
     developer console — a good teaching moment!
     ------------------------------------------ */
  console.log(
    "%c🎉 Welcome to Auxano Institute of Technology!",
    "color: #007bff; font-size: 16px; font-weight: bold;"
  );
  console.log(
    "%cThis page was built by an Auxano student using HTML, CSS, and JavaScript.",
    "color: #28a745; font-size: 13px;"
  );

}); // END DOMContentLoaded
