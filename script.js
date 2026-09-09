const invitationData = {
  date: "१४ सप्टेंबर २०२६",
  addressHtml: "साई अपार्टमेंट, पहिला मजला, रूम नं. १०२<br>चंदनबाग, कामतघर, भिवंडी",
  mapsLink: "https://maps.app.goo.gl/7waasR8gPBMjv5v5A"
};

document.addEventListener("DOMContentLoaded", function () {
  const dateText = document.getElementById("dateText");
  const addressText = document.getElementById("addressText");
  const mapButton = document.getElementById("mapButton");

  if (dateText) {
    dateText.textContent = invitationData.date;
  }

  if (addressText) {
    addressText.innerHTML = invitationData.addressHtml;
  }

  if (mapButton) {
    mapButton.href = invitationData.mapsLink;
    mapButton.target = "_blank";
    mapButton.rel = "noopener noreferrer";
  }
});

async function shareInvitation() {
  const shareData = {
    title: "सांबरी परिवार | श्री गणेशोत्सव निमंत्रण",
    text: "आमच्या घरी यंदा लाडक्या बाप्पाचे ५ दिवसांसाठी आगमन झाले आहे. या मंगल प्रसंगी बाप्पाच्या दर्शनाचा लाभ घेण्यासाठी आपण कुटुंबियांसोबत आवर्जून उपस्थित राहावे, ही नम्र विनंती.",
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
    console.log("Share cancelled or failed:", error);
  }
}
