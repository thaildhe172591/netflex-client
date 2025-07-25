import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircleIcon } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div>
      <div className="space-y-6">
        <div className="mb-2">
          <h1 className="text-lg font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">
            We are committed to protecting your privacy and personal information
            when using the Netflex streaming platform.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US")}
          </p>
        </div>

        <Alert variant="destructive" className="mb-0">
          <AlertCircleIcon />
          <AlertTitle>Important notice</AlertTitle>
          <AlertDescription>
            <p>
              This website is developed{" "}
              <strong>solely for educational and research purposes</strong>. We
              do not encourage copyright infringement and recommend users
              utilize legal streaming services.
            </p>
          </AlertDescription>
        </Alert>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">
              1. Information We Collect
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal information:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Username, email, and password when registering an account
                  </li>
                  <li>Profile information (display name, profile picture)</li>
                  <li>Language preferences and timezone settings</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage data:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Viewing history and watch time</li>
                  <li>Your ratings and comments</li>
                  <li>Favorites and watchlist</li>
                  <li>Content interaction statistics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Technical information:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>IP address and device information</li>
                  <li>Browser and operating system</li>
                  <li>Cookies and session data</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">
              2. How We Use Your Information
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Enhance experience:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Recommend relevant content</li>
                    <li>Customize interface</li>
                    <li>Optimize performance</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Educational purposes:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Analyze user behavior</li>
                    <li>UX/UI research</li>
                    <li>Test new features</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">
              3. Information Security
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Security measures:</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                    <div className="text-blue-600 dark:text-blue-400 font-medium">
                      🔒 Encryption
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      HTTPS and sensitive data encryption
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                    <div className="text-green-600 dark:text-green-400 font-medium">
                      🛡️ Authentication
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Two-factor authentication and security tokens
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                    <div className="text-purple-600 dark:text-purple-400 font-medium">
                      🚫 Access Control
                    </div>
                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                      Strict access control measures
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Security commitments:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>We do not sell or rent personal information</li>
                  <li>Data sharing only with explicit consent</li>
                  <li>Regular security measure updates</li>
                  <li>Compliance with international security standards</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">
              4. Your Rights
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Access and control rights:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm">
                        View and edit personal information
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm">
                        Download your personal data
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm">
                        Delete your account and data
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm">
                        Opt out of non-essential data collection
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">
                    How to exercise your rights:
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Contact us via:
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>📧 Email: ngobac20031016@gmail.com</li>
                      <li>📱 Support: 03658xx928</li>
                      <li>⏱️ Response time: 24-48 hours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left">
              5. Cookies and Tracking Technologies
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Types of cookies we use:</h4>
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded text-xs font-medium">
                        Essential
                      </span>
                      <h5 className="font-medium">Functional cookies</h5>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Store login information, language, and basic
                      customizations. Cannot be disabled.
                    </p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-medium">
                        Analytics
                      </span>
                      <h5 className="font-medium">Statistics cookies</h5>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Collect data about how you use the website to improve user
                      experience.
                    </p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs font-medium">
                        Optional
                      </span>
                      <h5 className="font-medium">Personalization cookies</h5>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Remember your preferences and suggest content that matches
                      your interests.
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-left">
              6. Information Sharing with Third Parties
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Commitment to non-commercialization of data
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  As this is an educational project, we <strong>DO NOT</strong>{" "}
                  share, sell, or rent personal information to any third parties
                  for commercial purposes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  Reasonable sharing scenarios:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">ℹ️</span>
                    <div className="text-sm">
                      <strong>Technical services:</strong> Hosting providers,
                      CDN to maintain website functionality
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">🎓</span>
                    <div className="text-sm">
                      <strong>Educational purposes:</strong> Sharing anonymized
                      data for research and development
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">⚖️</span>
                    <div className="text-sm">
                      <strong>Legal requirements:</strong> When required by
                      competent authorities
                    </div>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger className="text-left">
              7. Child Protection
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800 rounded-lg p-4">
                <h4 className="font-semibold text-pink-800 dark:text-pink-200 mb-2">
                  Commitment to child protection
                </h4>
                <p className="text-sm text-pink-700 dark:text-pink-300">
                  This website is not intended for children under 13 years old.
                  We do not knowingly collect personal information from
                  children.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Protection measures:</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Content control:</h5>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Age rating classification for content</li>
                      <li>Warnings for inappropriate content</li>
                      <li>Parental control features</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Data protection:</h5>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Age verification during registration</li>
                      <li>Removal of inappropriate accounts</li>
                      <li>Quick violation reporting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger className="text-left">
              8. Policy Changes
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Update process:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full p-2 text-sm font-bold min-w-[32px] text-center">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium">Advance notice</h5>
                      <p className="text-sm text-muted-foreground">
                        Email notification 30 days before changes take effect
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full p-2 text-sm font-bold min-w-[32px] text-center">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium">Clear explanation</h5>
                      <p className="text-sm text-muted-foreground">
                        Specify important changes and reasons for updates
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full p-2 text-sm font-bold min-w-[32px] text-center">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium">Your choice</h5>
                      <p className="text-sm text-muted-foreground">
                        Right to object and account deletion guidance if you
                        disagree
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9">
            <AccordionTrigger className="text-left">
              9. Contact and Support
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Primary contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📧</span>
                      <span>privacy@netflex.study</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🔒</span>
                      <span>security@netflex.study</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <span>(024) 1234-5678</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Support hours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday - Sunday:</span>
                      <span>9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emergency:</span>
                      <span>24/7</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  Frequently asked questions:
                </h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    Before contacting us, please check our <strong>FAQ</strong>{" "}
                    page or <strong>Security Settings</strong> in your account
                    for quick answers.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
