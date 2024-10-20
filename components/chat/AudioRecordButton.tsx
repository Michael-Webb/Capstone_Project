import React, { useState, useRef, useEffect } from "react";
import { Mic, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import WaveformVisualizer from "./WaveformVisualizer";

interface ASRResponse {
  text: string;
  segments: Array<{
    id: number;
    seek: number;
    start: number;
    end: number;
    text: string;
    tokens: number[];
    temperature: number;
    avg_logprob: number;
    compression_ratio: number;
    no_speech_prob: number;
  }>;
  language: string;
}

interface AudioRecordButtonProps {
  onTranscriptionAdd: (text: string) => void;
  disabled?: boolean;
}

const AudioRecordButton: React.FC<AudioRecordButtonProps> = ({ onTranscriptionAdd, disabled = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transcription, setTranscription] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      setAudioStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = sendAudioToAPI;

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    stopMicrophone();
  };

  const stopMicrophone = () => {
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
    }
  };

  const sendAudioToAPI = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio_file", audioBlob, "recording.wav");

    try {
      const response = await fetch("/api/asr", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ASRResponse = await response.json();
      console.log("Full ASR response:", data);
      setTranscription(data.text);
    } catch (error) {
      console.error("Error sending audio to API:", error);
      setTranscription("");
    }
  };

  const handleTranscriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscription(e.target.value);
  };

  const handleAddToChat = () => {
    onTranscriptionAdd(transcription);
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    if (isRecording) {
      stopRecording();
    }
    stopMicrophone();
    setIsDialogOpen(false);
    setTranscription("");
  };

  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, []);

  return (
    <>
      <Button
        onClick={openDialog}
        variant="ghost"
        size="icon"
        className={`inline-block rounded-lg hover:text-gray-400 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        disabled={disabled}
      >
        <Mic />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audio Recording</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <WaveformVisualizer audioStream={audioStream} />
          </div>
          <div className="flex justify-center mt-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
            >
              {isRecording ? (
                <>
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>
          </div>
          <Textarea
            value={transcription}
            onChange={handleTranscriptionChange}
            placeholder="Transcription will appear here..."
            className="mt-4"
          />
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={handleCloseDialog} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleAddToChat} disabled={!transcription}>
              Add to Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AudioRecordButton;