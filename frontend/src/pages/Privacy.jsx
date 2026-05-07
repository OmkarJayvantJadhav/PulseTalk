export default function Privacy() {
  return (
    <section className="section-padding pt-28 bg-white dark:bg-dark-bg-primary">
      <div className="container-custom max-w-4xl">
        <h1 className="text-display-sm font-display font-bold text-gray-900 dark:text-dark-text-primary mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-dark-text-secondary mb-8">
          This policy explains what data PulseTalk collects, how it is used, and the choices available to you.
        </p>

        <div className="space-y-6 text-gray-700 dark:text-dark-text-secondary">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary mb-2">1. Data we collect</h2>
            <p>
              We collect account information, usage data, and analysis content needed to provide and improve the service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary mb-2">2. How we use data</h2>
            <p>
              Data is used to authenticate users, process analysis requests, secure the platform, and improve product quality.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary mb-2">3. Data sharing</h2>
            <p>
              We do not sell personal data. We may share limited data with service providers who help operate the platform.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary mb-2">4. Your choices</h2>
            <p>
              You can update account details, request deletion where applicable, and contact support for privacy-related requests.
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
