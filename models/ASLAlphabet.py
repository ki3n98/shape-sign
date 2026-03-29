import pandas as pd
import numpy as np
import cv2
import keyboard
import time
from tensorflow.keras.models import load_model

labels = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

class ASLAlphabet:
    def __init__(self):
        self.recognizer = load_model(r"C:\Users\ki3n9\OneDrive\Desktop\CSULB\hackathon\HandGestureWithLSTM\models\test_model_NN5.keras")
        self.detected_char = None
        self.prev_time = time.time()


    def detect(self,img, hands_lm):
        flattened = np.array(hands_lm[0]).flatten()
        df = pd.read_csv(r"C:\Users\ki3n9\OneDrive\Desktop\CSULB\hackathon\HandGestureWithLSTM\train.csv").drop("label",axis=1)
        df_temp = pd.DataFrame([flattened],columns=df.columns)
        y_pred = self.recognizer.predict(df_temp)
        max_idx = np.argmax(y_pred)

        cv2.putText(img, f"Detect: {labels[max_idx]}", (50,100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0, 0), 2, cv2.LINE_AA)
        
        self.detected_char = labels[max_idx]

        self.output_detected_char()

        return self.detected_char
    
    def output_detected_char(self):
        time.time()
        if time.time() - self.prev_time >= 1.5:
            self.prev_time = time.time()
            keyboard.write(self.detected_char)
