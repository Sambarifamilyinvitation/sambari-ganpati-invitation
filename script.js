const invitationData = {
  date: "१४ सप्टेंबर २०२६",
  addressHtml: "साई अपार्टमेंट, पहिला मजला, रूम नं. १०२<br>चंदनबाग, कामतघर, भिवंडी",
  mapsLink: "https://maps.app.goo.gl/zy4BiqpPZ2S2hnPbA?g_st=ac"
};

document.addEventListener("DOMContentLoaded", () => {
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

  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.28 }
  );

  revealElements.forEach((el) => observer.observe(el));

  document.querySelectorAll(".scroll-next").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  const interactiveCards = document.querySelectorAll(".tilt, .parallax-card");

  interactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        `perspective(700px) rotateX(${py * -8}deg) rotateY(${px * 10}deg) translateZ(8px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform =
        "perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    });
  });
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
