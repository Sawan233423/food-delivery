import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Volume2, Sparkles, ArrowRight } from 'lucide-react';

export const VoiceSearchModal = ({ isOpen, onClose, onSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const recognitionRef = useRef(null);

  // Suggested quick speech prompts for testing
  const suggestions = [
    'Biryani',
    'Margherita Pizza',
    'Chicken Kathi Roll',
    'Peri Peri Fries',
    'Hakka Noodles',
    'Acai Bowl',
    'Burger'
  ];

  // Initialize Web Speech API
  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      setIsListening(false);
      setTranscript('');
      setErrorMessage(null);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Speech recognition is not supported by your browser. You can click any suggestion below to test.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Optimized for Indian English / terms like Biryani, Paneer

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access denied. Please allow microphone in browser or tap any dish below.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('No speech detected. Please speak closer to microphone or try again.');
        } else {
          setErrorMessage(`Error: ${event.error}. You can also pick a dish below.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (startErr) {
        console.warn('Speech recognition start note:', startErr);
      }
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setErrorMessage('Could not activate microphone. Tap any dish suggestion below to search.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApplySearch = (textToSearch, event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const query = textToSearch || transcript;
    if (!query || !query.trim()) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    onSearch(query.trim());
    onClose();
  };

  const toggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
    } else {
      setTranscript('');
      setErrorMessage(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Mic start error:', e);
        }
      }
    }
  };


  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 animate-slide-up relative text-center">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 flex items-center justify-center transition-colors border border-slate-200"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mic Pulse Graphic */}
        <div className="relative my-6 flex items-center justify-center">
          {/* Animated pulse rings when listening */}
          {isListening && (
            <>
              <div className="absolute w-28 h-28 rounded-full bg-orange-500/20 animate-ping" />
              <div className="absolute w-36 h-36 rounded-full bg-orange-500/10 animate-pulse" />
            </>
          )}

          <button
            type="button"
            onClick={toggleMic}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
              isListening
                ? 'bg-gradient-to-tr from-orange-600 to-amber-500 scale-110 shadow-orange-500/40 ring-4 ring-orange-500/20'
                : 'bg-slate-800 hover:bg-slate-700 shadow-slate-900/30'
            }`}
          >
            {isListening ? (
              <Mic className="w-9 h-9 animate-bounce" />
            ) : (
              <MicOff className="w-8 h-8 text-slate-300" />
            )}
          </button>
        </div>

        {/* Status Heading */}
        <h3 className="text-xl font-extrabold text-slate-900 font-display">
          {isListening ? 'Listening...' : 'Tap Mic to Speak'}
        </h3>
        
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto font-medium">
          {isListening 
            ? 'Say dish name or restaurant (e.g. "Biryani", "Pizza", "Hakka Noodles")'
            : 'Click microphone button above to start voice speech recognition'}
        </p>

        {/* Live Detected Transcript Box */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 min-h-[64px] flex items-center justify-center">
          {transcript ? (
            <p className="font-bold text-base text-slate-900 font-display animate-fade-in">
              "{transcript}"
            </p>
          ) : (
            <span className="text-xs text-slate-400 italic">
              {isListening ? 'Speak now into your microphone...' : 'Waiting for voice input...'}
            </span>
          )}
        </div>

        {/* Error / Permission Warning */}
        {errorMessage && (
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2.5 mt-3 text-left">
            ⚠️ {errorMessage}
          </p>
        )}

        {/* Action Button if speech detected */}
        {transcript && (
          <button
            type="button"
            onClick={(e) => handleApplySearch(transcript, e)}
            className="mt-4 w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm py-3 rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Search "{transcript}"</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Quick Voice Suggestions Chips */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-left">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Or tap popular voice dish:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={(e) => handleApplySearch(item, e)}
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-slate-200/70 px-3 py-1.5 rounded-xl transition-all"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
