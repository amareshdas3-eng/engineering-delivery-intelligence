// src/engine/__tests__/assuranceEngine.test.ts
import { describe, it, expect } from 'vitest';
import { runDeterministicAssurance, computeDatasetHash } from '../assuranceEngine';
import { runMultiAgentSwarm } from '../agentOrchestrator';
import {
  SYNTHETIC_REFERENCE_DATE,
  INITIAL_SCHEDULE,
  INITIAL_DOCUMENTS,
  INITIAL_INTERFACES,
  INITIAL_PUNCH_LIST,
  TEST_ORACLE_ANOMALIES,
} from '../../data/syntheticProjectData';
import { sanitizeCsvCell, exportFindingsToCsv } from '../../utils/csvSecurity';

describe('EDI Deterministic Assurance Engine & Test Oracle Verification', () => {
  const findings = runDeterministicAssurance(
    SYNTHETIC_REFERENCE_DATE,
    INITIAL_SCHEDULE,
    INITIAL_DOCUMENTS,
    INITIAL_INTERFACES,
    INITIAL_PUNCH_LIST
  );

  it('detects all 10 planted Test Oracle anomalies with exact deterministic finding IDs', () => {
    const expectedOracleIds = [
      'FND-SCH-SLIP-ACT-104',     // ORC-01: 21d GIS Erection slip
      'FND-SCH-UNSUP-ACT-108',    // ORC-02: Completed without actualFinish
      'FND-DOC-OVR-DOC-302-Rev 0',// ORC-03: Missing 87T Setting Calc
      'FND-DQ-DOC-DOC-305',       // ORC-04: Duplicate ID DOC-305
      'FND-DOC-OVR-DOC-309-Rev 1',// ORC-05: Rejected Code 3 GIS Schematic overdue
      'FND-INT-OPEN-INT-202',     // ORC-06: Overdue IEC 61850 interface
      'FND-INT-OPEN-INT-205',     // ORC-07: Overdue NGR CT polarity interface
      'FND-PNC-NOEVID-PNC-401',   // ORC-08: Cat A closed without evidence
      'FND-PNC-CATA-PNC-404',     // ORC-09: Cat A open Buchholz relay trip check
      'FND-PNC-NOEVID-PNC-412',   // ORC-10: Cat B closed with whitespace evidence
    ];

    const actualIds = findings.map((f) => f.findingId);
    for (const expectedId of expectedOracleIds) {
      expect(actualIds).toContain(expectedId);
    }
    expect(TEST_ORACLE_ANOMALIES.length).toBe(10);
  });

  it('enforces that every finding defaults to PENDING_REVIEW without automatic approval', () => {
    expect(findings.length).toBeGreaterThan(0);
    for (const finding of findings) {
      expect(finding.reviewState.status).toBe('PENDING_REVIEW');
      expect(finding.reviewState.reviewerName).toBeUndefined();
    }
  });

  it('does not produce false positives for compliant records', () => {
    // ACT-101 is completed with valid actualFinish -> should NOT trigger unsupported completion
    const act101Finding = findings.find((f) => f.sourceRecordId === 'ACT-101' && f.ruleId === 'RULE-SCH-003');
    expect(act101Finding).toBeUndefined();

    // PNC-402 is closed with valid closureEvidenceRef 'QCR-GIS-014-REV1' -> should NOT trigger NOEVID
    const pnc402Finding = findings.find((f) => f.sourceRecordId === 'PNC-402' && f.ruleId === 'RULE-PNC-001');
    expect(pnc402Finding).toBeUndefined();
  });

  it('sanitizes spreadsheet formula injection payloads (CWE-1236)', () => {
    const maliciousPayloads = [
      '=cmd|"/C calc"!A0',
      '+1+2',
      '-500',
      '@SUM(A1:A10)',
      '\t=2+3',
      '\r=4+5',
    ];

    for (const payload of maliciousPayloads) {
      const sanitized = sanitizeCsvCell(payload);
      // Must be wrapped in quotes and start with single quote
      expect(sanitized.startsWith(`"'`)).toBe(true);
    }

    // Normal safe strings should NOT have the single quote prepended
    const safeString = sanitizeCsvCell('Normal Text 33 kV');
    expect(safeString).toBe('"Normal Text 33 kV"');
  });

  it('produces valid CSV export containing all findings with headers', () => {
    const csv = exportFindingsToCsv(findings);
    expect(csv).toContain('Finding ID');
    expect(csv).toContain('FND-SCH-SLIP-ACT-104');
    expect(csv).toContain('FND-PNC-CATA-PNC-404');
  });

  it('computes repeatable dataset SHA-256 integrity hash', () => {
    const hash1 = computeDatasetHash(
      INITIAL_SCHEDULE,
      INITIAL_DOCUMENTS,
      INITIAL_INTERFACES,
      INITIAL_PUNCH_LIST
    );
    const hash2 = computeDatasetHash(
      INITIAL_SCHEDULE,
      INITIAL_DOCUMENTS,
      INITIAL_INTERFACES,
      INITIAL_PUNCH_LIST
    );
    expect(hash1).toBe(hash2);
    expect(hash1.startsWith('sha256:edi-')).toBe(true);
  });

  it('runs the 6-Agent Swarm and verifies that AGT-05 Epistemic Auditor passes zero-trust check', () => {
    const result = runMultiAgentSwarm(
      SYNTHETIC_REFERENCE_DATE,
      INITIAL_SCHEDULE,
      INITIAL_DOCUMENTS,
      INITIAL_INTERFACES,
      INITIAL_PUNCH_LIST
    );

    expect(result.auditPassed).toBe(true);
    expect(result.quarantinedFindings.length).toBe(0);
    expect(result.telemetry.length).toBe(6);
    expect(result.verifiedFindings.length).toBe(findings.length);

    const agt5 = result.telemetry.find((t) => t.agentId === 'AGT-05');
    expect(agt5?.citationIntegrity).toBe('100% VERIFIED');
  });
});
