import Head from "next/head";
import CatFinder from '../components/CatFinder/CatFinder'

export default class extends React.Component {
    render() {
        const isMobile = process.browser && 'ontouchstart' in document.documentElement

        return <React.Fragment>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Autoboop</title>
            </Head>
            <style global jsx>{`
                * {
                    margin: 0;
                    padding: 0;
                }
            `}</style>
            <CatFinder
                requiredDelay={500}
                isMobile={isMobile}
            />
        </React.Fragment>
    }
}