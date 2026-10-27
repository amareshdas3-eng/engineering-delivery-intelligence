// src/types/edi.ts

export type FindingCategory =
  | 'SCHEDULE_EXCEPTION'
  | 'DOCUMENT_GAP'
  | 'UNRESOLVED_INTERFACE'
  | 'COMMISSIONING_EVIDENCE_GAP'
  | 'DATA_QUALITY_ERROR';

export type EpistemicClass =
  | 'CONFIRMED_DATA_QUALITY_ISSUE'
  | 'RULE_BASED_RISK_INDICATOR'
  | 'MISSING_EVIDENCE'
  | 'AI_HYPOTHESIS';

export type RAGStatus = 'RED' | 'AMBER' | 'GREEN';

export type ReviewStatus =
  | 'PENDING_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'MORE_EVIDENCE_REQUIRED';

export interface ScheduleRecord {
  activityId: string;
  activityName: string;
  wbs: string;
  baselineFinish: string; // YYYY-MM-DD
  forecastFinish: string; // YYYY-MM-DD
  actualFinish?: string;  // YYYY-MM-DD
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  predecessors: string[];
  linkedInterfaces: string[];
  linkedDocuments: string[];
}

export interface VendorDocumentRecord {
  docId: string;
  title: string;
  vendorName: string;
  equipmentTag: string;
  revision: string;
  requiredByDate: string; // YYYY-MM-DD
  submissionStatus: 'MISSING' | 'SUBMITTED' | 'APPROVED_CODE_1' | 'COMMENTED_CODE_2' | 'REJECTED_CODE_3';
  linkedActivityId: string;
}

export interface InterfaceRecord {
  interfaceId: string;
  title: string;
  leadParty: string;
  interfaceParty: string;
  systemTag: string;
  requiredResolutionDate: string; // YYYY-MM-DD
  status: 'OPEN' | 'RESOLVED' | 'OVERDUE';
  impactedMilestoneId: string;
  technicalDetails: string;
}

export interface PunchListRecord {
  punchId: string;
  equipmentTag: string;
  subsystem: string;
  category: 'A' | 'B' | 'C'; // Category A = Pre-energization blocker
  description: string;
  status: 'OPEN' | 'CLOSED';
  closureEvidenceRef?: string;
  verifiedByRole?: string;
}

export interface AssuranceFinding {
  findingId: string;
  ruleId: string;
  title: string;
  category: FindingCategory;
  epistemicClass: EpistemicClass;
  rag: RAGStatus;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  likelihood: 'HIGH' | 'MEDIUM' | 'LOW';
  impactDescription: string;
  sourceFile: 'SCHEDULE' | 'VENDOR_DOCS' | 'INTERFACES' | 'PUNCH_LIST';
  sourceRecordId: string;
  sourceFields: Record<string, string | undefined>;
  evidenceAvailable: string;
  evidenceMissing: string;
  triggerReason: string;
  recommendedAction: string;
  accountableRole: string;
  suggestedDueDate: string;
  reviewState: {
    status: ReviewStatus;
    reviewerName?: string;
    reviewedAt?: string;
    comments?: string;
  };
}

export interface ProjectMeta {
  projectId: string;
  projectName: string;
  sector: string;
  voltageClass: string;
  contractModel: string;
  baselineDate: string;
  targetCodDate: string;
  client: string;
  epcContractor: string;
}

export interface TestOracleEntry {
  anomalyId: string;
  sourceDataset: 'Schedule' | 'Vendor Docs' | 'Interfaces' | 'Punch List';
  recordId: string;
  plantedDefect: string;
  expectedRuleTriggered: string;
  expectedRAG: RAGStatus;
  epistemicClass: EpistemicClass;
}

export interface AgentTelemetry {
  agentId: string;
  agentName: string;
  role: string;
  executionMode: 'DETERMINISTIC' | 'ZERO_TRUST_AUDITOR' | 'HYPOTHESIS_SYNTHESIZER';
  inputRecordCount: number;
  findingsProduced: number;
  quarantinedCount: number;
  citationIntegrity: '100% VERIFIED' | 'FAILED_QUARANTINED';
  latencyMs: number;
  summary: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  findingId?: string;
  details: string;
}
