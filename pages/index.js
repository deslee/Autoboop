import Head from "next/head";
import CatFinder from '../components/CatFinder/CatFinder'

export default class extends React.Component {
    render() {
        const isMobile = process.browser && 'ontouchstart' in document.documentElement

        return <React.Fragment>
            <Head>
                <title>Autoboop</title>
            </Head>
            <style global jsx>{`
                * {
                    margin: 0;
                    padding: 0;
                }

                html,
                body,
                body > div:first-child,
                div#__next {
                  height: 100%;
                }
            `}</style>
            <CatFinder
                requiredDelay={800}
                isMobile={isMobile}
            />
        </React.Fragment>
    }
}