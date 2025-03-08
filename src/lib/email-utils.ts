import { Resend } from 'resend';

export interface CompanySubmission {
  name: string;
  url: string;
  description?: string;
}

// Function to send company submission email
export async function sendCompanySubmissionEmail(submission: CompanySubmission) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      throw new Error('Admin email is not configured');
    }

    const { data, error } = await resend.emails.send({
      from: 'IAM Directory <no-reply@iamsoftware.directory>',
      to: adminEmail,
      subject: `New Company Submission: ${submission.name}`,
      text: `
New company submission for the IAM Directory:

Company Name: ${submission.name}
Website URL: ${submission.url}
Description: ${submission.description || 'Not provided'}
      `,
      html: `
<h2>New Company Submission</h2>
<p>A new company has been submitted for the IAM Directory:</p>

<ul>
  <li><strong>Company Name:</strong> ${submission.name}</li>
  <li><strong>Website URL:</strong> ${submission.url}</li>
  <li><strong>Description:</strong> ${submission.description || 'Not provided'}</li>
</ul>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 