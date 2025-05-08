import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Recipient {
  firstName: string;
  lastName: string;
  companyDomain: string;
}

interface EmailTemplate {
  subject: string;
  body: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [newRecipient, setNewRecipient] = useState<Recipient>({
    firstName: '',
    lastName: '',
    companyDomain: ''
  });
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate>({
    subject: '',
    body: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddRecipient = () => {
    if (newRecipient.firstName && newRecipient.lastName && newRecipient.companyDomain) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient({ firstName: '', lastName: '', companyDomain: '' });
    }
  };

  const handleGenerateTemplate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipients })
      });
      const template = await response.json();
      setEmailTemplate(template);
    } catch (error) {
      console.error('Failed to generate template:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmails = async () => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          template: emailTemplate
        })
      });
      setRecipients([]);
      setEmailTemplate({ subject: '', body: '' });
    } catch (error) {
      console.error('Failed to send emails:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recipients Section */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Add Recipients</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={newRecipient.firstName}
                    onChange={(e) => setNewRecipient({ ...newRecipient, firstName: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newRecipient.lastName}
                    onChange={(e) => setNewRecipient({ ...newRecipient, lastName: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Company Domain"
                    value={newRecipient.companyDomain}
                    onChange={(e) => setNewRecipient({ ...newRecipient, companyDomain: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <button
                  onClick={handleAddRecipient}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Recipient
                </button>
              </div>

              {recipients.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recipients List</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recipients.map((recipient, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {recipient.firstName} {recipient.lastName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {recipient.companyDomain}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Template Section */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Email Template</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Subject"
                  value={emailTemplate.subject}
                  onChange={(e) => setEmailTemplate({ ...emailTemplate, subject: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <textarea
                  placeholder="Email body"
                  value={emailTemplate.body}
                  onChange={(e) => setEmailTemplate({ ...emailTemplate, body: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-48"
                />
                <div className="flex space-x-4">
                  <button
                    onClick={handleGenerateTemplate}
                    disabled={isGenerating || recipients.length === 0}
                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Template'}
                  </button>
                  <button
                    onClick={handleSendEmails}
                    disabled={!emailTemplate.subject || !emailTemplate.body || recipients.length === 0}
                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Emails
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 