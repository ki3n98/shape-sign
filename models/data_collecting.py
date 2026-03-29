import cv2
import mediapipe as mp
import pandas as pd
import time

mp_hands = mp.solutions.hands
mp_draw = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)
start_time = None
total_time = 25
landmarks = []

with mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5) as hands:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)  # Flip for natural interaction
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        if results.multi_hand_landmarks:
            if start_time is None:
                print(
                    "Hand detected, timer is set for 5 second before recording landmarks."
                )
                print(f"Total recording time will be: {total_time} seconds.")
                start_time = time.time()
            idle_time = time.time() - start_time
            elasped_time = time.time() - start_time
            if elasped_time > total_time + 5:
                break
            if idle_time >= 5:
                for hand_landmarks in results.multi_hand_landmarks:
                    mp_draw.draw_landmarks(
                        frame, hand_landmarks, mp_hands.HAND_CONNECTIONS
                    )

                    # Extract (x, y, z) coordinates
                    landmark = [(lm.x, lm.y, lm.z) for lm in hand_landmarks.landmark]c
                    landmarks.append(landmark)  # Use this data for training

        cv2.imshow("Hand Tracking", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

print(len(landmarks))
label = input("Enter a label: ")
flattened_data = [
    item
    for tuple in [tuple for sublist in landmarks for tuple in sublist]
    for item in tuple
]

df = pd.read_csv("train.csv")
for i in range(0, len(flattened_data), 63):
    df = pd.concat(
        [df, pd.DataFrame([flattened_data[i : i + 63] + [label]], columns=df.columns)],
        ignore_index=True,
    )

df.to_csv(f"train_{label}.csv",index=False)


cap.release()
cv2.destroyAllWindows()
