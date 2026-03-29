from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
import numpy as np
import cv2

class VolumeMode:

    def __init__(self):
        devices = AudioUtilities.GetSpeakers()
        interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
        self.volume = cast(interface, POINTER(IAudioEndpointVolume))

    
    def set_volume(self,img,  hand_landmarks):
        thumb_tip = hand_landmarks[0][4]
        index_tip = hand_landmarks[0][8]

        h, w, _ = img.shape

        x1, y1 = int(thumb_tip[0] * w), int(thumb_tip[1] * h)
        x2, y2 = int(index_tip[0] * w), int(index_tip[1] * h)

        cv2.line(img, (x1, y1), (x2, y2), (255, 0, 255), 3)
        cv2.circle(img, (x1, y1), 8, (255,0,255), cv2.FILLED)
        cv2.circle(img, (x2, y2), 8, (255,0,255), cv2.FILLED)

        # Calculate the distance between thumb and index finger
        distance = np.sqrt(
            (thumb_tip[0] - index_tip[0]) ** 2
            + (thumb_tip[1] - index_tip[1]) ** 2
            + (thumb_tip[2] - index_tip[2]) ** 2
        )

        # Map the distance to a volume level
        min_distance = 0.05  # Adjust this value as needed
        max_distance = 0.3  # Adjust this value as needed
        min_volume = self.volume.GetVolumeRange()[0]
        max_volume = self.volume.GetVolumeRange()[1]

        # Normalize the distance to the volume range
        volume_level = np.interp(
            distance, [min_distance, max_distance], [min_volume, max_volume]
        )
        
        cv2.putText(img, f"{int((volume_level + 65.25)/ 65.25 * 100)}%", (40, 450), cv2.FONT_HERSHEY_PLAIN, 2, (255, 255, 255), 2)
        self.volume.SetMasterVolumeLevel(volume_level, None)