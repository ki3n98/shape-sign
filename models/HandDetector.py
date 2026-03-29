import cv2
import mediapipe as mp
import pandas as pd
import time
import copy

mp_hands = mp.solutions.hands
mp_draw = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)
start_time = None
landmarks = []

class HandDetector: 

    def __init__(self, detection_confidence = 0.5, max_hands=2, track_confidence=0.5):
        """Initialize mediapipe with parameters."""
        
        self.landmarks = []
        self.hands = mp_hands.Hands(min_detection_confidence=detection_confidence, min_tracking_confidence=track_confidence)
        self.results = None



    def find_hand(self,img):
        rgb_frame = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.hands.process(rgb_frame)
        landmarks = []
        if self.results.multi_hand_landmarks:
            for hand_landmarks in self.results.multi_hand_landmarks:
                landmark = [(lm.x, lm.y, lm.z) for lm in hand_landmarks.landmark]
                landmarks.append(landmark)

        return landmarks

    
    def draw_hands(self,img):
        if self.results.multi_hand_landmarks:
            for hand_landmarks in self.results.multi_hand_landmarks:
                    mp_draw.draw_landmarks(
                        img, hand_landmarks, mp_hands.HAND_CONNECTIONS
                    )