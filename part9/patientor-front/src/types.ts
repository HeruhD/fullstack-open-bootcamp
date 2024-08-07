// import { HospitalEntry } from "./types";
// import { HealthCheckEntry } from "./../../patientor-back/src/types";
//backend types copy
export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
// export interface Entry {}

export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;
//Patient type without ssn field
export type NonssnPatient = Omit<Patient, "ssn" | "entries">;

export type NewPatient = Omit<Patient, "id">;

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

interface SickLeave {
  startDate: string;
  endDate: string;
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}
export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}
interface Discharge {
  date: string;
  criteria: string;
}
export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: Discharge;
}
export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave: SickLeave;
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;

export type EntryFormValues = Pick<BaseEntry, "date" | "specialist" | "description"> & {
  type: OccupationalHealthcareEntry["type"] | HospitalEntry["type"] | HealthCheckEntry["type"];
  diagnosisCodes: Array<Diagnosis["code"]>;
};

export type HospitalFormValues = Pick<HospitalEntry, "discharge">;
export type OccupationalHealthcareFormValues = Pick<OccupationalHealthcareEntry, "employerName" | "sickLeave">;
export type HealthCheckEntryFormValues = Pick<HealthCheckEntry, "healthCheckRating">;
