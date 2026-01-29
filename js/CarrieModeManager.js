/* =========================================================
 🎵 8BFR MUSIC NETWORK — CarrieModeManager v1.0
 Controls Carrie AI’s mode (Professional, Developer, Relax)
========================================================= */

class CarrieModeManager {
  constructor(carrieInstance, user) {
    this.carrie = carrieInstance;
    this.user = user;
    this.currentMode = "professional";
  }

  init() {
    const savedMode = localStorage.getItem("carrie_mode");
    if (savedMode) this.setMode(savedMode);
    else this.setMode("professional");
  }

  setMode(mode) {
    this.currentMode = mode;
    localStorage.setItem("carrie_mode", mode);

    switch (mode) {
      case "professional":
        this.updateCarrie({
          outfit: "business",
          tone: "confident",
          voice: "en-US",
          accent: "filipina",
          animation: "stand",
          greeting: "Welcome back! Ready to work on your next big idea?",
          backgroundMusic: "none"
        });
        break;

      case "developer":
        if (this.user?.is_owner) {
          this.updateCarrie({
            outfit: "tech",
            tone: "neutral",
            voice: "en-US",
            accent: "filipina",
            animation: "type",
            greeting: "Developer mode activated 💼 — full system access enabled.",
            backgroundMusic: "studio"
          });
        } else {
          this.carrie.say("Sorry, developer mode is for the owner only.");
          this.setMode("professional");
        }
        break;

      case "relax":
        this.updateCarrie({
          outfit: "casual",
          tone: "friendly",
          voice: "en-US",
          accent: "filipina",
          animation: "dance",
          greeting: "Hey there~ time to unwind. Want to listen to some 8BFR vibes?",
          backgroundMusic: "lofi"
        });
        break;

      default:
        console.warn("Unknown mode:", mode);
        this.setMode("professional");
    }
  }

  updateCarrie(settings) {
    if (!this.carrie) return;
    this.carrie.setOutfit(settings.outfit);
    this.carrie.setVoice(settings.voice, settings.accent);
    this.carrie.setTone(settings.tone);
    this.carrie.playAnimation(settings.animation);
    if (settings.backgroundMusic) this.playBackgroundMusic(settings.backgroundMusic);
    this.carrie.say(settings.greeting);
  }

  playBackgroundMusic(type) {
    const tracks = {
      lofi: "/media/lofi-beat.mp3",
      studio: "/media/studio-ambience.mp3"
    };
    if (!tracks[type]) return;
    const player = new Audio(tracks[type]);
    player.volume = 0.3;
    player.loop = true;
    player.play();
  }

  attachToggleButtons() {
    document.querySelectorAll("[data-carrie-mode]").forEach(btn => {
      btn.addEventListener("click", e => {
        const mode = e.target.getAttribute("data-carrie-mode");
        this.setMode(mode);
      });
    });
  }
}

window.CarrieModeManager = CarrieModeManager;
