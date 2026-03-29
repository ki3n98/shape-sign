import os
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

import pickle

class Recognizer:

    def __init__(self, file_directory):    
        self.recognizer = pickle.load(open(file_directory, 'rb'))

    def detect(self, hands):
        flattened = np.array(hands[0]).flatten()

        flattened = flattened.reshape(1, -1)

        return self.recognizer.predict(flattened)[0]


