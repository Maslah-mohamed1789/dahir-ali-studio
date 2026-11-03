// =========================================
// DAHIR-ALI STUDIO - script.js
// Menu, WhatsApp link, active nav, back-to-top,
// photo viewer and contact form
// =========================================

// ---------------------------------------------------------
// 1. YOUR WHATSAPP NUMBER (change only this part)
//    Use the full international number: digits only,
//    no +, no spaces, no leading zero.
//    Example for Kenya: 0712 345 678 becomes 254712345678
// ---------------------------------------------------------
const WHATSAPP_NUMBER = "254722492593";
const WHATSAPP_MESSAGE = "Hello Dahir-Ali Studio, I would like to book a photography session.";

// Every link marked data-whatsapp opens a chat with you directly
document.querySelectorAll("a[data-whatsapp]").forEach((link) => {
    link.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);
});

// ---------------------------------------------------------
// 2. MOBILE MENU
// ---------------------------------------------------------
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

function setMenu(open) {
    navLinks.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        setMenu(!navLinks.classList.contains("open"));
    });

    // close after choosing a link
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });

    // close when tapping outside the menu
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".navbar")) setMenu(false);
    });
}

// ---------------------------------------------------------
// 3. HIGHLIGHT THE CURRENT SECTION IN THE MENU
// ---------------------------------------------------------
const navAnchors = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navAnchors.forEach((a) => {
                    a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
                });
            }
        });
    }, { rootMargin: "-40% 0px -55% 0px" });

    document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
}

// ---------------------------------------------------------
// 4. BACK-TO-TOP BUTTON
// ---------------------------------------------------------
const toTop = document.getElementById("to-top");

if (toTop) {
    window.addEventListener("scroll", () => {
        toTop.hidden = window.scrollY < 600;
    }, { passive: true });

    toTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ---------------------------------------------------------
// 5. GALLERY PHOTO VIEWER (lightbox)
// ---------------------------------------------------------
const lightbox = document.getElementById("lightbox");
const galleryButtons = document.querySelectorAll(".gallery-btn");

if (lightbox && galleryButtons.length) {
    const lbImg = document.getElementById("lb-img");
    const lbCaption = document.getElementById("lb-caption");
    const lbClose = document.getElementById("lb-close");
    const lbPrev = document.getElementById("lb-prev");
    const lbNext = document.getElementById("lb-next");

    let current = 0;
    let lastFocused = null;

    function show(index) {
        current = (index + galleryButtons.length) % galleryButtons.length;
        const img = galleryButtons[current].querySelector("img");
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbCaption.textContent = img.alt + "  (" + (current + 1) + " of " + galleryButtons.length + ")";
    }

    function openViewer(index) {
        lastFocused = document.activeElement;
        show(index);
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
        lbClose.focus();
    }

    function closeViewer() {
        lightbox.hidden = true;
        document.body.style.overflow = "";
        if (lastFocused) lastFocused.focus();
    }

    galleryButtons.forEach((button, index) => {
        button.addEventListener("click", () => openViewer(index));
    });

    lbClose.addEventListener("click", closeViewer);
    lbPrev.addEventListener("click", () => show(current - 1));
    lbNext.addEventListener("click", () => show(current + 1));

    // click the dark background to close
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeViewer();
    });

    // keyboard: Esc closes, arrow keys move
    document.addEventListener("keydown", (event) => {
        if (lightbox.hidden) return;
        if (event.key === "Escape") closeViewer();
        if (event.key === "ArrowLeft") show(current - 1);
        if (event.key === "ArrowRight") show(current + 1);
    });

    // swipe left or right on a phone
    let touchStartX = 0;
    lightbox.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", (event) => {
        const distance = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(distance) > 50) show(current + (distance < 0 ? 1 : -1));
    }, { passive: true });
}

// ---------------------------------------------------------
// 6. CONTACT FORM: validation, counter, sending
// ---------------------------------------------------------
const form = document.getElementById("booking-form");

if (form) {
    const statusBox = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");
    const message = document.getElementById("message");
    const counter = document.getElementById("char-count");
    const dateInput = document.getElementById("date");

    // no past dates in the date picker
    if (dateInput) {
        dateInput.min = new Date().toISOString().split("T")[0];
    }

    // live character counter
    message.addEventListener("input", () => {
        counter.textContent = message.value.length + " / " + message.maxLength;
    });

    // show or clear an error under a field
    function setError(id, text) {
        const field = document.getElementById(id);
        const error = document.getElementById(id + "-error");
        if (error) error.textContent = text;
        if (field) field.setAttribute("aria-invalid", text ? "true" : "false");
    }

    function validate() {
        let valid = true;
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const text = message.value.trim();

        setError("name", name.length < 2 ? "Please enter your name." : "");
        if (name.length < 2) valid = false;

        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setError("email", emailOk ? "" : "Please enter a valid email address.");
        if (!emailOk) valid = false;

        setError("message", text.length < 10 ? "Please write at least 10 characters." : "");
        if (text.length < 10) valid = false;

        setError("consent", form.consent.checked ? "" : "Please tick the box to continue.");
        if (!form.consent.checked) valid = false;

        return valid;
    }

    function showStatus(text, type) {
        statusBox.textContent = text;
        statusBox.className = type;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        showStatus("", "");

        // spam trap: bots fill this hidden field
        if (form.website.value !== "") return;

        if (!validate()) {
            showStatus("Please fix the highlighted fields.", "error");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { Accept: "application/json" }
            });

            if (response.ok) {
                showStatus("Thank you! Your message has been sent. We will reply within 24 hours.", "success");
                form.reset();
                counter.textContent = "0 / " + message.maxLength;
            } else {
                showStatus("Something went wrong. Please try again or contact us on WhatsApp.", "error");
            }
        } catch (error) {
            showStatus("Network problem. Please check your connection and try again.", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
        }
    });
}