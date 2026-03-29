import cv2
import mediapipe as mp
import pandas as pd
import time
import os

import HandDetector
import VolumeMode
import MouseMode
import Recognizer
import ASLAlphabet
import PhrasesDectection

if __name__ == "__main__":
    cap = cv2.VideoCapture(0)
    detector = HandDetector.HandDetector()
    volume = VolumeMode.VolumeMode()
    mouse = MouseMode.MouseMode()
    alphabet = ASLAlphabet.ASLAlphabet()
    phrases = PhrasesDectection.PhrasesDection()
    recognizer = Recognizer.Recognizer(".\data_modes\\rf_guesture_mode.sav")

    frame_count = 0
    prev_gesture = ""
    mode = "neutral"
    pTime = 0
    interval = 1
    start_time = None
    end_time = None
    label = None


    while cap.isOpened():
        #initialize
        success, img = cap.read()
        img = cv2.flip(img, 1)

        #detect hand
        hands_lm = detector.find_hand(img)
        detector.draw_hands(img)

        if hands_lm:
            #predict hand
            hand_gesture = recognizer.detect(hands_lm)

            #get into gesture mode
            if hand_gesture == prev_gesture:
                frame_count += 1 
            else: 
                frame_count = 0
                prev_gesture = hand_gesture

            if frame_count == 5 and mode == "neutral":
                frame_count = 0
                mode = hand_gesture

    
            #process mode
            match mode: 
                case "alphabet":
                    if start_time is None:
                        start_time = time.time()

                    end_time = time.time()
                    if end_time - start_time >= interval:
                        start_time = end_time
                        label = alphabet.detect(img,hands_lm)
                case "phrase": 
                    for hand in hands_lm:
                        phrases.detect(img, hand)
                        label = phrases.show_detect(img)
                case "volume_gesture": 
                    volume.set_volume(img, hands_lm)
                case "mouse_gesture": 
                    mouse.mouse_control(img, hands_lm)
                case "neutral": 
                    print("In Neutral.")
        else:
            mode = "neutral"

        #calculate fps and display
        cTime = time.time()
        fps = 1/(cTime-pTime)
        pTime = cTime
        cv2.putText(img, str(int(fps)) , (40,70), cv2.FONT_HERSHEY_PLAIN, 1, (255,255,255), 1 )
        cv2.putText(img, f"Detect: {label}", (50,100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0, 0), 2, cv2.LINE_AA)


        #display current mode
        cv2.putText(img, f"Mode: {mode}", (50,50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0, 0), 2, cv2.LINE_AA)

        cv2.imshow("Hand tracking", img)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
            
    cap.release()
    cv2.destroyAllWindows()

    
