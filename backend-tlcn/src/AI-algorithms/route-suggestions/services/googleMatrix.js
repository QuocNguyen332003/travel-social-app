import axios from 'axios';
import { env } from '../../../config/environment.js'

export default async function getDistanceMatrix(locations) {
  const coords = locations.map(loc => `${loc.latitude},${loc.longitude}`).join('|');
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${coords}&destinations=${coords}&key=${env.GOOGLE_MAPS_API_KEY}`;

  const res = await axios.get(url);
  return res.data;
}
