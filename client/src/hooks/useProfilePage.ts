import { ChangeEvent, useState, KeyboardEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import auth from '../config/firebase';