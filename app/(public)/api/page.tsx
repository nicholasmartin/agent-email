import { Metadata } from "next";
import { WebPageSchema } from "@/components/schema/WebPage";

export const metadata: Metadata = {
  title: "API Documentation | Agent Email",
  description: "Learn how to integrate Agent Email's API into your applications to generate personalized emails for your leads.",
};

// Get the site URL from environment variables
const siteUrl = process.env.SITE_URL || 'https://agent-email.magloft.com';

export default function ApiDocumentationPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8 text-gray-100">
      {/* Structured Data */}
      <WebPageSchema
        name="API Documentation | Agent Email"
        description="Learn how to integrate Agent Email's API into your applications to generate personalized emails for your leads."
        url={`${siteUrl}/api`}
        datePublished="2025-05-03"
        dateModified={new Date().toISOString().split('T')[0]}
        breadcrumb={[
          { name: 'Home', item: siteUrl },
          { name: 'API Documentation', item: `${siteUrl}/api` },
        ]}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Agent Email API Documentation
        </h1>
        
        <p className="text-xl mb-8 text-gray-300">
          Integrate our AI-powered email generation directly into your lead capture systems.
        </p>

        <div className="space-y-12">
          {/* Authentication Section */}
          <section id="authentication" className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Authentication</h2>
            <p className="text-gray-300">
              All API requests require authentication using an API key. You can generate API keys in your dashboard under Settings &rarr; API.
            </p>
            <div className="bg-gray-800 p-4 rounded-md">
              <p className="text-sm font-mono mb-2 text-gray-300">Example:</p>
              <code className="block text-sm font-mono bg-gray-900 p-3 rounded overflow-x-auto">
                curl -X POST https://yourdomain.com/api/client/process-lead \<br />
                &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                &nbsp;&nbsp;-H "x-api-key: agemail_YOUR_API_KEY" \<br />
                &nbsp;&nbsp;-d '&#123;"firstName": "John", "lastName": "Doe", "email": "john@company.com"&#125;'
              </code>
            </div>
          </section>

          {/* Endpoints Section */}
          <section id="endpoints" className="space-y-8">
            <h2 className="text-2xl font-semibold text-white">API Endpoints</h2>
            
            {/* Process Lead Endpoint */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="bg-indigo-600 text-white px-2 py-1 rounded text-sm font-mono">POST</span>
                <h3 className="text-xl font-medium text-white">/api/client/process-lead</h3>
              </div>
              <p className="text-gray-300">
                Process a new lead and generate a personalized email based on their company information.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Request Body</h4>
                  <div className="bg-gray-800 p-4 rounded-md">
                    <pre className="text-sm font-mono text-gray-300">
{`{
  "firstName": "John",      // Required: Lead's first name
  "lastName": "Doe",        // Required: Lead's last name
  "email": "john@company.com", // Required: Lead's business email
  "templateId": "uuid"      // Optional: Specific prompt template ID to use
}`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">Successful Response (200 OK)</h4>
                  <div className="bg-gray-800 p-4 rounded-md">
                    <pre className="text-sm font-mono text-gray-300">
{`{
  "success": true,
  "jobId": "uuid",
  "emailSubject": "Subject line for the generated email",
  "emailBody": "Full body content of the generated email",
  "emailDraft": "Full email content (legacy field)",
  "message": "Lead processed successfully"
}`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">Non-Business Email Response (200 OK)</h4>
                  <div className="bg-gray-800 p-4 rounded-md">
                    <pre className="text-sm font-mono text-gray-300">
{`{
  "error": "Not a business email domain",
  "businessEmail": false
}`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">Error Response (4xx/5xx)</h4>
                  <div className="bg-gray-800 p-4 rounded-md">
                    <pre className="text-sm font-mono text-gray-300">
{`{
  "error": "Error message",
  "success": false,
  "status": "error",
  "message": "Detailed error message"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Get Jobs Endpoint */}
            <div className="space-y-4 pt-4 border-t border-gray-800">
              <div className="flex items-center space-x-2">
                <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-mono">GET</span>
                <h3 className="text-xl font-medium text-white">/api/client/jobs</h3>
              </div>
              <p className="text-gray-300">
                Retrieve a list of jobs for your account with pagination and filtering options.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Query Parameters</h4>
                  <div className="bg-gray-800 p-4 rounded-md">
                    <pre className="text-sm font-mono text-gray-300">
{`limit    // Optional: Number of results per page (default: 10)
page     // Optional: Page number (default: 1)
status   // Optional: Filter by job status (pending, processing, completed, failed, etc.)`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">Successful Response (200 OK)</h4>
                  <div className="bg-gray-800 p-4 rounded-md">
                    <pre className="text-sm font-mono text-gray-300">
{`{
  "jobs": [
    {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@company.com",
      "domain": "company.com",
      "status": "completed",
      "created_at": "2025-01-01T12:00:00Z",
      "updated_at": "2025-01-01T12:05:00Z",
      "completed_at": "2025-01-01T12:05:00Z",
      "error_message": null
    },
    // More jobs...
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Job Status Section */}
          <section id="job-status" className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Job Status Values</h2>
            <p className="text-gray-300">
              Jobs progress through various statuses as they are processed:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-md">
                <h3 className="font-medium text-white mb-2">pending</h3>
                <p className="text-gray-300 text-sm">Job has been created but not yet processed</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <h3 className="font-medium text-white mb-2">scraping</h3>
                <p className="text-gray-300 text-sm">System is extracting information from the company website</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <h3 className="font-medium text-white mb-2">generating</h3>
                <p className="text-gray-300 text-sm">AI is creating a personalized email based on the scraped data</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <h3 className="font-medium text-white mb-2">sending</h3>
                <p className="text-gray-300 text-sm">Email is being sent (demo flow only)</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <h3 className="font-medium text-white mb-2">completed</h3>
                <p className="text-gray-300 text-sm">Job has been successfully processed</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <h3 className="font-medium text-white mb-2">failed</h3>
                <p className="text-gray-300 text-sm">Job processing encountered an error</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <h3 className="font-medium text-white mb-2">rejected</h3>
                <p className="text-gray-300 text-sm">Job was rejected (e.g., not a business email)</p>
              </div>
            </div>
          </section>

          {/* Integration Guide Section */}
          <section id="integration-guide" className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Integration Guide</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-white mb-2">1. Generate an API Key</h3>
                <p className="text-gray-300">
                  Log in to your Agent Email dashboard and navigate to Settings &rarr; API to generate a new API key.
                  Store this key securely as it will only be displayed once.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-white mb-2">2. Create Custom Prompt Templates</h3>
                <p className="text-gray-300">
                  Navigate to Projects in your dashboard to create custom email templates with variables like &#123;&#123;companyName&#125;&#125;, &#123;&#123;productDescription&#125;&#125;, etc.
                  These will be used when generating personalized emails.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-white mb-2">3. Integrate with Your Lead Forms</h3>
                <p className="text-gray-300">
                  When a lead submits your form, send their information to our API. Here's an example using JavaScript:
                </p>
                <div className="bg-gray-800 p-4 rounded-md mt-2">
                  <pre className="text-sm font-mono text-gray-300">
{`// Example JavaScript integration
async function processLead(firstName, lastName, email) {
  try {
    const response = await fetch('https://yourdomain.com/api/client/process-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY'
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        // Optional: specify a template ID
        templateId: 'your-template-id'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Email was successfully generated
      console.log('Email Subject:', data.emailSubject);
      console.log('Email Body:', data.emailBody);
      
      // Use the generated email in your system
      // e.g., send it through your email provider
    } else if (data.businessEmail === false) {
      // Not a business email
      console.log('Not a business email domain');
    } else {
      // Other error
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('API request failed:', error);
  }
}`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-white mb-2">4. Monitor Your Jobs</h3>
                <p className="text-gray-300">
                  Use the jobs endpoint to monitor the status of your lead processing jobs and track performance.
                </p>
              </div>
            </div>
          </section>

          {/* Rate Limits Section */}
          <section id="rate-limits" className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Rate Limits</h2>
            <p className="text-gray-300">
              API rate limits vary by plan. Please refer to your account dashboard for your current limits.
              If you exceed your rate limits, the API will return a 429 Too Many Requests response.
            </p>
          </section>

          {/* Support Section */}
          <section id="support" className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Support</h2>
            <p className="text-gray-300">
              If you need help with the API or have any questions, please contact our support team at 
              <a href="mailto:support@agentemail.com" className="text-indigo-400 hover:text-indigo-300 ml-1">support@agentemail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
