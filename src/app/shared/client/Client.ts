import axios from 'axios';
import { environment } from '../../@core/const/environment';
export const Client = axios.create({
    baseURL: `http://${environment.API_IP}:${environment.API_PORT}`
})
