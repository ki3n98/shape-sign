import cv2
import mouse
import copy
import numpy as np
from screeninfo import get_monitors


class MouseMode:
    def __init__(self):
        monitors = get_monitors()
        self.monitor_width, self.monitor_height = monitors[0].width, monitors[0].height
        self.aspect_ratio = self.monitor_height/self.monitor_height


    def mouse_control(self, img, hand_landmarks):
        h, w, _ = img.shape

        index_tip = hand_landmarks[0][8]
        thumb_tip = hand_landmarks[0][4]
        middle_joint = hand_landmarks[0][11]
        pinkie_tip = hand_landmarks[0][20]
        wrist = hand_landmarks[0][0]

        move_to_x = int(self.monitor_width * index_tip[0])
        move_to_y = int(self.monitor_height * index_tip[1])

        mouse.move(move_to_x, move_to_y, absolute=True, duration=0.05)

        #draw on index tip
        cv2.circle(img, (int(index_tip[0] * w) , int(index_tip[1] * h)), 10, (255, 255, 255), cv2.FILLED )

        #click
        trigger_hold = self._distant(middle_joint, thumb_tip)

        trigger_click = self._distant(pinkie_tip, wrist)

        if trigger_click >=0.2:
            mouse.click()

        if trigger_hold <= 0.08:
            mouse.release()
        elif trigger_hold > 0.1:
            cv2.circle(img, (int(index_tip[0] * w) , int(index_tip[1] * h)), 10, (0, 255, 0), cv2.FILLED )
            mouse.press()


    def _distant(self, landmark1, landmark2):
        return np.hypot(landmark1[0] - landmark2[0], landmark1[1] - landmark2[1])

        
        
    

        