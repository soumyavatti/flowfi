"use client";

import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import type { Settings } from "@/types";

interface PomodoroWindowProps {
  onClose: () => void;
  settings: Settings;
  pomodoroCount: number;
  onUpdatePomodoroCount: (count: number) => void;
  onShowSettings: () => void;
}

export default function PomodoroWindow({
  onClose,
  settings,
  pomodoroCount,
  onUpdatePomodoroCount,
  onShowSettings,
}: PomodoroWindowProps) {
  const nodeRef = useRef(null);
  const [currentMode, setCurrentMode] = useState("pomodoro");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const particleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer durations for each mode (in seconds)
  const timerDurations = {
    pomodoro: settings.pomodoro * 60,
    shortBreak: settings.shortBreak * 60,
    longBreak: settings.longBreak * 60,
  };

  // Initialize timer
  useEffect(() => {
    setTimeLeft(timerDurations[currentMode as keyof typeof timerDurations]);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current);
      }
    };
  }, [currentMode, settings]);

  // Request notification permission on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (
        Notification.permission !== "granted" &&
        Notification.permission !== "denied"
      ) {
        Notification.requestPermission();
      }
    }
  }, []);

  // Toggle timer start/pause
  const toggleTimer = () => {
    if (isTimerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  // Start the timer
  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);

      // Start the timer interval
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current as NodeJS.Timeout);
            timerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start particle animation
      if (currentMode === "pomodoro") {
        startParticleAnimation();
      }
    }
  };

  // Pause the timer
  const pauseTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current);
      }
    }
  };

  // Reset the timer
  const resetTimer = () => {
    pauseTimer();
    setTimeLeft(timerDurations[currentMode as keyof typeof timerDurations]);
  };

  // Timer completed
  const timerComplete = () => {
    setIsTimerRunning(false);

    // Play sound
    if (settings.soundEnabled) {
      playTimerEndSound();
    }

    // Show notification
    displayNotification();

    // Update pomodoro count and progress dots
    if (currentMode === "pomodoro") {
      const newCount = pomodoroCount + 1;
      onUpdatePomodoroCount(newCount);

      // After 4 pomodoros, take a long break
      if (newCount % 4 === 0) {
        setNotificationMessage("Great job! Time for a long break.");
        changeTimerMode("longBreak");
      } else {
        setNotificationMessage("Pomodoro completed! Take a short break.");
        changeTimerMode("shortBreak");
      }
    } else {
      // After a break, go back to pomodoro
      setNotificationMessage("Break is over. Time to focus!");
      changeTimerMode("pomodoro");
    }
  };

  // Display notification
  const displayNotification = () => {
    // Show in-app notification
    const message =
      currentMode === "pomodoro"
        ? "Time for a break!"
        : "Break is over, back to work!";
    setNotificationMessage(message);
    setShowNotification(true);

    // Hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);

    // Show browser notification
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        const title =
          currentMode === "pomodoro"
            ? "Time for a break!"
            : "Break is over, back to work!";

        new Notification("Lowkey Lofi Timer", {
          body: title,
          icon: "/favicon.ico",
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            displayNotification();
          }
        });
      }
    }
  };

  // Change timer mode (pomodoro/shortBreak/longBreak)
  const changeTimerMode = (mode: string) => {
    // Reset timer
    pauseTimer();

    // Update mode
    setCurrentMode(mode);
    setTimeLeft(timerDurations[mode as keyof typeof timerDurations]);
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Play timer end sound
  const playTimerEndSound = () => {
    let soundUrl;

    // Pick sound URL based on theme
    switch (settings.soundTheme) {
      case "digital":
        soundUrl =
          "https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3";
        break;
      case "nature":
        soundUrl =
          "https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3";
        break;
      default: // minimal
        soundUrl =
          "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-alert-248.mp3";
    }

    const audio = new Audio(soundUrl);
    audio.play();
  };
  const totalTime = timerDurations[currentMode as keyof typeof timerDurations];
  // Start particle animation for pomodoro timer
  const startParticleAnimation = () => {
    if (!isTimerRunning && currentMode !== "pomodoro") return;

    const createParticle = () => {
      const container = document.getElementById("particles-container");
      if (!container) return;

      // Create particle
      const particle = document.createElement("div");
      particle.className = "particle";

      // Random position along the bottom
      const posX = Math.random() * 100;
      particle.style.left = `${posX}%`;

      // Random size
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Random duration
      const duration = Math.random() * 2 + 2;
      particle.style.setProperty("--duration", `${duration}s`);

      // Add to container
      container.appendChild(particle);

      // Remove after animation completes
      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    };

    // Create initial particle
    createParticle();

    // Create particles at intervals
    particleIntervalRef.current = setInterval(() => {
      if (isTimerRunning && currentMode === "pomodoro") {
        createParticle();
      }
    }, 300);
  };

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        bounds="parent"
        defaultPosition={{ x: 20, y: 20 }}
      >
        <div
          ref={nodeRef}
          id="pomodoro-window"
          className="mini-window w-[90vw] md:w-[320px] bg-[rgba(0, 0, 0, 0.8)] text-white rounded-2xl p-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:absolute md:top-5 md:right-5 md:left-auto md:translate-y-0 z-[9999] backdrop-blur-md border border-white/10 shadow-md select-none cursor-move"
        >
          <div className="header flex justify-between items-center mb-2.5 cursor-move">
            <div className="header-left flex items-center">
              <div className="app-title text-lg font-medium">
                Smart Focus Timer
              </div>
            </div>
            <div
              className="close-btn text-base cursor-pointer"
              onClick={onClose}
              
            >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            </div>
          </div>
        {/* Add a horizontal seperator*/}
        <div className="w-full h-px bg-white/20 mb-4" />

        {/* Timer Tabs */}
        <div className="timer-tabs flex justify-center items-center gap-1 mt-6">
  <button
    className={`px-3 py-1.5 rounded-full text-sm transition-all whitespace-nowrap ${
      currentMode === "pomodoro"
        ? "bg-white/30 text-white font-semibold"
        : "bg-transparent text-white/60 hover:bg-white/10"
    }`}
    onClick={() => changeTimerMode("pomodoro")}
  >
    Smart Time
  </button>

  <button
    className={`px-3 py-1.5 rounded-full text-sm transition-all whitespace-nowrap ${
      currentMode === "shortBreak"
        ? "bg-white/30 text-white font-semibold"
        : "bg-transparent text-white/60 hover:bg-white/10"
    }`}
    onClick={() => changeTimerMode("shortBreak")}
  >
    Short Break
  </button>

  <button
    className={`px-3 py-1.5 rounded-full text-sm transition-all whitespace-nowrap ${
      currentMode === "longBreak"
        ? "bg-white/30 text-white font-semibold"
        : "bg-transparent text-white/60 hover:bg-white/10"
    }`}
    onClick={() => changeTimerMode("longBreak")}
  >
    Long Break
  </button>
</div>


        {/* Timer Display with Circular Progress */}
        <div className="relative w-[160px] h-[160px] mx-auto mb-6 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90">
            <circle
            cx="80"
            cy="80"
            r="70"
            stroke="#ffffff"
            strokeWidth="10"
            fill="none"
            />
            <circle
            cx="80"
            cy="80"
            r="70"
            stroke="#F7AD19"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={
                (1 - timeLeft / totalTime) * (2 * Math.PI * 70)
            }
            className="transition-all duration-1000 ease-linear"
            />
        </svg>

        {/* Timer Text */}
        <div className="relative z-10 text-white font-[Poppins] font-bold text-[32px] leading-[28px] text-center">
            {formatTime(timeLeft)}
        </div>
        </div>

          {/* Timer Controls (New Design) */}
            <div className="relative flex justify-center mb-6">
            <div className="flex items-center justify-between bg-white/35 rounded-full px-4 h-12 w-48 backdrop-blur-sm">
                {/* Reset Button */}
                <button onClick={resetTimer} className="flex items-center justify-center w-6 h-6">
                <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                role="img"
                aria-label="Reset Timer"
                >
                <title>Reset Timer</title>
                <polyline points="1 4 1 10 7 10" />
                <polyline points="23 20 23 14 17 14" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
                </button>

                {/* Divider */}
                <div className="w-px h-5 bg-white/30"></div>

                {/* Start/Pause */}
                <button
                onClick={toggleTimer}
                className="flex items-center gap-1 text-white text-sm font-medium"
                >
                {/* Small Square */}
                <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
                {isTimerRunning ? "Pause" : "Start"}
                </button>

                {/* Divider */}
                <div className="w-px h-5 bg-white/30"></div>

                {/* Settings */}
                <button onClick={onShowSettings} className="flex items-center justify-center w-6 h-6">
                <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 
                    2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 
                    1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 
                    2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4 
                    a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 
                    2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 
                    .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 
                    0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 
                    0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06 
                    a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06 
                    a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 
                    0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 
                    0 0 1 2 2v.09a1.65 1.65 0 0 0 1 
                    1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 
                    a2 2 0 0 1 2.83 0 2 2 0 0 1 0 
                    2.83l-.06.06a1.65 1.65 0 0 0-.33 
                    1.82V9a1.65 1.65 0 0 0 1.51 
                    1H21a2 2 0 0 1 2 2 2 2 
                    0 0 1-2 2h-.09a1.65 1.65 
                    0 0 0-1.51 1z"></path>
                </svg>
                </button>
            </div>
            </div>


        </div>
      </Draggable>

      {/* Timer Notification Popup */}
      {showNotification && (
        <div className="fixed top-4 right-4 left-4 md:left-auto md:w-80 bg-purple-500 text-white p-4 rounded-lg shadow-lg z-[999999] animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span className="font-medium">{notificationMessage}</span>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
