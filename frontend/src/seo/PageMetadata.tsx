import Head from "next/head";

const defaultTitle = "Plaid Integration";

const defaultDescription =
  "Plaid Integration is a modern fintech integration project focused on securely connecting bank accounts, verifying financial data, and building seamless payment experiences using Plaid APIs and other financial service providers. Explore account linking, transactions, ACH payments, identity verification, and future fintech integrations in one scalable platform.";

const defaultKeywords =
  "Plaid integration, Plaid API, fintech integration, bank account linking, ACH payments, payment gateway, financial APIs, transaction data, account verification, secure banking integration, Plaid sandbox, payment processing, fintech platform, banking APIs, financial technology";

type Props = {
  title?: string;
  description?: string;
  keywords?: string;
};

const PageMetadata = ({
  title = defaultTitle,
  description = defaultDescription,
  keywords = defaultKeywords,
}: Props) => {
  return (
    <Head>
      <title>{`${title} | Plaid Integration`}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <meta name="author" content="Plaid Integration" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={`${title} | Plaid Integration`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | Plaid Integration`} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
};

export default PageMetadata;
