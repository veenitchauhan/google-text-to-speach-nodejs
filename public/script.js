document.addEventListener("DOMContentLoaded", async function () {
  // Fetch config from server
  let projectID, accessToken;
  try {
    const response = await fetch("/config");
    const config = await response.json();
    projectID = config.projectId;
    accessToken = config.accessToken;
  } catch (error) {
    console.error("Error fetching config:", error);
    alert("Failed to load configuration. Check server setup.");
    return;
  }

  const speedInput = document.getElementById("speed-input");
  const speedValue = document.getElementById("speed-value");
  const maleVoiceSelect = document.getElementById("male-voice-select");
  const femaleVoiceSelect = document.getElementById("female-voice-select");
  const standardVoiceCheckbox = document.getElementById("standard-voice");
  const wavenetVoiceCheckbox = document.getElementById("wavenet-voice");
  const neural2VoiceCheckbox = document.getElementById("neural2-voice");
  const polyglotVoiceCheckbox = document.getElementById("polyglot-voice");
  const chirpHdVoiceCheckbox = document.getElementById("chirp-hd-voice");
  const studioVoiceCheckbox = document.getElementById("studio-voice");

  // Restore checkbox states from localStorage
  standardVoiceCheckbox.checked = localStorage.getItem("standardVoiceCheckbox") === "true";
  wavenetVoiceCheckbox.checked = localStorage.getItem("wavenetVoiceCheckbox") === "true";
  neural2VoiceCheckbox.checked = localStorage.getItem("neural2VoiceCheckbox") === "true";
  polyglotVoiceCheckbox.checked = localStorage.getItem("polyglotVoiceCheckbox") === "true";
  chirpHdVoiceCheckbox.checked = localStorage.getItem("chirpHdVoiceCheckbox") === "true";
  studioVoiceCheckbox.checked = localStorage.getItem("studioVoiceCheckbox") === "true";

  // Save checkbox states to localStorage
  standardVoiceCheckbox.addEventListener("change", function () {
    localStorage.setItem("standardVoiceCheckbox", standardVoiceCheckbox.checked);
    fetchVoices();
    toggleVoiceDropdowns();
  });
  wavenetVoiceCheckbox.addEventListener("change", function () {
    localStorage.setItem("wavenetVoiceCheckbox", wavenetVoiceCheckbox.checked);
    fetchVoices();
    toggleVoiceDropdowns();
  });
  neural2VoiceCheckbox.addEventListener("change", function () {
    localStorage.setItem("neural2VoiceCheckbox", neural2VoiceCheckbox.checked);
    fetchVoices();
    toggleVoiceDropdowns();
  });
  polyglotVoiceCheckbox.addEventListener("change", function () {
    localStorage.setItem("polyglotVoiceCheckbox", polyglotVoiceCheckbox.checked);
    fetchVoices();
    toggleVoiceDropdowns();
  });
  chirpHdVoiceCheckbox.addEventListener("change", function () {
    localStorage.setItem("chirpHdVoiceCheckbox", chirpHdVoiceCheckbox.checked);
    fetchVoices();
    toggleVoiceDropdowns();
  });
  studioVoiceCheckbox.addEventListener("change", function () {
    localStorage.setItem("studioVoiceCheckbox", studioVoiceCheckbox.checked);
    fetchVoices();
    toggleVoiceDropdowns();
  });

  speedInput.addEventListener("input", function () {
    speedValue.textContent = speedInput.value;
  });

  // Add default empty options
  const defaultMaleOption = document.createElement("option");
  defaultMaleOption.value = "";
  defaultMaleOption.textContent = "--Select Male--";
  maleVoiceSelect.appendChild(defaultMaleOption);

  const defaultFemaleOption = document.createElement("option");
  defaultFemaleOption.value = "";
  defaultFemaleOption.textContent = "--Select Female--";
  femaleVoiceSelect.appendChild(defaultFemaleOption);

  // Function to format voice names
  function formatVoiceName(name) {
    return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/-/g, ' ');
  }

  // Function to toggle visibility of voice dropdowns
  function toggleVoiceDropdowns() {
    const anyChecked = standardVoiceCheckbox.checked || wavenetVoiceCheckbox.checked || neural2VoiceCheckbox.checked || polyglotVoiceCheckbox.checked || chirpHdVoiceCheckbox.checked || studioVoiceCheckbox.checked;
    if (anyChecked) {
      document.getElementById("male-voice-select").parentElement.style.display = "block";
      document.getElementById("female-voice-select").parentElement.style.display = "block";
      document.getElementById("speed-value").parentElement.classList.remove("offset-4");
    } else {
      document.getElementById("male-voice-select").parentElement.style.display = "none";
      document.getElementById("female-voice-select").parentElement.style.display = "none";
      document.getElementById("speed-value").parentElement.classList.add("offset-4");
    }
  }

  // Fetch available voices
  async function fetchVoices() {
    try {
      const response = await fetch(
        "https://texttospeech.googleapis.com/v1/voices",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "x-goog-user-project": projectID,
          },
        }
      );
      const data = await response.json();
      console.log("Fetched voices:", data.voices); // Log the fetched voices

      const maleVoices = data.voices.filter(voice => 
        (voice.languageCodes.includes("hi-IN") || voice.languageCodes.includes("en-US")) && 
        voice.ssmlGender === "MALE" && 
        ((standardVoiceCheckbox.checked && !voice.name.includes("Wavenet") && !voice.name.includes("Neural2") && !voice.name.includes("Polyglot") && !voice.name.includes("Chirp") && !voice.name.includes("Studio") && !voice.name.includes("Casual") && !voice.name.includes("News")) || 
        (wavenetVoiceCheckbox.checked && voice.name.includes("Wavenet")) ||
        (neural2VoiceCheckbox.checked && voice.name.includes("Neural2")) ||
        (polyglotVoiceCheckbox.checked && voice.name.includes("Polyglot")) ||
        (chirpHdVoiceCheckbox.checked && voice.name.includes("Chirp")) ||
        (studioVoiceCheckbox.checked && voice.name.includes("Studio")))
      );

      const femaleVoices = data.voices.filter(voice => 
        (voice.languageCodes.includes("hi-IN") || voice.languageCodes.includes("en-US")) && 
        voice.ssmlGender === "FEMALE" && 
        ((standardVoiceCheckbox.checked && !voice.name.includes("Wavenet") && !voice.name.includes("Neural2") && !voice.name.includes("Polyglot") && !voice.name.includes("Chirp") && !voice.name.includes("Studio") && !voice.name.includes("Casual") && !voice.name.includes("News")) || 
        (wavenetVoiceCheckbox.checked && voice.name.includes("Wavenet")) ||
        (neural2VoiceCheckbox.checked && voice.name.includes("Neural2")) ||
        (polyglotVoiceCheckbox.checked && voice.name.includes("Polyglot")) ||
        (chirpHdVoiceCheckbox.checked && voice.name.includes("Chirp")) ||
        (studioVoiceCheckbox.checked && voice.name.includes("Studio")))
      );

      maleVoiceSelect.innerHTML = "";
      femaleVoiceSelect.innerHTML = "";

      maleVoiceSelect.appendChild(defaultMaleOption);
      femaleVoiceSelect.appendChild(defaultFemaleOption);

      maleVoices.forEach(voice => {
        const option = document.createElement("option");
        option.value = JSON.stringify({ name: voice.name, languageCode: voice.languageCodes[0] });
        option.textContent = formatVoiceName(voice.name); // Format the voice name
        maleVoiceSelect.appendChild(option);
      });

      femaleVoices.forEach(voice => {
        const option = document.createElement("option");
        option.value = JSON.stringify({ name: voice.name, languageCode: voice.languageCodes[0] });
        option.textContent = formatVoiceName(voice.name); // Format the voice name
        femaleVoiceSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching voices:", error);
      alert("Failed to load voices. Check server setup.");
    }
  }

  fetchVoices();
  toggleVoiceDropdowns();

  document
    .getElementById("convert")
    .addEventListener("click", async function () {
      let text = document.getElementById("text-input").value;
      let speed = parseFloat(speedInput.value);
      let voice;
      if (maleVoiceSelect.value) {
        voice = JSON.parse(maleVoiceSelect.value);
      } else if (femaleVoiceSelect.value) {
        voice = JSON.parse(femaleVoiceSelect.value);
      } else {
        alert("Please select a voice");
        return;
      }
      if (!text) {
        alert("Please enter some text");
        return;
      }
      if (!projectID || !accessToken || accessToken === "Token not available") {
        alert("Server configuration is missing project ID or access token");
        return;
      }

      // Hide audio section and show loading spinner
      const audioSection = document.getElementById("audio-section");
      const loadingSpinner = document.getElementById("loading-spinner");
      audioSection.style.display = "none";
      loadingSpinner.style.display = "block";

      try {
        const response = await fetch(
          "https://texttospeech.googleapis.com/v1/text:synthesize",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "x-goog-user-project": projectID,
            },
            body: JSON.stringify({
              input: { text: text },
              voice: { name: voice.name, languageCode: voice.languageCode },
              audioConfig: { audioEncoding: "MP3", speakingRate: speed },
            }),
          }
        );
        const data = await response.json();
        if (data.error) {
          alert(data.error.message);
          return;
        }
        let audioData = data.audioContent;
        let byteCharacters = atob(audioData);
        let arrayBuffer = new ArrayBuffer(byteCharacters.length);
        let uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteCharacters.length; i++) {
          uint8Array[i] = byteCharacters.charCodeAt(i);
        }
        let blob = new Blob([uint8Array], { type: "audio/mpeg" });
        let audioPlayer = document.getElementById("audio-player");
        let url = URL.createObjectURL(blob);
        audioPlayer.src = url;
        document.getElementById("download").href = url;
        document.getElementById("download").download = "speech.mp3";
        audioSection.style.display = "block";
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred");
      } finally {
        loadingSpinner.style.display = "none";
      }
    });
});