import pandas as pd
import numpy as np
import cv2
import keyboard
import time
from tensorflow.keras.models import load_model

labels = ['I', 'I Love You', 'Yes', 'can', 'drink', 'eat', 'good', 'help',
       'hungry', 'morning', 'my', 'name', 'no', 'please', 'sorry',
       'thanks', 'thirsty', 'yes', 'you', "you're welcome"]

class PhrasesDection:
    def __init__(self):
        self.recognizer = load_model(r"C:\Users\ki3n9\OneDrive\Desktop\CSULB\hackathon\HandGestureWithLSTM\models\phrases_detection.keras")
        self.detected_phrases = None
        self.num_frames = 30
        self.frames = []
        self.current_idx = 0


    def detect(self,img, hand):
        global labels
        sample =None
            #flattened = [item for tp in hand for item in tp]
        flattened = np.array(hand).flatten()
            #flattened = [item for triple in hand for item in triple]
        
        if len(flattened) > 63:
            flattened = flattened[:63]  # Truncate if too large
        elif len(flattened) < 63:
            flattened.extend([0] * (63 - len(flattened)))
        self.frames.append(flattened)

        if len(self.frames) >= 60:
            sample = np.array(self.frames).reshape(1,60,63)
            self.frames = []
            y_pred = self.recognizer.predict(sample)
            max_idx = np.argmax(y_pred)
            max_prob = np.max(y_pred)
            if max_prob > 0.85: 
                self.detected_phrases = labels[max_idx]
                keyboard.write(self.detected_phrases)

    
    
    def show_detect(self, img):
           if self.detected_phrases:
                cv2.putText(img, f"Detect: {self.detected_phrases}", (50,100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0, 0), 2, cv2.LINE_AA)
                return self.detected_phrases