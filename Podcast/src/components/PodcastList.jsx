import { useEffect, useState } from 'react';
import '../App.css';


const API_BASE_URL = 'https://podcast-api.netlify.app';
const SHOWS_URL = `${API_BASE_URL}/shows`;