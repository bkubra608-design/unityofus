/**
 * VaccineShield Pro Types Definitions
 */

export type UserRole = "Worker" | "Nurse" | "Supervisor" | "Administrator";

export interface UserSession {
  username: string;
  role: UserRole;
  fullName: string;
  facilityCode: string;
  district: string;
}

export type DiseaseType =
  | "Polio"
  | "Measles"
  | "Tuberculosis (BCG)"
  | "Diphtheria"
  | "Tetanus"
  | "Pertussis (Whooping Cough)"
  | "Hepatitis B"
  | "Haemophilus Influenzae Type B (Hib)"
  | "Rotavirus Diarrhea"
  | "Pneumococcal Pneumonia"
  | "Typhoid"
  | "Rubella";

export interface VaccinationRecord {
  id: string;
  disease: DiseaseType;
  vaccineName: string;
  doseNumber: number; // e.g. 1st, 2nd, Booster
  administeredDate: string;
  administeredBy: string;
  batchNumber: string;
  status: "Completed" | "Pending" | "Missed";
  nextDueDate?: string;
  facility: string;
}

export interface Patient {
  id: string; // Unique POS Immunization Number e.g., VAX-2026-6731
  childName: string;
  fatherName: string;
  motherName: string;
  guardianContact: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  district: string;
  unionCouncil: string;
  registrationDate: string;
  avatarSeed: number;
  vaccinations: VaccinationRecord[];
}

export interface InventoryBatch {
  id: string; // Batch ID e.g., BATCH-POL-992
  disease: DiseaseType;
  vaccineName: string;
  barcode: string;
  quantityInHand: number;
  reservedQty: number;
  expiredQty: number;
  mfgDate: string;
  expiryDate: string;
  temperatureRequired: string; // e.g. "+2°C to +8°C"
  status: "Safe" | "Near Expiry" | "Expired" | "Low Stock";
  binLocation: string; // e.g., Freezer Box-A2
}

export interface ColdChainRefrigerator {
  id: string;
  name: string;
  currentTemp: number; // °C
  targetTempRange: { min: number; max: number };
  humidity: number; // %
  complianceRate: number; // %
  powerStatus: "Battery" | "Grid" | "Offline";
  status: "Safe" | "Warning" | "Critical";
  refrigerationGas: string;
  lastMaintained: string;
}

export interface TemperatureLog {
  timestamp: string;
  temp: number;
  status: "Safe" | "Warning" | "Critical";
}

export interface ReconciliationShift {
  id: string;
  date: string;
  workerName: string;
  role: UserRole;
  openingStock: { [vaccine: string]: number };
  administeredQty: { [vaccine: string]: number };
  remainingStock: { [vaccine: string]: number };
  physicalCount: { [vaccine: string]: number };
  variance: { [vaccine: string]: number };
  supervisorSignOff: boolean;
  supervisorName?: string;
  digitalSignaturePath?: string; // Simulated line points
  status: "Draft" | "Pending Approval" | "Approved";
  notes?: string;
}

export interface NotificationLog {
  id: string;
  patientId: string;
  patientName: string;
  contactNumber: string;
  disease: DiseaseType;
  channel: "SMS" | "Email" | "WhatsApp";
  message: string;
  scheduledTime: string;
  status: "Queued" | "Sent" | "Failed";
}

export interface FieldFeedback {
  id: string;
  name: string;
  role: UserRole;
  rating: number;
  comment: string;
  date: string;
  facility: string;
  successStory: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  details: string;
  ipAddress: string;
}
