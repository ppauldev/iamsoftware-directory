import { NextRequest, NextResponse } from 'next/server';
import { sendCompanySubmissionEmail, CompanySubmission } from '@/lib/email-utils';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate submission data
    if (!body.name || !body.url) {
      return NextResponse.json(
        { success: false, message: 'Company name and URL are required' },
        { status: 400 }
      );
    }

    // Prepare submission data
    const submission: CompanySubmission = {
      name: body.name,
      url: body.url,
      description: body.description,
    };

    // Send email
    const result = await sendCompanySubmissionEmail(submission);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({ success: true, message: 'Company submission received' });
  } catch (error) {
    console.error('Error submitting company:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 