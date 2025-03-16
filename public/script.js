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

  document
    .getElementById("convert")
    .addEventListener("click", async function () {
      let text = document.getElementById("text-input").value;
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
              voice: { languageCode: "hi-IN", name: "hi-IN-Chirp3-HD-Charon" },
              audioConfig: { audioEncoding: "MP3" },
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