import axios from "axios";

export interface AlumniProfile {
  id: string;
  name: string;
  graduationYear: number;
  roleCompany: string;
  quote: string;
  imageURL: string | null;
}

const HOST_URL = import.meta.env.VITE_HOST_URL as string | undefined;
const baseURL = HOST_URL ?? "";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: false,
});

export async function getAlumniProfiles(): Promise<AlumniProfile[]> {
  const { data } = await axiosInstance.get<AlumniProfile[]>("/api/alumni/");

  return data;
}