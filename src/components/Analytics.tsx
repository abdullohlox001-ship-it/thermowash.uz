import Script from "next/script";

/** GA4 va/yoki GTM. ID'lar faqat .env orqali. Bo'sh bo'lsa — hech narsa yuklanmaydi. */
export default function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  const safe = (s: string) => /^[A-Z0-9-]+$/i.test(s);
  return (
    <>
      {gtm && safe(gtm) && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      )}
      {ga && safe(ga) && !gtm && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      )}
    </>
  );
}
