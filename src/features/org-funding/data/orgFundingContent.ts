import type { OrgFundingDocumentKey } from "../services/orgFundingService";
import w9TemplateUrl from "../media/w9_updated.pdf";
import fundingApplicationTemplateUrl from "../media/OrgFundingApprovalForm_Treasurer.pdf";

/** Contact shown on the public page and in submission confirmations. */
export const ORG_FUNDING_CONTACT_EMAIL = "org-funding@ucmail.uc.edu";

/** Blank templates applicants should fill out before uploading. */
export const ORG_FUNDING_TEMPLATES = {
  w9: w9TemplateUrl,
  application: fundingApplicationTemplateUrl,
} as const;

/** High-level steps shown to student orgs on the public page. */
export interface OrgFundingProcessStep {
  title: string;
  description: string;
}

export const ORG_FUNDING_PROCESS_STEPS: OrgFundingProcessStep[] = [
  {
    title: "Submit your request",
    description:
      "Fill out the form below with your organization details and upload the required documents. This replaces the old email chains — everything lives in one place.",
  },
  {
    title: "Review by the committee",
    description:
      "The Org Funding chair and the treasurer are notified the moment you submit. They verify your documents against the funding checklist and reach out if anything is missing.",
  },
  {
    title: "Present / decision",
    description:
      "If a presentation date is required, you'll pick from the available dates. The committee reviews your request and follows up with an approval decision.",
  },
  {
    title: "Receive funding",
    description:
      "Once approved, funds are processed and you'll be notified. Keep an eye on the email you submitted with for any follow-ups.",
  },
];

/** Metadata for each required/optional document, reused across the form and admin checklist. */
export interface OrgFundingDocumentMeta {
  key: OrgFundingDocumentKey;
  label: string;
  /** Short helper text shown under the upload field. */
  hint: string;
  /** URL to the document's official form page. */
  url: string;
  /** Whether the document is always required (travel auth is conditional on travel). */
  required: boolean;
}

export const ORG_FUNDING_DOCUMENTS: OrgFundingDocumentMeta[] = [
  {
    key: "w9",
    label: "W-9",
    hint: "A completed W-9 form for your organization or the payee.",
    url: ORG_FUNDING_TEMPLATES.w9,
    required: true,
  },
  {
    key: "application",
    label: "Funding application",
    hint: "Download the blank template, fill it out, then upload the completed form.",
    url: ORG_FUNDING_TEMPLATES.application,
    required: true,
  },
  {
    key: "slides",
    label: "Presentation slides",
    hint: "The slide deck you will present to the committee.",
    url: "",
    required: true,
  },
  {
    key: "travelAuthorization",
    label: "Travel authorization",
    hint: "Only required if your request involves travel.",
    url: "",
    required: false,
  },
];
