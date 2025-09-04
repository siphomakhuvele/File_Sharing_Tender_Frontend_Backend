import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { FileText, Shield, Users } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-white space-y-8 lg:pr-8">
          <div>
            <h1 className="text-5xl font-bold mb-4">TenderPro</h1>
            <p className="text-xl opacity-90">
              Streamline your tender process with our comprehensive file sharing and bidding platform
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Secure File Sharing</h3>
                <p className="opacity-80">Upload and share tender documents securely with built-in version control and access management.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Multi-Role Management</h3>
                <p className="opacity-80">Dedicated dashboards for administrators, bidders, and issuers with role-specific features.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Transparent Process</h3>
                <p className="opacity-80">Complete audit trails and real-time notifications ensure transparency throughout the tender process.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div>
          {isLogin ? (
            <LoginForm onToggleForm={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleForm={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};