import { Settings, User, Bell, Shield, Database, HelpCircle } from "lucide-react";

export default function SettingsPage() {
  const sections = [
    {
      id: "profile",
      title: "Admin Profile",
      description: "Manage your account details and login credentials.",
      icon: User,
      fields: [
        { label: "Display Name", value: "Council Administrator" },
        { label: "Email Address", value: "admin@lawsanse.org" },
      ]
    },
    {
      id: "conference",
      title: "Conference Details",
      description: "Set the core information for the 2.0 edition.",
      icon: Database,
      fields: [
        { label: "Event Name", value: "Lawsan SE Leadership Conference 2.0" },
        { label: "Registration Fee", value: "₦5,000" },
        { label: "Venue", value: "Godfrey Okoye University, Enugu" },
      ]
    },
    {
      id: "security",
      title: "Security & API",
      description: "Manage your integration keys and webhook status.",
      icon: Shield,
      fields: [
        { label: "Paystack Mode", value: "Test Mode" },
        { label: "Webhook URL", value: "https://lawsan-se.org/api/webhook/paystack" },
      ]
    }
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-forest-950">System Settings</h1>
        <p className="text-forest-500 text-sm">Configure and manage the Lawsan SE portal behavior.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="bg-white rounded-[2rem] border border-forest-100 shadow-sm overflow-hidden">
              <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-forest-50 rounded-xl flex items-center justify-center text-forest-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-forest-900 text-lg">{section.title}</h3>
                  </div>
                  <p className="text-sm text-forest-500 leading-relaxed">{section.description}</p>
                </div>
                
                <div className="flex-1 w-full space-y-6">
                  {section.fields.map((field) => (
                    <div key={field.label} className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-400">{field.label}</label>
                      <div className="w-full bg-forest-50 border border-forest-100 rounded-xl px-4 py-3 text-forest-800 font-medium text-sm">
                        {field.value}
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 flex justify-end">
                    <button className="text-gold-600 font-bold text-sm hover:text-gold-700 transition-colors">
                      Edit Section
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Support Footer */}
      <div className="p-8 bg-gold-50 border border-gold-100 rounded-[2rem] flex items-center gap-6">
        <div className="w-12 h-12 bg-gold-500 text-white rounded-2xl flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-gold-900">Need Technical Support?</h4>
          <p className="text-sm text-gold-700">Contact the developer team for assistance with API integrations or database issues.</p>
        </div>
      </div>
    </div>
  );
}
