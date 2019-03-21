import Document, { Head, Main, NextScript } from 'next/document';
import { Fragment } from 'react';

export default class extends Document {
    static async getInitialProps(ctx) {
        const isProduction = process.env.NODE_ENV === 'production';
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps, isProduction };
    }

    setGoogleTags() {
        return {
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){ dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', 'UA-69448796-4', { 'transport_type': 'beacon' });
            `
        };
    }

    render() {
        const { isProduction } = this.props;
        return (
            <html>
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel='shortcut icon' type='image/x-icon' href='/static/favicon.ico' />


                    <meta property="og:url" content="https://autoboop.com/" />
                    <meta property="og:image" content="https://autoboop.com/static/tina.jpg" />
                    <meta property="og:title" content="Autoboop" />
                    <meta property="og:type" content="website" />
                    <meta property="og:description" content="Boop some cats..." />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                    {isProduction && (
                        <Fragment>
                            <script
                                async
                                src="https://www.googletagmanager.com/gtag/js?id=UA-69448796-4"
                            />
                            <script dangerouslySetInnerHTML={this.setGoogleTags()} />
                        </Fragment>
                    )}
                </body>
            </html>
        );
    }
}