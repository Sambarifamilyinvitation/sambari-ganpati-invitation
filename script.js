const invitationData = {
  date: "१४ सप्टेंबर २०२६",
  addressHtml: "साई अपार्टमेंट, पहिला मजला, रूम नं. १०२<br>चंदनबाग, कामतघर, भिवंडी",
  mapsLink: "https://maps.app.goo.gl/zy4BiqpPZ2S2hnPbA?g_st=ac"
};

document.addEventListener("DOMContentLoaded", () => {

  // Ancient seal opening screen
  const ancientGate = document.getElementById("ancientGate");
  const openInvitation = document.getElementById("openInvitation");

  function revealInvitation() {
    if (!ancientGate || ancientGate.classList.contains("opened")) return;

    ancientGate.classList.add("opened");

    // Release scrolling slightly before the parchment animation finishes
    window.setTimeout(() => {
      document.body.classList.remove("intro-lock");
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 760);

    // Remove the overlay after animation so it never interferes with scrolling
    window.setTimeout(() => {
      ancientGate.setAttribute("aria-hidden", "true");
    }, 1500);
  }

  if (openInvitation) {
    openInvitation.addEventListener("click", revealInvitation);
  }

  // Also allow tapping the parchment around the seal.
  if (ancientGate) {
    ancientGate.addEventListener("click", (event) => {
      if (event.target.closest(".ancient-seal-button")) return;
      revealInvitation();
    });
  }

  const dateText = document.getElementById("dateText");
  const addressText = document.getElementById("addressText");
  const mapButton = document.getElementById("mapButton");

  if (dateText) dateText.textContent = invitationData.date;
  if (addressText) addressText.innerHTML = invitationData.addressHtml;

  if (mapButton) {
    mapButton.href = invitationData.mapsLink;
    mapButton.target = "_blank";
    mapButton.rel = "noopener noreferrer";
  }

  const revealElements = document.querySelectorAll(".reveal-3d");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("visible", entry.isIntersecting);
      });
    },
    { threshold: 0.28 }
  );

  revealElements.forEach((el) => observer.observe(el));

  document.querySelectorAll(".next-arrow").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.next);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const depthLayers = document.querySelectorAll(".depth-layer");

  depthLayers.forEach((layer) => {
    layer.addEventListener("pointermove", (event) => {
      const rect = layer.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      layer.style.transform =
        `perspective(800px)
         rotateX(${y * -8}deg)
         rotateY(${x * 10}deg)
         translateZ(16px)`;
    });

    layer.addEventListener("pointerleave", () => {
      layer.style.transform =
        "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    });
  });

  const templePhoto = document.querySelector(".temple-photo");
  const cards = document.querySelectorAll(".glass-card");

  let ticking = false;

  function updateScrollMotion() {
    const scrollY = window.scrollY;
    const viewport = window.innerHeight || 1;

    if (templePhoto) {
      const bgShift = (scrollY / viewport) * 18;
      const bgScale = 1.08 + Math.min(scrollY / (viewport * 20), 0.025);
      templePhoto.style.transform =
        `translate3d(0, ${bgShift}px, 0) scale(${bgScale})`;
    }

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = (center - viewport / 2) / viewport;
      const rotateX = Math.max(-6, Math.min(6, distance * -7));
      const translateZ = Math.max(-55, -Math.abs(distance) * 70);

      if (card.classList.contains("visible")) {
        card.style.transform =
          `perspective(1200px)
           rotateX(${rotateX}deg)
           translateZ(${translateZ}px)
           scale(${1 - Math.min(Math.abs(distance) * 0.035, 0.035)})`;
      }
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollMotion);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateScrollMotion();
});

async function shareInvitation() {
  const shareData = {
    title: "सांबारी परिवार | श्री गणेशोत्सव निमंत्रण",
    text: "आमच्या घरी यंदा लाडक्या बाप्पाचे ५ दिवसांसाठी आगमन झाले आहे. या मंगल प्रसंगी बाप्पाच्या दर्शनाचा लाभ घेण्यासाठी आपण कुटुंबियांसोबत आवर्जून उपस्थित राहावे, ही नम्र विनंती.",
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(window.location.href);
      alert("निमंत्रणाची लिंक कॉपी झाली आहे.");
      return;
    }

    alert("कृपया वेबसाइटची लिंक कॉपी करून शेअर करा.");
  } catch (error) {
    console.log("Share cancelled or failed:", error);
  }
}
