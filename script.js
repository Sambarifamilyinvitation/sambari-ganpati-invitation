document.addEventListener("DOMContentLoaded", () => {
  const gate = document.getElementById("openingGate");
  const openButton = document.getElementById("openInvitation");

  function openInvitation() {
    if (!gate || gate.classList.contains("opened")) return;
    gate.classList.add("opened");

    setTimeout(() => {
      document.body.classList.remove("intro-lock");
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 720);

    setTimeout(() => {
      gate.setAttribute("aria-hidden", "true");
    }, 1500);
  }

  if (openButton) openButton.addEventListener("click", openInvitation);
  if (gate) {
    gate.addEventListener("click", (e) => {
      if (e.target.closest(".seal-button")) return;
      openInvitation();
    });
  }

  document.querySelectorAll(".scroll-cue").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.next);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("visible", entry.isIntersecting);
    });
  }, { threshold: 0.24 });

  reveals.forEach((el) => observer.observe(el));

  const depthLayers = document.querySelectorAll(".depth-layer");
  depthLayers.forEach((layer) => {
    layer.addEventListener("pointermove", (event) => {
      const rect = layer.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      layer.style.transform = `perspective(800px) rotateX(${y * -7}deg) rotateY(${x * 9}deg) translateZ(14px)`;
    });
    layer.addEventListener("pointerleave", () => {
      layer.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    });
  });

  // Subtle parallax for the real Tirupati image.
  const temple = document.querySelector(".temple-bg-image");
  let ticking = false;
  function updateTemple() {
    if (!temple) return;
    const y = Math.min(window.scrollY * 0.035, 42);
    const scale = 1.04 + Math.min(window.scrollY / 50000, 0.025);
    temple.style.transform = `translate(-50%, calc(-50% + ${y}px)) scale(${scale})`;
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateTemple);
      ticking = true;
    }
  }, { passive: true });
  updateTemple();

  const shareButton = document.getElementById("shareButton");
  if (shareButton) {
    shareButton.addEventListener("click", async () => {
      const shareData = {
        title: "सांबारी परिवार | श्री गणेशोत्सव २०२६",
        text: "आमच्या घरी लाडक्या बाप्पाचे ६ दिवसांसाठी आगमन होत आहे. श्रींच्या दर्शनासाठी आपण कुटुंबियांसह आवर्जून उपस्थित राहावे.",
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(window.location.href);
          alert("निमंत्रणाची लिंक कॉपी झाली आहे.");
        } else {
          alert("कृपया वेबसाइटची लिंक कॉपी करून शेअर करा.");
        }
      } catch (error) {
        console.log("Share cancelled:", error);
      }
    });
  }
});
