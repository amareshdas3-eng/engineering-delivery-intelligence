import type {
  AssuranceFinding,
  ScheduleRecord,
  VendorDocumentRecord,
  InterfaceRecord,
  PunchListRecord,
} from '../types/edi';

/**
 * Prevents CSV Formula Injection (CWE-1236) by prefixing dangerous leading characters
 * (=, +, -, @, \t, \r) with a single quote (') and escaping double quotes.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const raw = String(value);
  const trimmed = raw.trim();
  const dangerousPrefix = /^[=+\-@\t\r]/;
  const safeContent = dangerousPrefix.test(trimmed) ? `'${raw}` : raw;
  return `"${safeContent.replace(/"/g, '""')}"`;
}

/**
 * Exports verified findings into CSV with CWE-1236 formula sanitization on every cell.
 */
export function exportFindingsToCsv(findings: AssuranceFinding[]): string {
  const headers = [
    'Finding ID',
    'Rule ID',
    'RAG',
    'Severity',
    'Likelihood',
    'Category',
    'Epistemic Classification',
    'Title',
    'Source File',
    'Source Record ID',
    'Trigger Reason',
    'Evidence Available',
    'Evidence Missing',
    'Recommended Action',
    'Accountable Role',
    'Suggested Due Date',
    'Review Status',
    'Reviewer Name',
    'Reviewed Timestamp',
    'Reviewer Comments',
  ];

  const rows = findings.map((f) =>
    [
      f.findingId,
      f.ruleId,
      f.rag,
      f.severity,
      f.likelihood,
      f.category,
      f.epistemicClass,
      f.title,
      f.sourceFile,
      f.sourceRecordId,
      f.triggerReason,
      f.evidenceAvailable,
      f.evidenceMissing,
      f.recommendedAction,
      f.accountableRole,
      f.suggestedDueDate,
      f.reviewState.status,
      f.reviewState.reviewerName || 'Unreviewed',
      f.reviewState.reviewedAt || '',
      f.reviewState.comments || '',
    ]
      .map(sanitizeCsvCell)
      .join(',')
  );

  return [headers.map(sanitizeCsvCell).join(','), ...rows].join('\r\n');
}

export function exportScheduleToCsv(records: ScheduleRecord[]): string {
  const headers = [
    'Activity ID',
    'WBS',
    'Activity Name',
    'Baseline Finish',
    'Forecast Finish',
    'Actual Finish',
    'Status',
    'Predecessors',
    'Linked Interfaces',
    'Linked Documents',
  ];
  const rows = records.map((r) =>
    [
      r.activityId,
      r.wbs,
      r.activityName,
      r.baselineFinish,
      r.forecastFinish,
      r.actualFinish || '',
      r.status,
      r.predecessors.join('; '),
      r.linkedInterfaces.join('; '),
      r.linkedDocuments.join('; '),
    ]
      .map(sanitizeCsvCell)
      .join(',')
  );
  return [headers.map(sanitizeCsvCell).join(','), ...rows].join('\r\n');
}

export function exportDocumentsToCsv(records: VendorDocumentRecord[]): string {
  const headers = [
    'Doc ID',
    'Title',
    'Vendor Name',
    'Equipment Tag',
    'Revision',
    'Required By Date',
    'Submission Status',
    'Linked Activity ID',
  ];
  const rows = records.map((r) =>
    [
      r.docId,
      r.title,
      r.vendorName,
      r.equipmentTag,
      r.revision,
      r.requiredByDate,
      r.submissionStatus,
      r.linkedActivityId,
    ]
      .map(sanitizeCsvCell)
      .join(',')
  );
  return [headers.map(sanitizeCsvCell).join(','), ...rows].join('\r\n');
}

export function exportInterfacesToCsv(records: InterfaceRecord[]): string {
  const headers = [
    'Interface ID',
    'Title',
    'Lead Party',
    'Interface Party',
    'System Tag',
    'Required Resolution Date',
    'Status',
    'Impacted Milestone ID',
    'Technical Details',
  ];
  const rows = records.map((r) =>
    [
      r.interfaceId,
      r.title,
      r.leadParty,
      r.interfaceParty,
      r.systemTag,
      r.requiredResolutionDate,
      r.status,
      r.impactedMilestoneId,
      r.technicalDetails,
    ]
      .map(sanitizeCsvCell)
      .join(',')
  );
  return [headers.map(sanitizeCsvCell).join(','), ...rows].join('\r\n');
}

export function exportPunchListToCsv(records: PunchListRecord[]): string {
  const headers = [
    'Punch ID',
    'Equipment Tag',
    'Subsystem',
    'Category',
    'Description',
    'Status',
    'Closure Evidence Ref',
    'Verified By Role',
  ];
  const rows = records.map((r) =>
    [
      r.punchId,
      r.equipmentTag,
      r.subsystem,
      r.category,
      r.description,
      r.status,
      r.closureEvidenceRef || '',
      r.verifiedByRole || '',
    ]
      .map(sanitizeCsvCell)
      .join(',')
  );
  return [headers.map(sanitizeCsvCell).join(','), ...rows].join('\r\n');
}

/**
 * Standard RFC 4180 CSV line parser supporting quoted values with escaped quotes and commas.
 */
export function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);

  for (const line of lines) {
    const row: string[] = [];
    let insideQuote = false;
    let entry = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuote && line[i + 1] === '"') {
          entry += '"';
          i++;
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        row.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry.trim());
    rows.push(row);
  }

  return rows;
}
